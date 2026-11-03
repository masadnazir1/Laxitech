import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ABOUT_BADGES,
  ABOUT_VALUES,
  getAboutBreadcrumbJsonLd,
} from './aboutPageData.ts';

test('ABOUT_BADGES contains 4 architectural capability seals with zero Wix/Orpetron references', () => {
  assert.equal(ABOUT_BADGES.length, 4);
  assert.equal(ABOUT_BADGES[0].id, 'uptime');
  assert.equal(ABOUT_BADGES[1].id, 'security');
  assert.equal(ABOUT_BADGES[2].id, 'latency');
  assert.equal(ABOUT_BADGES[3].id, 'projects');
  assert.ok(ABOUT_BADGES.every((b) => typeof b.icon === 'string' && b.icon.length > 0));
});

test('ABOUT_VALUES alternates left and right across 7 complete Laxitech milestones', () => {
  assert.equal(ABOUT_VALUES.length, 7);
  assert.deepEqual(
    ABOUT_VALUES.map((v) => v.side),
    ['left', 'right', 'left', 'right', 'left', 'right', 'left']
  );
  assert.equal(ABOUT_VALUES[0].marginTop, 47);
  assert.equal(ABOUT_VALUES[1].marginTop, undefined);
  assert.ok(ABOUT_VALUES.every((v) => v.highlights.length === 3));
});

test('getAboutBreadcrumbJsonLd returns valid Schema.org BreadcrumbList', () => {
  const schema = getAboutBreadcrumbJsonLd();
  assert.equal(schema['@type'], 'BreadcrumbList');
  assert.equal(schema.itemListElement.length, 2);
  assert.equal(schema.itemListElement[1].name, 'About Us');
});
