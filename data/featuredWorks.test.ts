import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURED_WORKS } from './featuredWorks.ts';

test('featured works contains strictly the 5 verified commercial client platforms with Electric Blue and Electric Purple accents', () => {
  assert.equal(FEATURED_WORKS.length, 5);

  const expectedSlugs = [
    'vixion-studio',
    'movix-studio',
    'commerce-lions',
    'superluxuries-store',
    'mac-vision',
  ];

  const allowedAccents = new Set(['#0066FF', '#2563EB', '#8B5CF6', '#7C3AED']);

  FEATURED_WORKS.forEach((work, index) => {
    assert.equal(work.slug, expectedSlugs[index]);
    assert.ok(work.liveUrl.startsWith('http'), `Live URL should start with http: ${work.liveUrl}`);
    assert.ok(
      work.img.startsWith('http') || work.img.startsWith('/media/') || work.img.startsWith('/snapshots/'),
      `Image should be a valid URL: ${work.img}`
    );
    assert.ok(work.category.length > 0, 'Category should not be empty');
    assert.ok(work.title.length > 0, 'Title should not be empty');
    assert.ok(work.titleAccent.length > 0, 'Title accent should not be empty');
    assert.ok(work.description.length > 0, 'Description should not be empty');
    assert.ok(work.accentColor.startsWith('#'), 'Accent color should be a hex code');
    assert.ok(
      allowedAccents.has(work.accentColor.toUpperCase()),
      `Expected Electric Blue or Electric Purple accent, got ${work.accentColor}`
    );
  });
});

test('deck progress interpolation math functions correctly for 5 commercial builds', () => {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

  assert.equal(lerp(0, 100, 0.5), 50);
  assert.equal(clamp(-10, 0, 1), 0);
  assert.equal(clamp(1.5, 0, 1), 1);
  assert.equal(clamp(0.42, 0, 1), 0.42);

  // Segment division for 5 cards
  const total = 5;
  const segment = 1 / total;
  const p = 0.5;
  const active = Math.min(Math.floor(p / segment), total - 1);
  assert.equal(active, 2);
});
