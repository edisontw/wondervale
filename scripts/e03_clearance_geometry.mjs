// Continuous 2D geometry primitives for E03 clearance diagnostics.
// Coordinates use the 1672x941 source-image pixel plane. EPSILON is an absolute
// distance in those pixels and also the tolerance used for boundary contact.
export const GEOMETRY_EPSILON = 1e-9;

function point(value, name = 'point') {
  if (!Array.isArray(value) || value.length !== 2 ||
      !value.every(Number.isFinite)) {
    throw new TypeError(`${name} must contain two finite coordinates`);
  }
  return value;
}

function polyline(value, name = 'polyline', minimum = 1) {
  if (!Array.isArray(value) || value.length < minimum) {
    throw new TypeError(`${name} must contain at least ${minimum} point(s)`);
  }
  value.forEach((item, index) => point(item, `${name}[${index}]`));
  return value;
}

function polygon(value, name = 'polygon') {
  polyline(value, name, 3);
  const areaTwice = value.reduce((sum, current, index) => {
    const next = value[(index + 1) % value.length];
    return sum + current[0] * next[1] - next[0] * current[1];
  }, 0);
  if (Math.abs(areaTwice) <= GEOMETRY_EPSILON) {
    throw new RangeError(`${name} must enclose a non-zero area`);
  }
  return value;
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const cross = (a, b, c) =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

export function projectPointToSegment(value, startValue, endValue) {
  const p = point(value);
  const start = point(startValue, 'segment start');
  const end = point(endValue, 'segment end');
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
    ((p[0] - start[0]) * dx + (p[1] - start[1]) * dy) / lengthSquared));
  const projected = [start[0] + t * dx, start[1] + t * dy];
  const gap = distance(p, projected);
  return {
    distance: gap <= GEOMETRY_EPSILON ? 0 : gap,
    point: projected,
    t
  };
}

export function pointToSegmentDistance(value, start, end) {
  return projectPointToSegment(value, start, end).distance;
}

function orientationSign(value, scale) {
  const tolerance = GEOMETRY_EPSILON * Math.max(1, scale);
  return value > tolerance ? 1 : value < -tolerance ? -1 : 0;
}

function pointOnSegment(value, start, end) {
  return pointToSegmentDistance(value, start, end) === 0;
}

function properSegmentIntersection(a, b, c, d) {
  const scale = Math.max(distance(a, b), distance(c, d));
  const abC = orientationSign(cross(a, b, c), scale);
  const abD = orientationSign(cross(a, b, d), scale);
  const cdA = orientationSign(cross(c, d, a), scale);
  const cdB = orientationSign(cross(c, d, b), scale);
  return abC * abD < 0 && cdA * cdB < 0;
}

export function segmentsIntersect(firstStartValue, firstEndValue,
  secondStartValue, secondEndValue) {
  const a = point(firstStartValue, 'first segment start');
  const b = point(firstEndValue, 'first segment end');
  const c = point(secondStartValue, 'second segment start');
  const d = point(secondEndValue, 'second segment end');

  if (properSegmentIntersection(a, b, c, d)) return true;
  return pointOnSegment(a, c, d) || pointOnSegment(b, c, d) ||
    pointOnSegment(c, a, b) || pointOnSegment(d, a, b);
}

export function segmentToSegmentMinimumDistance(firstStartValue, firstEndValue,
  secondStartValue, secondEndValue) {
  const a = point(firstStartValue, 'first segment start');
  const b = point(firstEndValue, 'first segment end');
  const c = point(secondStartValue, 'second segment start');
  const d = point(secondEndValue, 'second segment end');

  if (segmentsIntersect(a, b, c, d)) {
    if (properSegmentIntersection(a, b, c, d)) {
      const firstVector = [b[0] - a[0], b[1] - a[1]];
      const secondVector = [d[0] - c[0], d[1] - c[1]];
      const denominator = firstVector[0] * secondVector[1] - firstVector[1] * secondVector[0];
      const offset = [c[0] - a[0], c[1] - a[1]];
      const firstFraction = (offset[0] * secondVector[1] - offset[1] * secondVector[0]) / denominator;
      const secondFraction = (offset[0] * firstVector[1] - offset[1] * firstVector[0]) / denominator;
      const intersection = [a[0] + firstFraction * firstVector[0],
        a[1] + firstFraction * firstVector[1]];
      return {distance: 0, pointOnFirst: intersection, pointOnSecond: intersection,
        firstFraction, secondFraction};
    }
  }

  const fromA = projectPointToSegment(a, c, d);
  const fromB = projectPointToSegment(b, c, d);
  const fromC = projectPointToSegment(c, a, b);
  const fromD = projectPointToSegment(d, a, b);
  const candidates = [
    {...fromA, pointOnFirst: a, firstFraction: 0,
      pointOnSecond: fromA.point, secondFraction: fromA.t},
    {...fromB, pointOnFirst: b, firstFraction: 1,
      pointOnSecond: fromB.point, secondFraction: fromB.t},
    {...fromC, pointOnFirst: fromC.point, firstFraction: fromC.t,
      pointOnSecond: c, secondFraction: 0},
    {...fromD, pointOnFirst: fromD.point, firstFraction: fromD.t,
      pointOnSecond: d, secondFraction: 1}
  ];
  const nearest = candidates.reduce((best, item) =>
    item.distance < best.distance ? item : best);
  return {
    distance: nearest.distance <= GEOMETRY_EPSILON ? 0 : nearest.distance,
    pointOnFirst: nearest.pointOnFirst,
    pointOnSecond: nearest.pointOnSecond,
    firstFraction: nearest.firstFraction,
    secondFraction: nearest.secondFraction
  };
}

export function pointInPolygon(value, polygonValue) {
  const p = point(value);
  const boundary = polygon(polygonValue);
  let inside = false;
  for (let index = 0, previous = boundary.length - 1;
    index < boundary.length; previous = index++) {
    const a = boundary[previous];
    const b = boundary[index];
    if (pointOnSegment(p, a, b)) return 'boundary';
    if ((a[1] > p[1]) !== (b[1] > p[1]) &&
        p[0] < (b[0] - a[0]) * (p[1] - a[1]) /
          (b[1] - a[1]) + a[0]) {
      inside = !inside;
    }
  }
  return inside ? 'inside' : 'outside';
}

export function polygonBoundaryDistance(value, polygonValue) {
  const p = point(value);
  const boundary = polygon(polygonValue);
  let nearest = null;
  for (let index = 0; index < boundary.length; index++) {
    const start = boundary[index];
    const end = boundary[(index + 1) % boundary.length];
    const projection = projectPointToSegment(p, start, end);
    if (nearest === null || projection.distance < nearest.distance) {
      nearest = {...projection, edgeIndex: index};
    }
  }
  return nearest;
}

export function polylineToPolygonBoundaryDistance(lineValue, polygonValue) {
  const line = polyline(lineValue, 'polyline');
  const boundary = polygon(polygonValue);
  let nearest = null;
  const lineSegmentCount = Math.max(1, line.length - 1);
  for (let lineIndex = 0; lineIndex < lineSegmentCount; lineIndex++) {
    const lineStart = line[lineIndex];
    const lineEnd = line.length === 1 ? lineStart : line[lineIndex + 1];
    for (let edgeIndex = 0; edgeIndex < boundary.length; edgeIndex++) {
      const edgeStart = boundary[edgeIndex];
      const edgeEnd = boundary[(edgeIndex + 1) % boundary.length];
      const candidate = segmentToSegmentMinimumDistance(
        lineStart, lineEnd, edgeStart, edgeEnd);
      if (nearest === null || candidate.distance < nearest.distance) {
        nearest = {...candidate, lineSegmentIndex: lineIndex, edgeIndex};
      }
    }
  }
  return nearest;
}

export function polygonContainsPolygon(containerValue, candidateValue) {
  const container = polygon(containerValue, 'container polygon');
  const candidate = polygon(candidateValue, 'candidate polygon');
  if (candidate.some(vertex => pointInPolygon(vertex, container) === 'outside')) {
    return false;
  }
  for (let i = 0; i < candidate.length; i++) {
    const a = candidate[i];
    const b = candidate[(i + 1) % candidate.length];
    for (let j = 0; j < container.length; j++) {
      const c = container[j];
      const d = container[(j + 1) % container.length];
      if (properSegmentIntersection(a, b, c, d)) return false;
    }
  }
  return true;
}

export function polygonsOverlap(firstValue, secondValue) {
  const first = polygon(firstValue, 'first polygon');
  const second = polygon(secondValue, 'second polygon');
  for (let i = 0; i < first.length; i++) {
    const a = first[i];
    const b = first[(i + 1) % first.length];
    for (let j = 0; j < second.length; j++) {
      const c = second[j];
      const d = second[(j + 1) % second.length];
      if (segmentsIntersect(a, b, c, d)) return true;
    }
  }
  return pointInPolygon(first[0], second) !== 'outside' ||
    pointInPolygon(second[0], first) !== 'outside';
}

function segmentIntersectionFractions(start, end, edgeStart, edgeEnd) {
  const route = [end[0] - start[0], end[1] - start[1]];
  const edge = [edgeEnd[0] - edgeStart[0], edgeEnd[1] - edgeStart[1]];
  const offset = [edgeStart[0] - start[0], edgeStart[1] - start[1]];
  const routeLength = Math.hypot(route[0], route[1]);
  const edgeLength = Math.hypot(edge[0], edge[1]);
  const tolerance = GEOMETRY_EPSILON * Math.max(1, routeLength, edgeLength);
  const denominator = route[0] * edge[1] - route[1] * edge[0];
  if (Math.abs(denominator) > tolerance) {
    const routeFraction = (offset[0] * edge[1] - offset[1] * edge[0]) / denominator;
    const edgeFraction = (offset[0] * route[1] - offset[1] * route[0]) / denominator;
    const fractionTolerance = GEOMETRY_EPSILON / Math.max(1, routeLength);
    if (routeFraction >= -fractionTolerance && routeFraction <= 1 + fractionTolerance &&
        edgeFraction >= -GEOMETRY_EPSILON / Math.max(1, edgeLength) &&
        edgeFraction <= 1 + GEOMETRY_EPSILON / Math.max(1, edgeLength)) {
      return [Math.max(0, Math.min(1, routeFraction))];
    }
    return [];
  }

  if (Math.abs(cross(start, end, edgeStart)) > tolerance) {
    const fractions = [];
    if (pointOnSegment(start, edgeStart, edgeEnd)) fractions.push(0);
    if (pointOnSegment(end, edgeStart, edgeEnd)) fractions.push(1);
    return fractions;
  }

  const routeLengthSquared = route[0] * route[0] + route[1] * route[1];
  if (routeLengthSquared === 0) return pointOnSegment(start, edgeStart, edgeEnd) ? [0] : [];
  const startFraction = (offset[0] * route[0] + offset[1] * route[1]) / routeLengthSquared;
  const endOffset = [edgeEnd[0] - start[0], edgeEnd[1] - start[1]];
  const endFraction = (endOffset[0] * route[0] + endOffset[1] * route[1]) / routeLengthSquared;
  const low = Math.max(0, Math.min(startFraction, endFraction));
  const high = Math.min(1, Math.max(startFraction, endFraction));
  const fractionTolerance = GEOMETRY_EPSILON / Math.max(1, routeLength);
  if (low <= high + fractionTolerance) {
    return [Math.max(0, Math.min(1, low)), Math.max(0, Math.min(1, high))];
  }
  return [];
}

function segmentCrossesPolygonInterior(start, end, boundary) {
  if (pointInPolygon(start, boundary) === 'inside' ||
      pointInPolygon(end, boundary) === 'inside') return true;
  const intersections = [0, 1];
  for (let index = 0; index < boundary.length; index++) {
    intersections.push(...segmentIntersectionFractions(start, end, boundary[index],
      boundary[(index + 1) % boundary.length]));
  }
  const fractionTolerance = GEOMETRY_EPSILON / Math.max(1, distance(start, end));
  const events = [...intersections].sort((a, b) => a - b).filter((value, index, values) =>
    index === 0 || value - values[index - 1] > fractionTolerance);
  for (let index = 0; index < events.length - 1; index++) {
    const fraction = (events[index] + events[index + 1]) / 2;
    const middle = [start[0] + (end[0] - start[0]) * fraction,
      start[1] + (end[1] - start[1]) * fraction];
    if (pointInPolygon(middle, boundary) === 'inside') return true;
  }
  return false;
}

export function continuousPolylineAgainstPolygon(lineValue, polygonValue) {
  const line = polyline(lineValue, 'polyline');
  const boundary = polygon(polygonValue);
  const closest = polylineToPolygonBoundaryDistance(line, boundary);
  let overlapsInterior = false;
  const count = Math.max(1, line.length - 1);
  for (let index = 0; index < count; index++) {
    const start = line[index];
    const end = line.length === 1 ? start : line[index + 1];
    if (segmentCrossesPolygonInterior(start, end, boundary)) {
      overlapsInterior = true;
      break;
    }
  }
  return {
    ...closest,
    classification: overlapsInterior ? 'overlap' : closest.distance === 0 ? 'contact' : 'separated'
  };
}

export function validateFeatureTrace(document) {
  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw new TypeError('trace must be an object');
  }
  const {viewport, sourceImage, frames} = document;
  if (!Array.isArray(viewport) || viewport.length !== 2 ||
      !viewport.every(value => Number.isInteger(value) && value > 0)) {
    throw new TypeError('viewport must contain two positive integer dimensions');
  }
  if (!Array.isArray(sourceImage) || sourceImage.length !== 2 ||
      !sourceImage.every(Number.isFinite) || sourceImage[0] !== 1672 || sourceImage[1] !== 941) {
    throw new TypeError('sourceImage must be the 1672x941 source coordinate plane');
  }
  if (document.direction !== 'forward') {
    throw new TypeError('measured trace direction must be forward');
  }
  if (!Array.isArray(frames) || frames.length < 2) {
    throw new TypeError('trace needs at least two frames for continuous movement');
  }
  const hasFrameIndex = frames.some(frame => frame && Object.hasOwn(frame, 'frameIndex'));
  if (hasFrameIndex && frames.some((frame, index) => frame?.frameIndex !== index)) {
    throw new TypeError('frameIndex must be present and contiguous when supplied');
  }
  frames.forEach((frame, index) => {
    if (!frame || typeof frame !== 'object') {
      throw new TypeError(`frames[${index}] is missing`);
    }
    point(frame.foot, `frames[${index}].foot`);
    if (!Array.isArray(frame.wheels) || frame.wheels.length !== 2) {
      throw new TypeError(`frames[${index}].wheels must contain left and right wheel centers`);
    }
    point(frame.wheels[0], `frames[${index}].wheels[0]`);
    point(frame.wheels[1], `frames[${index}].wheels[1]`);
    point(frame.handle, `frames[${index}].handle`);
  });
  return document;
}

export function analyzeFeatureTrack(framesValue, featureName, boundaries) {
  const frames = polyline(framesValue, `${featureName} track`, 2);
  if (!Array.isArray(boundaries) || boundaries.length === 0) {
    throw new TypeError('at least one boundary annotation is required');
  }
  let best = null;
  const perBoundary = boundaries.map(annotation => {
    if (!annotation || typeof annotation.id !== 'string' ||
        !['polygon', 'polyline'].includes(annotation.kind)) {
      throw new TypeError('boundary annotation must have an id and supported geometry kind');
    }
    const points = annotation.points;
    const result = annotation.kind === 'polygon'
      ? continuousPolylineAgainstPolygon(frames, points)
      : polylineToPolylineMinimumDistance(frames, points);
    const row = {boundaryId: annotation.id, ...result};
    if (best === null || row.distance < best.distance) best = row;
    return row;
  });
  return {feature: featureName, minimum: best, boundaries: perBoundary};
}

export function polylineToPolylineMinimumDistance(firstValue, secondValue) {
  const first = polyline(firstValue, 'first polyline');
  const second = polyline(secondValue, 'second polyline');
  let nearest = null;
  const firstCount = Math.max(1, first.length - 1);
  const secondCount = Math.max(1, second.length - 1);
  for (let i = 0; i < firstCount; i++) {
    const a = first[i];
    const b = first.length === 1 ? a : first[i + 1];
    for (let j = 0; j < secondCount; j++) {
      const c = second[j];
      const d = second.length === 1 ? c : second[j + 1];
      const candidate = segmentToSegmentMinimumDistance(a, b, c, d);
      if (nearest === null || candidate.distance < nearest.distance) {
        nearest = {...candidate, firstSegmentIndex: i, secondSegmentIndex: j};
      }
    }
  }
  return {...nearest, classification: nearest.distance === 0 ? 'contact' : 'separated'};
}

export function analyzeFeatureTrace(document, boundaries) {
  validateFeatureTrace(document);
  const tracks = {
    leftWheel: document.frames.map(frame => frame.wheels[0]),
    rightWheel: document.frames.map(frame => frame.wheels[1]),
    handle: document.frames.map(frame => frame.handle)
  };
  return Object.entries(tracks).map(([feature, points]) =>
    analyzeFeatureTrack(points, feature, boundaries));
}
