import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getHeroFrame,
  HERO_CAMERA_TIME,
  HERO_LID_START,
  HERO_LID_END,
  HERO_SHOT_DURATION,
  screenQuadMatrix,
  type ScreenQuad,
} from './heroScene.ts';

test('the lid opens while the camera stays in its frontal position', () => {
  for (const elapsed of [-100, 0, 0.1, 1, 4, HERO_SHOT_DURATION, 100, Number.NaN]) {
    const frame = getHeroFrame(elapsed);
    assert.equal(frame.cameraTime, HERO_CAMERA_TIME);
    assert.ok(frame.lidTime >= HERO_LID_START);
    assert.ok(frame.lidTime <= HERO_LID_END);
    assert.ok(frame.screenOpacity >= 0 && frame.screenOpacity <= 1);
  }
  assert.equal(getHeroFrame(0).lidTime, HERO_LID_START);
  assert.ok(getHeroFrame(1).lidTime < getHeroFrame(2).lidTime);
  assert.equal(getHeroFrame(100).lidTime, HERO_LID_END);
  assert.equal(getHeroFrame(100).finished, true);
});

test('reduced motion opens the lid and shows the screen immediately', () => {
  const frame = getHeroFrame(0, true);
  assert.equal(frame.cameraTime, HERO_CAMERA_TIME);
  assert.equal(frame.lidTime, HERO_LID_END);
  assert.equal(frame.progress, 1);
  assert.equal(frame.screenOpacity, 1);
  assert.equal(frame.finished, true);
});

test('the projected screen stays off during the closed part of the entrance', () => {
  assert.equal(getHeroFrame(0).screenOpacity, 0);
  assert.equal(getHeroFrame(HERO_SHOT_DURATION * 0.29).screenOpacity, 0);
  assert.ok(getHeroFrame(HERO_SHOT_DURATION * 0.45).screenOpacity > 0);
  assert.equal(getHeroFrame(HERO_SHOT_DURATION).screenOpacity, 1);
});

test('screen mapping projects all four DOM corners onto a perspective screen', () => {
  const quad: ScreenQuad = [{ x: 110, y: 60 }, { x: 880, y: 94 }, { x: 820, y: 610 }, { x: 145, y: 560 }];
  const transform = screenQuadMatrix(1200, 780, quad);
  assert.ok(transform);
  const m = transform.slice(9, -1).split(',').map(Number);
  const source = [[0, 0], [1200, 0], [1200, 780], [0, 780]];
  source.forEach(([x, y], index) => {
    const w = m[3] * x + m[7] * y + m[15];
    const mappedX = (m[0] * x + m[4] * y + m[12]) / w;
    const mappedY = (m[1] * x + m[5] * y + m[13]) / w;
    assert.ok(Math.abs(mappedX - quad[index].x) < 0.01);
    assert.ok(Math.abs(mappedY - quad[index].y) < 0.01);
  });
});

test('invalid screen geometry never produces an unusable CSS transform', () => {
  const collapsed: ScreenQuad = [{ x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }];
  assert.equal(screenQuadMatrix(1200, 780, collapsed), null);
  assert.equal(screenQuadMatrix(0, 780, collapsed), null);
});
