import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_WORKS,
  ALL_CATEGORY,
  extractWorkCategories,
  countWorkCategories,
  filterWorksByCategory,
  getWorksBreadcrumbJsonLd,
} from './worksData.ts';

test('ALL_WORKS contains strictly the 5 verified CYNEX commercial client platforms in exact order', () => {
  assert.equal(ALL_WORKS.length, 5);
  assert.equal(ALL_WORKS[0].slug, 'vixion-studio');
  assert.equal(ALL_WORKS[1].slug, 'movix-studio');
  assert.equal(ALL_WORKS[2].slug, 'commerce-lions');
  assert.equal(ALL_WORKS[3].slug, 'superluxuries-store');
  assert.equal(ALL_WORKS[4].slug, 'mac-vision');
});

test('extractWorkCategories produces authentic CYNEX categories in appearance order', () => {
  const categories = extractWorkCategories(ALL_WORKS);
  assert.deepEqual(categories, [
    'All',
    'VPS Hosting',
    'Cloud Architecture',
    'Zero-Trust Security',
    'Custom Software',
  ]);
});

test('countWorkCategories and filterWorksByCategory compute exact counts', () => {
  const counts = countWorkCategories(ALL_WORKS);
  assert.equal(counts[ALL_CATEGORY], 5);
  assert.equal(counts['VPS Hosting'], 2);
  assert.equal(counts['Cloud Architecture'], 1);
  assert.equal(counts['Zero-Trust Security'], 1);
  assert.equal(counts['Custom Software'], 1);

  const vpsItems = filterWorksByCategory(ALL_WORKS, 'VPS Hosting');
  assert.equal(vpsItems.length, 2);
  assert.equal(
    filterWorksByCategory(ALL_WORKS, ALL_CATEGORY).length,
    5
  );
});

test('getWorksBreadcrumbJsonLd returns Schema.org BreadcrumbList for CYNEX Works', () => {
  const schema = getWorksBreadcrumbJsonLd();
  assert.equal(schema['@type'], 'BreadcrumbList');
  assert.equal(schema.itemListElement[1].name, 'Works');
});
