import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GEOMETRY_EPSILON,
  analyzeFeatureTrace,
  convexHull,
  continuousPolylineAgainstPolygon,
  pointInPolygon,
  pointToSegmentDistance,
  polygonBoundaryDistance,
  polygonContainsPolygon,
  polygonsOverlap,
  polylineToPolygonBoundaryDistance,
  projectPointToSegment,
  segmentToSegmentMinimumDistance,
  segmentsIntersect,
  validateFeatureTrace
} from '../scripts/e03_clearance_geometry.mjs';

const square = (x, y, size = 10) =>
  [[x, y], [x + size, y], [x + size, y + size], [x, y + size]];

test('point-to-segment projection handles interior, endpoint and zero length', () => {
  assert.deepEqual(projectPointToSegment([4, 3], [0, 0], [8, 0]),
    {distance: 3, point: [4, 0], t: 0.5});
  assert.equal(pointToSegmentDistance([-2, 0], [0, 0], [8, 0]), 2);
  assert.ok(Math.abs(pointToSegmentDistance([3, 4], [1, 1], [1, 1]) - Math.sqrt(13)) < 1e-12);
});

test('segment distances cover separation, crossing, endpoint touch and collinear overlap', () => {
  assert.equal(segmentToSegmentMinimumDistance([0, 0], [5, 0], [0, 2], [5, 2]).distance, 2);
  assert.equal(segmentToSegmentMinimumDistance([0, 0], [5, 5], [0, 5], [5, 0]).distance, 0);
  assert.equal(segmentToSegmentMinimumDistance([0, 0], [5, 0], [5, 0], [8, 2]).distance, 0);
  assert.equal(segmentToSegmentMinimumDistance([0, 0], [8, 0], [3, 0], [10, 0]).distance, 0);
  assert.equal(segmentsIntersect([0, 0], [8, 0], [3, 0], [10, 0]), true);
});

test('zero length segment pairs and epsilon contacts return zero clearance', () => {
  assert.equal(segmentToSegmentMinimumDistance([2, 2], [2, 2], [0, 2], [4, 2]).distance, 0);
  assert.equal(segmentToSegmentMinimumDistance([2, 2], [2, 2], [4, 2], [4, 2]).distance, 2);
  assert.equal(segmentToSegmentMinimumDistance([0, 0], [4, 0], [4 + GEOMETRY_EPSILON / 2, 0], [8, 0]).distance, 0);
});

test('reverse segment arguments preserve minimum distance', () => {
  const forward = segmentToSegmentMinimumDistance([1, 4], [8, 4], [3, 0], [4, 2]);
  const reversed = segmentToSegmentMinimumDistance([4, 2], [3, 0], [8, 4], [1, 4]);
  assert.equal(forward.distance, reversed.distance);
  assert.deepEqual(forward.pointOnFirst, reversed.pointOnSecond);
  assert.deepEqual(forward.pointOnSecond, reversed.pointOnFirst);
});

test('polygon containment, overlap and boundary contact handle concave boundaries', () => {
  const outer = square(0, 0, 20);
  assert.equal(pointInPolygon([10, 10], outer), 'inside');
  assert.equal(pointInPolygon([0, 10], outer), 'boundary');
  assert.equal(pointInPolygon([-1, 10], outer), 'outside');
  assert.equal(polygonContainsPolygon(outer, square(2, 2, 4)), true);
  assert.equal(polygonContainsPolygon(outer, square(18, 18, 5)), false);
  assert.equal(polygonsOverlap(outer, square(20, 5, 3)), true);
  assert.equal(polygonsOverlap(outer, square(21, 21, 2)), false);
  assert.equal(polygonsOverlap(outer, square(2, 2, 2)), true);
  const concave = [[0, 0], [6, 0], [6, 6], [4, 6], [4, 2], [2, 2], [2, 6], [0, 6]];
  const bridgesConcavity = [[1, 5], [5, 5], [3, 1]];
  assert.equal(bridgesConcavity.every(vertex => pointInPolygon(vertex, concave) !== 'outside'), true);
  assert.equal(polygonContainsPolygon(concave, bridgesConcavity), false);
  assert.equal(polygonContainsPolygon(concave, square(0, 0, 6)), false,
    'candidate edges must be split at shared vertices to detect a bridged concave exclusion');
  assert.equal(polygonContainsPolygon(concave, [[0, 0], [6, 0], [6, 2], [0, 2]]), true,
    'boundary-aligned containment remains valid');
});

test('convex hull bounds the continuous sweep between captured visual frames', () => {
  const first = square(0, 0, 2);
  const second = square(8, 3, 2);
  const sweep = convexHull([...first, ...second]);
  assert.equal(sweep.length, 6);
  assert.equal(pointInPolygon([4, 2], sweep), 'inside');
  assert.equal(polygonsOverlap(sweep, square(4, 1, 1)), true,
    'the swept envelope detects an obstacle between endpoint rectangles');
  assert.equal(polygonsOverlap(sweep, square(12, 1, 1)), false);
  assert.throws(() => convexHull([[0, 0], [1, 1], [2, 2]]), /at least 3 point/);
});

test('polyline boundary distance is continuous and detects interior traversal', () => {
  const region = square(0, 0, 10);
  assert.equal(polylineToPolygonBoundaryDistance([[-2, 5], [12, 5]], region).distance, 0);
  assert.equal(continuousPolylineAgainstPolygon([[-2, 5], [12, 5]], region).classification, 'overlap');
  assert.equal(continuousPolylineAgainstPolygon([[-1, -1], [11, 11]], region).classification, 'overlap',
    'crossing through polygon vertices still traverses its interior');
  assert.equal(continuousPolylineAgainstPolygon([[-2, 0], [0, 0]], region).classification, 'contact');
  assert.equal(continuousPolylineAgainstPolygon([[0, 0], [10, 10]], region).classification, 'overlap');
  assert.equal(continuousPolylineAgainstPolygon([[-1, 1], [1, -1]], region).classification, 'contact');
  assert.equal(continuousPolylineAgainstPolygon([[-2, 0], [12, 0]], region).classification, 'contact');
  assert.equal(continuousPolylineAgainstPolygon([[-2, -2], [-1, -1]], region).classification, 'separated');
  assert.equal(polygonBoundaryDistance([5, 5], region).distance, 5);
});

test('invalid coordinates, degenerate polygons and missing movement data fail explicitly', () => {
  assert.throws(() => pointToSegmentDistance([0, Infinity], [0, 0], [1, 1]), /finite/);
  assert.throws(() => segmentToSegmentMinimumDistance([0, 0], [1, NaN], [2, 2], [3, 3]), /finite/);
  assert.throws(() => polygonBoundaryDistance([0, 0], [[0, 0], [1, 1], [2, 2]]), /non-zero area/);
  assert.throws(() => polylineToPolygonBoundaryDistance([], square(0, 0)), /at least 1/);
  assert.throws(() => validateFeatureTrace({}), /viewport/);
  assert.throws(() => validateFeatureTrace({viewport: [320, 740], sourceImage: [1672, 941],
    direction: 'forward', frames: [{foot: [0, 0], wheels: [[0, 0]], handle: [0, 0]},
      {foot: [1, 1], wheels: [[1, 1], [2, 2]], handle: [1, 1]}]}), /left and right/);
  assert.throws(() => validateFeatureTrace({viewport: [320, 740], sourceImage: [1672, 941],
    direction: 'forward', frames: [{foot: [0, 0], wheels: [[0, 0], [1, 1]], handle: [0, 0]},
      null]}), /frames\[1\] is missing/);
});

test('trace schema validates three feature tracks and the exact image coordinate plane', () => {
  const document = {viewport: [568, 320], sourceImage: [1672, 941], direction: 'forward', frames: [
    {foot: [0, 0], wheels: [[0, 1], [2, 1]], handle: [-1, 0], visualBounds: square(-2, -2, 4)},
    {foot: [10, 0], wheels: [[10, 1], [12, 1]], handle: [9, 0], visualBounds: square(8, -2, 4)}
  ]};
  assert.equal(validateFeatureTrace(document), document);
  assert.throws(() => validateFeatureTrace({...document, sourceImage: [100, 100]}), /1672x941/);
  assert.equal(validateFeatureTrace({...document, direction: 'reverse'}).direction, 'reverse');
  assert.throws(() => validateFeatureTrace({...document, direction: 'sideways'}), /forward or reverse/);
  assert.throws(() => validateFeatureTrace({...document, frames: [document.frames[0]]}), /at least two/);
  assert.throws(() => validateFeatureTrace({...document, frames: [document.frames[0],
    {...document.frames[1], handle: [Infinity, 0]}]}), /finite/);
  const indexed = {...document, frames: [...document.frames,
    {foot: [20, 0], wheels: [[20, 1], [22, 1]], handle: [19, 0]}]
    .map((frame, frameIndex) => ({...frame, frameIndex}))};
  assert.equal(validateFeatureTrace(indexed), indexed);
  assert.throws(() => validateFeatureTrace({...indexed, frames: [indexed.frames[0], indexed.frames[2]]}), /contiguous/);
  assert.throws(() => validateFeatureTrace({...document, frames: [document.frames[0],
    {...document.frames[1], visualBounds: [[0, 0], [1, 1], [2, 2], [3, 3]]}]}), /non-zero area/);
});

test('forward and reversed full traces retain the same wheel and handle clearance', () => {
  const region = square(4, -2, 2);
  const boundaries = [{id: 'test-region', kind: 'polygon', points: region}];
  const frames = [
    {foot: [0, 0], wheels: [[0, -1], [0, 1]], handle: [-1, -1]},
    {foot: [5, 0], wheels: [[5, -1], [5, 1]], handle: [5, -1]},
    {foot: [10, 0], wheels: [[10, -1], [10, 1]], handle: [9, -1]}
  ];
  const forward = analyzeFeatureTrace({viewport: [1366, 900], sourceImage: [1672, 941],
    direction: 'forward', frames}, boundaries);
  const reversed = analyzeFeatureTrace({viewport: [1366, 900], sourceImage: [1672, 941],
    direction: 'forward', frames: [...frames].reverse()}, boundaries);
  for (let index = 0; index < forward.length; index++) {
    assert.equal(forward[index].minimum.distance, reversed[index].minimum.distance);
    assert.equal(forward[index].minimum.classification, reversed[index].minimum.classification);
  }
  assert.ok(forward.every(track => track.boundaries.length === 1));
  assert.equal(forward.find(track => track.feature === 'handle').minimum.classification, 'overlap');
});
