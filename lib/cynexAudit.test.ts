import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STUDIO_BIO_SNIPPETS,
  getTotalCharCount,
  slicePreTokenizedLines,
} from '../data/studioBioSnippets.ts';
import {
  PROJECT_SNAPSHOT_SEQUENCES,
  getProjectSnapshotSequence,
} from '../data/assetRegistry.ts';
import {
  ALL_WORKS,
  ALL_CATEGORY,
  filterWorksByCategory,
} from '../data/worksData.ts';
import {
  TEMPLATE_ITEMS,
  ALL_TEMPLATE_CATEGORY,
  filterTemplatesByCategory,
} from '../data/templatesData.ts';

test('STUDIO_BIO_SNIPPETS defines 5 Laxitech Cloud code files with line notes', () => {
  assert.equal(STUDIO_BIO_SNIPPETS.length, 5);
  assert.equal(STUDIO_BIO_SNIPPETS[0].file, 'laxitech.cloud.ts');
  assert.equal(STUDIO_BIO_SNIPPETS[1].file, 'multi-cloud.mesh.ts');
  assert.equal(STUDIO_BIO_SNIPPETS[2].file, 'vps.pakistan.ts');
  assert.equal(STUDIO_BIO_SNIPPETS[3].file, 'gxmail.security.ts');
  assert.equal(STUDIO_BIO_SNIPPETS[4].file, 'zero-trust.deploy.ts');

  for (const snippet of STUDIO_BIO_SNIPPETS) {
    assert.ok(snippet.lines.length > 0);
    assert.equal(snippet.lines.length, snippet.lineNotes.length);
  }
});

test('slicePreTokenizedLines slices character stream across lines accurately', () => {
  const firstSnippet = STUDIO_BIO_SNIPPETS[0];
  const total = getTotalCharCount(firstSnippet.lines);
  assert.ok(total > 100);

  const emptySlice = slicePreTokenizedLines(firstSnippet.lines, 0);
  assert.equal(emptySlice.length, 1);
  assert.equal(emptySlice[0].length, 0);

  const fullSlice = slicePreTokenizedLines(firstSnippet.lines, total);
  assert.equal(fullSlice.length, firstSnippet.lines.length);
});

test('getProjectSnapshotSequence returns 5 real snapshots for each CYNEX client project', () => {
  const slugs = [
    'vixion-studio',
    'movix-studio',
    'commerce-lions',
    'superluxuries-store',
    'mac-vision',
  ];
  for (const slug of slugs) {
    const seq = getProjectSnapshotSequence(slug);
    assert.equal(seq.length, 5);
    assert.deepEqual(seq, PROJECT_SNAPSHOT_SEQUENCES[slug]);
  }
});

test('filterWorksByCategory and filterTemplatesByCategory return expected subsets', () => {
  const allWorks = filterWorksByCategory(ALL_WORKS, ALL_CATEGORY);
  assert.equal(allWorks.length, ALL_WORKS.length);

  const allTemplates = filterTemplatesByCategory(
    TEMPLATE_ITEMS,
    ALL_TEMPLATE_CATEGORY
  );
  assert.equal(allTemplates.length, TEMPLATE_ITEMS.length);
});
