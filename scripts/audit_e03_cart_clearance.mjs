// Analyze the existing rendered feature-track JSON in the source-image plane.
// Inter-frame interpolation is a 2D image-plane approximation only. It does not
// infer wheel radius, axle steering, cart-body extent, yaw, or physical safety.
import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {places, route} from '../engine/s01e03.mjs';
import {occluders} from '../e03/route-depth.mjs';
import {
  GEOMETRY_EPSILON,
  analyzeFeatureTrack,
  analyzeFeatureTrace,
  continuousPolylineAgainstPolygon,
  pointToSegmentDistance,
  polylineToPolygonBoundaryDistance,
  polylineToPolylineMinimumDistance,
  projectPointToSegment,
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
  let gitDirectory = '.git';
  try {
    const gitFile = await readFile('.git', 'utf8');
    const match = gitFile.match(/^gitdir:\s*(.+)$/m);
    if (match) gitDirectory = match[1];
  } catch {}
  const head = (await readFile(`${gitDirectory}/HEAD`, 'utf8')).trim();
  if (!head.startsWith('ref: ')) return head;
  const reference = head.slice(5);
  try {
    return (await readFile(`${gitDirectory}/${reference}`, 'utf8')).trim();
  } catch {
    const packed = await readFile(`${gitDirectory}/packed-refs`, 'utf8');
    const row = packed.split('\n').find(line => line.endsWith(` ${reference}`));
    if (!row) throw new Error(`Could not resolve current Git ref ${reference}`);
    return row.split(' ')[0];
  }
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

function nearestAuthoredEdge(foot) {
  const nearest = routePath.slice(1).map((next, index) => {
    const previous = routePath[index];
    const projection = projectPointToSegment(foot, places[previous], places[next]);
    return {edge: `${previous}-${next}`, distance: projection.distance};
  }).reduce((best, candidate) => candidate.distance < best.distance ? candidate : best);
  return nearest.edge;
}

function makeFeatureSegmentRows(document, boundaries) {
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
        const authoredEdge = nearestAuthoredEdge(footMidpoint);
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
    if (!previous || row.distancePx < previous.distancePx) grouped.set(key, row);
  }
  return [...grouped.values()];
}

function turnVertices() {
  return routePath.slice(1, -1).flatMap((node, index) => {
    const before = places[routePath[index]];
    const pivot = places[node];
    const after = places[routePath[index + 2]];
    const incoming = [pivot[0] - before[0], pivot[1] - before[1]];
    const outgoing = [after[0] - pivot[0], after[1] - pivot[1]];
    const cross = incoming[0] * outgoing[1] - incoming[1] * outgoing[0];
    const dot = incoming[0] * outgoing[0] + incoming[1] * outgoing[1];
    return Math.abs(cross) <= GEOMETRY_EPSILON ? [] : [{node, point: pivot,
      turnDegrees: rounded(Math.atan2(cross, dot) * 180 / Math.PI, 2)}];
  });
}

function turnRiskMarkers(document, boundaries) {
  return turnVertices().map(turn => {
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

function svgOverlay(viewportDocuments, minima) {
  const image = Buffer.from(awaitableImage).toString('base64');
  const colors = {footCenterline: '#ffffff', leftWheel: '#28d7ff', rightWheel: '#ed58cf', handle: '#ff9d39'};
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SOURCE_IMAGE[0]}" height="${SOURCE_IMAGE[1]}" viewBox="0 0 ${SOURCE_IMAGE[0]} ${SOURCE_IMAGE[1]}">`,
    `<image href="data:image/webp;base64,${image}" width="${SOURCE_IMAGE[0]}" height="${SOURCE_IMAGE[1]}"/>`,
    '<rect x="16" y="14" width="930" height="92" rx="9" fill="#10252b" fill-opacity=".92"/>',
    '<text x="34" y="50" fill="#fff" font-family="sans-serif" font-size="25">E03 cart feature tracks · image-plane diagnostic</text>',
    '<text x="34" y="82" fill="#ffe3aa" font-family="sans-serif" font-size="17">Candidate boundaries are provisional. Physical clearance remains OPEN.</text>'
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
  for (const [viewportIndex, {document}] of viewportDocuments.entries()) {
    const opacity = viewportIndex === 0 ? 1 : viewportIndex === 1 ? .72 : .48;
    for (const feature of FEATURES) {
      const track = pointsForFeature(document, feature);
      parts.push(`<polyline points="${track.map(point => point.join(',')).join(' ')}" fill="none" stroke="${colors[feature]}" stroke-width="${feature === 'handle' ? 2 : 3}" stroke-opacity="${opacity}"><title>${feature}, viewport ${document.viewport.join('x')}</title></polyline>`);
    }
  }
  for (const minimum of minima) {
    const [x, y] = minimum.featurePosition;
    parts.push(`<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="#d50000" stroke-width="4"><title>Minimum ${minimum.feature} to ${minimum.boundaryId}: ${minimum.distancePx}px at frames ${minimum.fromFrame}-${minimum.toFrame}</title></circle>`);
  }
  for (const turn of turnVertices()) {
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
  const tracePath = `test-results/e03-cart-live-feature-tracks-${width}x${height}.json`;
  try {
    const document = JSON.parse(await readFile(tracePath, 'utf8'));
    validateFeatureTrace(document);
    assert.deepEqual(document.viewport, [width, height], 'trace viewport must match its filename');
    traceResults.push({path: tracePath, document, status: 'valid', errors: []});
  } catch (error) {
    traceResults.push({path: tracePath, document: null, status: 'data-insufficient', errors: [error.message]});
  }
}

const validTraces = traceResults.filter(result => result.document);
const directionGraphPass = routePath.length > 1 &&
  JSON.stringify(reversePath) === JSON.stringify(routePath.toReversed());
assert.ok(directionGraphPass, 'authored loaded-cart route must be reversible on its existing graph');

const viewportReports = [];
for (const trace of validTraces) {
  const document = trace.document;
  const featureSummary = [
    ...analyzeFeatureTrace(document, annotations),
    analyzeFeatureTrack(pointsForFeature(document, 'footCenterline'), 'footCenterline', annotations)
  ];
  const frameSegments = makeFeatureSegmentRows(document, annotations);
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
    measuredPath: routePath,
    measuredFeatureNames: FEATURES,
    coordinateInterpolation: 'Straight inter-frame segments in the source-image plane. This is not tire kinematics or wheel steering.',
    routeEdgeAssociation: 'Each frame interval is assigned to the authored L edge nearest the linearly interpolated foot midpoint.',
    reverseSequenceTest: {
      result: reverseDirectionInvariant ? 'PASS' : 'FAIL',
      meaning: 'Reversing the same measured samples preserves calculated minimum distances and classifications.',
      measuredReverseCartAnimation: false
    },
    featureMinimums,
    classificationCounts,
    candidateBoundaryFindings: nearestRows.filter(row => row.classification !== 'separated'),
    minimumByFeatureAndBoundary: nearestRows,
    minimumByAuthoredRouteLeg: routeLegMinimums,
    frameSegmentMinimums: frameMinimums,
    turnRiskMarkers: turnRiskMarkers(document, annotations)
  });
}

const missingViewportCount = traceResults.filter(result => !result.document).length;
const geometryStatus = missingViewportCount === 0 &&
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
      measuredReverseAnimation: false
    },
    traceFiles: traceResults.map(({path, status, errors}) => ({path, status, errors})),
    summary: geometryStatus === 'PASS'
      ? 'PASS covers finite trace validation, continuous segment calculations, and reverse-sequence invariance. It is not a physical safety result.'
      : 'FAIL means one or more traces are missing/invalid or reversed-sequence calculations differ. This does not describe physical safety.'
  },
  imagePlaneDiagnostic: {
    status: missingViewportCount === 0 ? 'COMPLETE_FOR_CAPTURED_FEATURES' : 'DATA_INSUFFICIENT',
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

console.log(`E03 geometry ${geometryStatus}; image-plane ${report.imagePlaneDiagnostic.status}; physical safety OPEN. Reports written for ${validTraces.length}/${VIEWPORTS.length} viewport traces.`);
if (geometryStatus !== 'PASS') process.exitCode = 1;
