import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { SITE, ENGINEERING_SERVICES } = await import('../data/laxitechSite.ts');
const { INSIGHTS } = await import('../data/insights.ts');

const baseUrl = SITE.url.replace(/\/$/, '');
const lastModified = new Date().toISOString();

const routes = [
  { path: '/', changeFrequency: 'weekly', priority: '1.0' },
  { path: '/about', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/solutions', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/services', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/insights', changeFrequency: 'monthly', priority: '0.85' },
  { path: '/products', changeFrequency: 'monthly', priority: '0.85' },
  { path: '/products/vps', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/products/gxmail', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/products/gxnotify', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/contact', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: '0.4' },
  { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: '0.4' },
  { path: '/refund-policy', changeFrequency: 'yearly', priority: '0.4' },
  ...ENGINEERING_SERVICES.map((service) => ({
    path: `/services/${service.slug}`,
    changeFrequency: 'monthly',
    priority: '0.85',
  })),
  ...INSIGHTS.map((insight) => ({
    path: `/insights/${insight.slug}`,
    changeFrequency: 'monthly',
    priority: '0.75',
  })),
];

const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const urls = routes
  .map(({ path, changeFrequency, priority }) => [
    '  <url>',
    `    <loc>${escapeXml(`${baseUrl}${path === '/' ? '/' : path}`)}</loc>`,
    `    <lastmod>${lastModified}</lastmod>`,
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n'))
  .join('\n');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  '',
].join('\n');

const outputPath = join(root, 'public', 'sitemap.xml');
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, xml, 'utf8');

console.log(`Generated ${outputPath} with ${routes.length} URLs.`);
