import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLOUDINARY_AVATARS,
  CLOUDINARY_PROJECTS,
  resolveStockPlaceholder,
} from './assetRegistry.ts';

test('CLOUDINARY_AVATARS and CLOUDINARY_PROJECTS provide valid local asset paths', () => {
  for (const url of Object.values(CLOUDINARY_AVATARS)) {
    assert.ok(url.startsWith('/team/'), `Avatar URL must start with /team/: ${url}`);
  }
  for (const url of Object.values(CLOUDINARY_PROJECTS)) {
    assert.ok(
      url.startsWith('/snapshots/') || url.startsWith('/media/'),
      `Project URL must start with /snapshots/ or /media/: ${url}`
    );
  }
});

test('resolveStockPlaceholder maps legacy /media/ and /team/ paths and preserves external URLs', () => {
  const resolvedMedia = resolveStockPlaceholder('/media/43a45f30543208de53ade25795bdc673.tex.webp');
  assert.equal(resolvedMedia, CLOUDINARY_PROJECTS.vixionStudio);

  const resolvedAvatar = resolveStockPlaceholder('/team/avatar-1.0c4e3fc0.jpg');
  assert.equal(resolvedAvatar, '/team/avatar-1.0c4e3fc0.jpg');

  const customUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
  assert.equal(resolveStockPlaceholder(customUrl), customUrl);
});
