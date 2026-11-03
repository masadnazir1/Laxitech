import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_MOCKUP_ID,
  MOCKUP_SCENE_SETTINGS,
  computeCameraZoom,
  parseRangeAttribute,
  computeOrbitAngles,
  computeScreenScrollProgress,
  parseAspectRatio,
} from './mockupPlayerConfig.ts';

describe('mockupPlayerConfig (303947ea-33f5-4ba1-bdfa-bd5064731f9c)', () => {
  it('matches the exact scene UUID, aspect ratio, and camera zoom formula', () => {
    assert.equal(
      MOCKUP_SCENE_SETTINGS.uid,
      '303947ea-33f5-4ba1-bdfa-bd5064731f9c'
    );
    assert.equal(DEFAULT_MOCKUP_ID, '303947ea-33f5-4ba1-bdfa-bd5064731f9c');
    // 0.3 + (11.6 / 100) * 2.7 = 0.6132
    assert.equal(computeCameraZoom('11.600000000000001'), 0.6132);
    assert.equal(computeCameraZoom(0), 0.3);
    assert.equal(computeCameraZoom(100), 3.0);
  });

  it('parses cursor-range and click-range attributes accurately', () => {
    assert.deepEqual(parseRangeAttribute('1-1-1-1'), {
      top: 1,
      right: 1,
      bottom: 1,
      left: 1,
    });
    assert.deepEqual(parseRangeAttribute('10-20'), {
      top: 10,
      right: 20,
      bottom: 10,
      left: 20,
    });
  });

  it('computes bounded orbital angles and smooth screen scroll progress', () => {
    const range = parseRangeAttribute('1-1-1-1');
    const center = computeOrbitAngles(0, 0, range, range, 0);
    assert.equal(center.yawRad, 0);
    assert.equal(center.pitchRad, 0);

    const edge = computeOrbitAngles(1, -1, range, range, 1);
    assert.ok(edge.yawRad > 0);
    assert.ok(edge.pitchRad < 0);

    assert.equal(computeScreenScrollProgress(0), 0);
    assert.equal(computeScreenScrollProgress(2.5), 0);
    const mid = computeScreenScrollProgress(7.35);
    assert.ok(mid > 0.4 && mid < 0.6);
    assert.equal(computeScreenScrollProgress(12.5), 1);
  });

  it('parses aspect ratio strings reliably', () => {
    assert.ok(Math.abs(parseAspectRatio('4 / 3') - 4 / 3) < 1e-6);
    assert.ok(Math.abs(parseAspectRatio('16 / 10') - 1.6) < 1e-6);
  });
});
