// Analyze the existing rendered feature-track JSON in the source-image plane.
// Inter-frame interpolation is a 2D image-plane approximation only. It does not
// infer wheel radius, axle steering, cart-body extent, yaw, or physical safety.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {places, route} from '../engine/s01e03.mjs';
import {occluders} from '../e03/route-depth.mjs';
import {
  GEOMETRY_EPSILON,
  analyzeFeatureTrack,
  analyzeFeatureTrace,
  convexHull,
  continuousPolylineAgainstPolygon,
  pointToSegmentDistance,
  pointInPolygon,
  polylineToPolygonBoundaryDistance,
  polylineToPolylineMinimumDistance,
  polygonsOverlap,
  projectPointToSegment,
  segmentToSegmentMinimumDistance,
  validateFeatureTrace
} from './e03_clearance_geometry.mjs';

const SOURCE_IMAGE = [1672, 941];
const VIEWPORTS = [[320, 740], [568, 320], [1366, 900]];
const FEATURES = ['footCenterline', 'leftWheel', 'rightWheel', 'handle'];
const routePath = route('H', 'T', 'tea_cart');
const reversePath = route('T', 'H', 'tea_cart');

const cargo = [[430, 628], [580, 579], [730, 580], [785, 620], [860, 640],
  [880, 689], [785, 727], [600, 728], [490, 709], [430, 688]];
const curbLip = [[1060, 715], [1095, 703], [1120, 692], [1147, 675]];
const curbToe = [[1060, 722], [1095, 710], [1120, 700], [1149, 681]];

const annotations = [
  {
    id: 'approximate-unloading-cargo', kind: 'polygon', points: cargo,
    source: 'scripts/audit_e03_cart_sweep.mjs:21-24 and content/season-01/s01e03/GATE3_M0_SLICE.md:83-89',
    purpose: 'Reuse the existing simplified central unloading silhouette as a bounded comparison region.',
    confidence: 'low',
    uncertain: 'It is not a full ink mask, obstacle solid, pavement boundary, or complete collision model.'
  },
  {
    id: 'candidate-curb-face-band', kind: 'polygon', points: [...curbLip, ...curbToe.toReversed()],
    source: 'docs/QUALITY_GATES_E03_E04.md:54-65, visual traces recorded 2026-11-19',
    purpose: 'Show the image-plane strip between the estimated curb lip and pavement-contact toe.',
    confidence: 'low',
    uncertain: 'Trace endpoints and the true curb ground contact are approximate. This strip is not an owner-approved no-go area.'
  },
  {
    id: 'west-approach-railing-trace', kind: 'polyline',
    points: [[247, 713], [353, 758], [473, 809], [575, 852], [654, 878]],
    source: 'docs/QUALITY_GATES_E03_E04.md:35-38',
    purpose: 'Retain the recorded visible railing trace for point-to-boundary comparison.',
    confidence: 'low',
    uncertain: 'Only a line trace is recorded. Railing width, floor contact, and a closed polygon are unknown.'
  },
  {
    id: 'tea-stall-planting-edge-trace', kind: 'polyline',
    points: [[1241, 651], [1275, 647], [1320, 649], [1371, 651], [1410, 649]],
    source: 'docs/QUALITY_GATES_E03_E04.md:35-38',
    purpose: 'Retain the recorded visible tea-stall planting edge for point-to-boundary comparison.',
    confidence: 'low',
    uncertain: 'The plants conceal the stall base and pavement. The trace is not a complete obstacle or floor boundary.'
  },
  ...occluders.flatMap(mask => mask.polygons.map((points, index) => ({
    id: `registered-${mask.id}-${index + 1}`,
    kind: 'polygon',
    points,
    source: 'e03/route-depth.mjs:11-39',
    purpose: 'Visual foreground/occlusion registration candidate, included to compare tracks with existing masks.',
    confidence: 'high for the existing image-space mask registration',
    uncertain: 'The registered mask is not a verified solid object, ground-plane surface, or collision boundary.'
  })))
];

async function currentCheckoutSha() {
  return execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
}

function rounded(value, places = 4) {
  if (value === null || value === undefined || !Number.isFinite(value)) return value ?? null;
  return Number(value.toFixed(places));
}

function roundedPoint(value) {
  return Array.isArray(value) ? value.map(coordinate => rounded(coordinate, 2)) : null;
}

function boundaryDistance(points, annotation) {
  return annotation.kind === 'polygon'
    ? continuousPolylineAgainstPolygon(points, annotation.points)
    : polylineToPolylineMinimumDistance(points, annotation.points);
}

function pointsForFeature(document, feature) {
  if (feature === 'footCenterline') return document.frames.map(frame => frame.foot);
  if (feature === 'leftWheel') return document.frames.map(frame => frame.wheels[0]);
  if (feature === 'rightWheel') return document.frames.map(frame => frame.wheels[1]);
  return document.frames.map(frame => frame.handle);
}

function nearestAuthoredEdge(foot, directedPath) {
  const nearest = directedPath.slice(1).map((next, index) => {
    const previous = directedPath[index];
    const projection = projectPointToSegment(foot, places[previous], places[next]);
    return {edge: `${previous}-${next}`, distance: projection.distance};
  }).reduce((best, candidate) => candidate.distance < best.distance ? candidate : best);
  return nearest.edge;
}

function makeFeatureSegmentRows(document, boundaries, directedPath) {
  const positions = Object.fromEntries(FEATURES.map(feature => [feature,
    pointsForFeature(document, feature)]));
  const segments = [];
  for (const feature of FEATURES) {
    const path = positions[feature];
    for (let index = 0; index < path.length - 1; index++) {
      const start = path[index];
      const end = path[index + 1];
      const footStart = document.frames[index].foot;
      const footEnd = document.frames[index + 1].foot;
      const footMidpoint = [(footStart[0] + footEnd[0]) / 2, (footStart[1] + footEnd[1]) / 2];
      for (const annotation of boundaries) {
        const result = boundaryDistance([start, end], annotation);
        const firstFraction = result.firstFraction ?? 0;
        const featurePosition = result.pointOnFirst ?? [
          start[0] + (end[0] - start[0]) * firstFraction,
          start[1] + (end[1] - start[1]) * firstFraction
        ];
        const authoredEdge = nearestAuthoredEdge(footMidpoint, directedPath);
        segments.push({
          feature,
          authoredRouteEdge: authoredEdge,
          boundaryId: annotation.id,
          fromFrame: index,
          toFrame: index + 1,
          interpolationFraction: rounded(firstFraction, 6),
          distancePx: rounded(result.distance),
          classification: result.classification,
          featurePosition: roundedPoint(featurePosition),
          boundaryPosition: roundedPoint(result.pointOnSecond),
          footAtClosestFeaturePosition: roundedPoint([
            footStart[0] + (footEnd[0] - footStart[0]) * firstFraction,
            footStart[1] + (footEnd[1] - footStart[1]) * firstFraction
          ])
        });
      }
    }
  }
  return segments;
}

function minimumRows(rows, fields) {
  const grouped = new Map();
  for (const row of rows) {
    const key = fields.map(field => row[field]).join('|');
    const previous = grouped.get(key);
    const value = row.distancePx ?? row.distance;
    const previousValue = previous?.distancePx ?? previous?.distance;
    if (!previous || value < previousValue) grouped.set(key, row);
  }
  return [...grouped.values()];
}

function turnVertices(directedPath) {
  return directedPath.slice(1, -1).flatMap((node, index) => {
    const before = places[directedPath[index]];
    const pivot = places[node];
    const after = places[directedPath[index + 2]];
    const incoming = [pivot[0] - before[0], pivot[1] - before[1]];
    const outgoing = [after[0] - pivot[0], after[1] - pivot[1]];
    const cross = incoming[0] * outgoing[1] - incoming[1] * outgoing[0];
    const dot = incoming[0] * outgoing[0] + incoming[1] * outgoing[1];
    return Math.abs(cross) <= GEOMETRY_EPSILON ? [] : [{node, point: pivot,
      turnDegrees: rounded(Math.atan2(cross, dot) * 180 / Math.PI, 2)}];
  });
}

function turnRiskMarkers(document, boundaries, directedPath) {
  return turnVertices(directedPath).map(turn => {
    const frameIndex = document.frames.reduce((best, frame, index) =>
      pointToSegmentDistance(frame.foot, turn.point, turn.point) <
        pointToSegmentDistance(document.frames[best].foot, turn.point, turn.point) ? index : best, 0);
    const frame = document.frames[frameIndex];
    const turnFrameFeatures = {
      footCenterline: frame.foot,
      leftWheel: frame.wheels[0],
      rightWheel: frame.wheels[1],
      handle: frame.handle
    };
    const featureBoundaryProximity = Object.entries(turnFrameFeatures).map(([feature, position]) => {
      const nearest = boundaries.map(annotation => ({
        boundaryId: annotation.id,
        ...boundaryDistance([position], annotation)
      })).reduce((best, candidate) => candidate.distance < best.distance ? candidate : best);
      return {
        feature,
        boundaryId: nearest.boundaryId,
        distancePx: rounded(nearest.distance),
        classification: nearest.classification,
        position: roundedPoint(position),
        boundaryPosition: roundedPoint(nearest.pointOnSecond ?? nearest.point)
      };
    });
    return {
      node: turn.node,
      footTarget: turn.point,
      signedImagePlaneDeflectionDegrees: turn.turnDegrees,
      nearestCapturedFrame: frameIndex,
      nearestFootDistancePx: rounded(pointToSegmentDistance(document.frames[frameIndex].foot, turn.point, turn.point)),
      featureBoundaryProximity,
      risk: 'REVIEW_REQUIRED',
      reason: 'The image-plane center path changes direction here. The capture has no steering, wheel radius, body width, or yaw model.'
    };
  });
}

function polygonEdges(points) {
  return points.map((start, index) => [start, points[(index + 1) % points.length]]);
}

function boundaryAgainstSweep(sweep, annotation) {
  let minimum = null;
  const sweepEdges = polygonEdges(sweep);
  if (annotation.kind === 'polygon' && polygonsOverlap(sweep, annotation.points)) {
    return {distance: 0, classification: 'overlap-or-contact'};
  }
  const boundaryEdges = annotation.kind === 'polygon'
    ? polygonEdges(annotation.points)
    : annotation.points.slice(1).map((point, index) => [annotation.points[index], point]);
  for (const [a, b] of sweepEdges) {
    for (const [c, d] of boundaryEdges) {
      const candidate = segmentToSegmentMinimumDistance(a, b, c, d);
      if (minimum === null || candidate.distance < minimum.distance) minimum = candidate;
    }
  }
  if (annotation.kind === 'polyline' && annotation.points.some(point => pointInPolygon(point, sweep) !== 'outside')) {
    return {distance: 0, classification: 'contact'};
  }
  return {
    distance: minimum?.distance ?? Infinity,
    classification: minimum?.distance === 0 ? 'contact' : 'separated'
  };
}

function visualEnvelopeSweepRows(document, boundaries, directedPath) {
  const rows = [];
  for (let index = 0; index < document.frames.length - 1; index++) {
    const first = document.frames[index];
    const second = document.frames[index + 1];
    const sweptPolygon = convexHull([...first.visualBounds, ...second.visualBounds]);
    const footMidpoint = [(first.foot[0] + second.foot[0]) / 2,
      (first.foot[1] + second.foot[1]) / 2];
    for (const annotation of boundaries) {
      rows.push({
        feature: 'cartDomBoxSweep',
        authoredRouteEdge: nearestAuthoredEdge(footMidpoint, directedPath),
        boundaryId: annotation.id,
        fromFrame: index,
        toFrame: index + 1,
        sweptPolygon,
        ...boundaryAgainstSweep(sweptPolygon, annotation)
      });
    }
  }
  return rows;
}

function svgOverlay(viewportDocuments, minima) {
  const image = Buffer.from(awaitableImage).toString('base64');
  const colors = {footCenterline: '#ffffff', leftWheel: '#28d7ff', rightWheel: '#ed58cf', handle: '#ff9d39'};
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SOURCE_IMAGE[0]}" height="${SOURCE_IMAGE[1]}" viewBox="0 0 ${SOURCE_IMAGE[0]} ${SOURCE_IMAGE[1]}">`,
    `<image href="data:image/webp;base64,${image}" width="${SOURCE_IMAGE[0]}" height="${SOURCE_IMAGE[1]}"/>`,
    '<rect x="16" y="14" width="930" height="92" rx="9" fill="#10252b" fill-opacity=".92"/>',
    '<text x="34" y="50" fill="#fff" font-family="sans-serif" font-size="25">E03 cart feature tracks · image-plane diagnostic</text>',
    '<text x="34" y="82" fill="#ffe3aa" font-family="sans-serif" font-size="17">Green = captured DOM-box sweep; dashed = reverse. Boundaries provisional; physical clearance OPEN.</text>'
  ];
  for (const annotation of annotations) {
    const polygonGeometry = annotation.kind === 'polygon';
    const points = annotation.points.map(point => point.join(',')).join(' ');
    parts.push(polygonGeometry
      ? `<polygon points="${points}" fill="#ef3d48" fill-opacity=".12" stroke="#e93440" stroke-width="2" stroke-dasharray="7 5"><title>${annotation.id}: ${annotation.uncertain}</title></polygon>`
      : `<polyline points="${points}" fill="none" stroke="#f09042" stroke-width="4" stroke-dasharray="7 5"><title>${annotation.id}: ${annotation.uncertain}</title></polyline>`);
  }
  const pathPoints = routePath.map(node => places[node].join(',')).join(' ');
  parts.push(`<polyline points="${pathPoints}" fill="none" stroke="#ffe36a" stroke-width="4" stroke-dasharray="12 8" opacity=".88"/>`);
  for (const {document} of viewportDocuments) {
    const opacity = document.direction === 'forward' ? .65 : .5;
    for (const feature of FEATURES) {
      const track = pointsForFeature(document, feature);
      parts.push(`<polyline points="${track.map(point => point.join(',')).join(' ')}" fill="none" stroke="${colors[feature]}" stroke-width="${feature === 'handle' ? 2 : 3}" stroke-opacity="${opacity}"${document.direction === 'reverse' ? ' stroke-dasharray="5 5"' : ''}><title>${feature} ${document.direction}, viewport ${document.viewport.join('x')}</title></polyline>`);
    }
    const stride = Math.max(1, Math.floor(document.frames.length / 48));
    for (let index = 0; index < document.frames.length - 1; index += stride) {
      const sweep = convexHull([...document.frames[index].visualBounds,
        ...document.frames[index + 1].visualBounds]);
      const points = sweep.map(point => point.join(',')).join(' ');
      parts.push(`<polygon points="${points}" fill="#71ff87" fill-opacity=".025" stroke="#71ff87" stroke-opacity="${opacity}" stroke-width="1"${document.direction === 'reverse' ? ' stroke-dasharray="3 3"' : ''}><title>Captured DOM-box sweep ${document.direction}, viewport ${document.viewport.join('x')}, frames ${index}-${index + 1}; screen-space only</title></polygon>`);
    }
  }
  for (const minimum of minima) {
    const [x, y] = minimum.featurePosition;
    parts.push(`<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="#d50000" stroke-width="4"><title>Minimum ${minimum.feature} to ${minimum.boundaryId}: ${minimum.distancePx}px at frames ${minimum.fromFrame}-${minimum.toFrame}</title></circle>`);
  }
  for (const turn of turnVertices(routePath)) {
    parts.push(`<circle cx="${turn.point[0]}" cy="${turn.point[1]}" r="10" fill="#ffe36a" stroke="#15272b" stroke-width="3"><title>Route turn ${turn.node}, image-plane review marker</title></circle>`);
    parts.push(`<text x="${turn.point[0] + 11}" y="${turn.point[1] - 8}" fill="#fff" stroke="#15272b" stroke-width="3" paint-order="stroke" font-family="sans-serif" font-size="16">${turn.node}</text>`);
  }
  parts.push('</svg>');
  return parts.join('\n');
}

const awaitableImage = await readFile('public/art/s01e03-market-lane-m0.webp');
await mkdir('test-results', {recursive: true});
const checkedOutCommitSha = await currentCheckoutSha();
const traceResults = [];
for (const [width, height] of VIEWPORTS) {
  const tracePath = `test-results/e03-cart-actual-forward-reverse-${width}x${height}.json`;
  for (const direction of ['forward', 'reverse']) {
    try {
      const bundle = JSON.parse(await readFile(tracePath, 'utf8'));
      const frames = bundle[`${direction}Trace`];
      const document = {viewport: bundle.viewport, sourceImage: SOURCE_IMAGE, direction, frames};
      validateFeatureTrace(document);
      assert.ok(frames.every(frame => Array.isArray(frame.visualBounds) && frame.visualBounds.length === 4),
        'actual cart DOM bounds are required for each swept-envelope sample');
      assert.deepEqual(document.viewport, [width, height], 'trace viewport must match its filename');
      assert.equal(bundle[`${direction}Frames`], frames.length,
        `${direction} frame count must agree with the actual captured sequence`);
      traceResults.push({path: tracePath, direction, document, status: 'valid', errors: []});
    } catch (error) {
      traceResults.push({path: tracePath, direction, document: null, status: 'data-insufficient', errors: [error.message]});
    }
  }
}

const validTraces = traceResults.filter(result => result.document);
const directionGraphPass = routePath.length > 1 &&
  JSON.stringify(reversePath) === JSON.stringify(routePath.toReversed());
assert.ok(directionGraphPass, 'authored loaded-cart route must be reversible on its existing graph');

const viewportReports = [];
for (const trace of validTraces) {
  const document = trace.document;
  const directedPath = document.direction === 'forward' ? routePath : reversePath;
  const featureSummary = [
    ...analyzeFeatureTrace(document, annotations),
    analyzeFeatureTrack(pointsForFeature(document, 'footCenterline'), 'footCenterline', annotations)
  ];
  const frameSegments = makeFeatureSegmentRows(document, annotations, directedPath);
  const envelopeSegments = visualEnvelopeSweepRows(document, annotations, directedPath);
  const reversed = {...document, frames: [...document.frames].reverse()
    .map((frame, frameIndex) => ({...frame, frameIndex}))};
  const reversedSummary = [
    ...analyzeFeatureTrace(reversed, annotations),
    analyzeFeatureTrack(pointsForFeature(reversed, 'footCenterline'), 'footCenterline', annotations)
  ];
  const reverseDirectionInvariant = featureSummary.every((feature, index) =>
    feature.boundaries.every((boundary, boundaryIndex) => {
      const reverse = reversedSummary[index].boundaries[boundaryIndex];
      return Math.abs(boundary.distance - reverse.distance) <= GEOMETRY_EPSILON &&
        boundary.classification === reverse.classification;
    }));
  const featureMinimums = featureSummary.map(feature => ({
    feature: feature.feature,
    candidateBoundaryMinimums: feature.boundaries.map(boundary => ({
      boundaryId: boundary.boundaryId,
      distancePx: rounded(boundary.distance),
      classification: boundary.classification,
      fromFrame: boundary.lineSegmentIndex ?? boundary.firstSegmentIndex,
      toFrame: (boundary.lineSegmentIndex ?? boundary.firstSegmentIndex) + 1,
      interpolationFraction: rounded(boundary.firstFraction, 6),
      featurePosition: roundedPoint(boundary.pointOnFirst),
      boundaryPosition: roundedPoint(boundary.pointOnSecond)
    })),
    nearestCandidate: {
      boundaryId: feature.minimum.boundaryId,
      distancePx: rounded(feature.minimum.distance),
      classification: feature.minimum.classification,
      fromFrame: feature.minimum.lineSegmentIndex ?? feature.minimum.firstSegmentIndex,
      toFrame: (feature.minimum.lineSegmentIndex ?? feature.minimum.firstSegmentIndex) + 1,
      interpolationFraction: rounded(feature.minimum.firstFraction, 6),
      featurePosition: roundedPoint(feature.minimum.pointOnFirst),
      boundaryPosition: roundedPoint(feature.minimum.pointOnSecond)
    }
  }));
  const nearestRows = minimumRows(frameSegments, ['feature', 'boundaryId']);
  const routeLegMinimums = minimumRows(frameSegments, ['feature', 'authoredRouteEdge', 'boundaryId']);
  const frameMinimums = minimumRows(frameSegments, ['feature', 'fromFrame']);
  const classificationCounts = Object.fromEntries(['overlap', 'contact', 'separated'].map(classification =>
    [classification, frameSegments.filter(row => row.classification === classification).length]));
  viewportReports.push({
    trace: trace.path,
    viewport: document.viewport,
    direction: document.direction,
    frameCount: document.frames.length,
    measuredPath: directedPath,
    measuredFeatureNames: FEATURES,
    coordinateInterpolation: 'Straight inter-frame segments in the source-image plane. This is not tire kinematics or wheel steering.',
    routeEdgeAssociation: 'Each frame interval is assigned to the authored L edge nearest the linearly interpolated foot midpoint.',
    reverseSequenceTest: {
      result: reverseDirectionInvariant ? 'PASS' : 'FAIL',
      meaning: 'Reversing the same measured samples preserves calculated minimum distances and classifications.',
      measuredReverseCartAnimation: document.direction === 'reverse'
    },
    featureMinimums,
    classificationCounts,
    candidateBoundaryFindings: nearestRows.filter(row => row.classification !== 'separated'),
    minimumByFeatureAndBoundary: nearestRows,
    minimumByAuthoredRouteLeg: routeLegMinimums,
    frameSegmentMinimums: frameMinimums,
    actualScreenSpaceSweptEnvelope: {
      source: 'Convex hull between consecutive captured cart DOM bounding boxes back-projected from the rendered Chromium viewport.',
      meaning: 'Conservative visual DOM-box sweep for the sampled interval; transparent sprite margins may be included, painted alpha and physical body are unknown.',
      intervalCount: Math.max(0, document.frames.length - 1),
      classificationCounts: Object.fromEntries(['overlap-or-contact', 'contact', 'separated'].map(classification =>
        [classification, envelopeSegments.filter(row => row.classification === classification).length])),
      candidateBoundaryFindings: minimumRows(envelopeSegments, ['boundaryId']).filter(row => row.classification !== 'separated'),
      minimumByCandidateBoundary: minimumRows(envelopeSegments, ['boundaryId']).map(row => ({
        boundaryId: row.boundaryId,
        authoredRouteEdge: row.authoredRouteEdge,
        distancePx: rounded(row.distance),
        classification: row.classification,
        fromFrame: row.fromFrame,
        toFrame: row.toFrame
      })),
      minimumByAuthoredRouteLeg: minimumRows(envelopeSegments, ['authoredRouteEdge', 'boundaryId']).map(row => ({
        boundaryId: row.boundaryId,
        authoredRouteEdge: row.authoredRouteEdge,
        distancePx: rounded(row.distance),
        classification: row.classification,
        fromFrame: row.fromFrame,
        toFrame: row.toFrame
      }))
    },
    turnRiskMarkers: turnRiskMarkers(document, annotations, directedPath)
  });
}

const missingTraceCount = traceResults.filter(result => !result.document).length;
const directionsCovered = ['forward', 'reverse'].every(direction =>
  VIEWPORTS.every(([width, height]) => validTraces.some(trace => trace.document.direction === direction &&
    trace.document.viewport[0] === width && trace.document.viewport[1] === height)));
const geometryStatus = missingTraceCount === 0 && directionsCovered &&
  viewportReports.every(report => report.reverseSequenceTest.result === 'PASS')
  ? 'PASS' : 'FAIL';
const report = {
  repository: 'edisontw/wondervale',
  checkedOutCommitSha,
  geometryVerification: {
    status: geometryStatus,
    epsilonPx: GEOMETRY_EPSILON,
    coordinatePlane: '1672x941 source-image pixels',
    routeGraph: {
      path: routePath,
      reversePath,
      reversePathMatchesForwardReversal: directionGraphPass ? 'PASS' : 'FAIL',
      measuredReverseAnimation: validTraces.some(trace => trace.document.direction === 'reverse'),
      capturedDirectionsByViewport: VIEWPORTS.map(([width, height]) => ({
        viewport: [width, height],
        directions: validTraces.filter(trace => trace.document.viewport[0] === width &&
          trace.document.viewport[1] === height).map(trace => trace.document.direction).sort()
      }))
    },
    traceFiles: traceResults.map(({path, direction, status, errors}) => ({path, direction, status, errors})),
    summary: geometryStatus === 'PASS'
      ? 'PASS covers actual UI-captured forward and reverse feature/DOM-box traces at every viewport, continuous segment calculations, and reverse-sequence invariance. It is not a physical safety result.'
      : 'FAIL means one or more traces are missing/invalid or reversed-sequence calculations differ. This does not describe physical safety.'
  },
  imagePlaneDiagnostic: {
    status: missingTraceCount === 0 && directionsCovered ? 'COMPLETE_FOR_CAPTURED_FEATURES' : 'DATA_INSUFFICIENT',
    sourceImage: SOURCE_IMAGE,
    interpolation: 'Each pair of captured feature points is joined by a straight continuous image-plane segment between frames.',
    featureModel: {
      footCenterline: 'Milo source-pixel foot targets from the existing browser trace; not a physical wheel path',
      leftWheel: 'SVG center point (47,58), not a tire contact patch or wheel radius',
      rightWheel: 'SVG center point (91,58), not a tire contact patch or wheel radius',
      handle: 'SVG point (9,18), not the full handle shape'
    },
    boundaries: annotations.map(({id, kind, source, purpose, confidence, uncertain, points}) =>
      ({id, kind, source, purpose, confidence, uncertain, points})),
    visualSweepModel: {
      name: 'captured-axis-aligned-cart-DOM-box',
      sweep: 'Convex hull of consecutive back-projected getBoundingClientRect corner sets; includes possible transparent margins and ignores perspective contact and physical yaw.',
      directions: ['forward', 'reverse'],
      viewports: VIEWPORTS
    },
    pavementBoundary: {
      status: 'UNKNOWN',
      reason: 'The repository contains partial curb, rail, foliage and foreground traces, not a complete owner-approved walkable-pavement polygon.'
    },
    viewports: viewportReports
  },
  physicalSafety: {
    status: 'OPEN',
    reason: 'Feature-center image tracks omit tire radius/contact, cart-body footprint, steering, yaw, perspective-ground mapping, complete pavement edges, verified obstacle solidity, physical dimensions, and owner/device acceptance.'
  }
};

const minimaForOverlay = viewportReports.flatMap(viewport => viewport.featureMinimums.map(feature => ({
  ...feature.nearestCandidate,
  feature: feature.feature,
  boundaryId: feature.nearestCandidate.boundaryId
})));
await writeFile('test-results/e03-cart-clearance-report.json', JSON.stringify(report, null, 2) + '\n');
await writeFile('test-results/e03-cart-clearance-overlay.svg', svgOverlay(
  viewportReports.map(viewport => ({document: validTraces.find(trace => trace.path === viewport.trace).document})),
  minimaForOverlay
) + '\n');

console.log(`E03 geometry ${geometryStatus}; image-plane ${report.imagePlaneDiagnostic.status}; physical safety OPEN. Reports written for ${validTraces.length}/${VIEWPORTS.length * 2} actual UI direction/viewport traces.`);
if (geometryStatus !== 'PASS') process.exitCode = 1;
