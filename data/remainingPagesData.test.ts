import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SERVICE_CARDS,
  SERVICES_SUBTITLE,
  getServicesBreadcrumbJsonLd,
} from './servicesPageData.ts';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  filterBlogsByCategory,
  getBlogBreadcrumbJsonLd,
} from './blogsData.ts';
import {
  TEMPLATE_ITEMS,
  extractTemplateCategories,
  countTemplateCategories,
  filterTemplatesByCategory,
  getTemplatesBreadcrumbJsonLd,
} from './templatesData.ts';

test('SERVICE_CARDS has all 10 Laxitech modular disciplines', () => {
  assert.equal(SERVICE_CARDS.length, 10);
  assert.equal(SERVICE_CARDS[0].slug, 'crafted-websites');
  assert.equal(SERVICE_CARDS[0].title, 'Custom Software\nEngineering');
  assert.equal(SERVICE_CARDS[9].slug, 'maintenance-and-ongoing-support');
  assert.equal(SERVICE_CARDS[9].title, '24/7 Managed Cloud\n& Operations');
  assert.ok(SERVICES_SUBTITLE.includes('Enterprise custom software engineering'));
  assert.equal(getServicesBreadcrumbJsonLd().itemListElement.length, 2);
});

test('BLOG_POSTS and BLOG_CATEGORIES match Laxitech 6 engineering articles and categories', () => {
  assert.equal(BLOG_POSTS.length, 6);
  assert.equal(BLOG_CATEGORIES.length, 4);
  assert.equal(filterBlogsByCategory(BLOG_POSTS, 'all').length, 6);
  assert.equal(filterBlogsByCategory(BLOG_POSTS, 'cloud-architecture').length, 2);
  assert.equal(filterBlogsByCategory(BLOG_POSTS, 'infrastructure-vps').length, 2);
  assert.equal(filterBlogsByCategory(BLOG_POSTS, 'security-devops').length, 2);
  assert.equal(getBlogBreadcrumbJsonLd().itemListElement[1].name, 'Blog');
});

test('TEMPLATE_ITEMS has 8 Laxitech Products Hub items across 4 categories', () => {
  assert.equal(TEMPLATE_ITEMS.length, 8);
  const cats = extractTemplateCategories(TEMPLATE_ITEMS);
  assert.deepEqual(cats, [
    'All',
    'Pakistan VPS Hosting',
    'GXMail Business Email',
    'Cloud & DevOps Solutions',
    'Infrastructure & Security',
  ]);
  const counts = countTemplateCategories(TEMPLATE_ITEMS);
  assert.equal(counts.All, 8);
  assert.equal(
    filterTemplatesByCategory(TEMPLATE_ITEMS, 'Pakistan VPS Hosting').length,
    3
  );
  assert.equal(
    filterTemplatesByCategory(TEMPLATE_ITEMS, 'GXMail Business Email').length,
    2
  );
  assert.equal(
    getTemplatesBreadcrumbJsonLd().itemListElement[1].name,
    'Products & Cloud'
  );
});
