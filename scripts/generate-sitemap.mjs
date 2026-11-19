import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { SITE, SITE_URL, ENGINEERING_SERVICES } = await import('../data/laxitechSite.ts');
const { INSIGHTS } = await import('../data/insights.ts');

const baseUrl = (SITE_URL || SITE.url).replace(/\/$/, '');

async function getPageLastMod(relPath) {
  try {
    const filePath = join(root, 'app', relPath === '/' ? 'page.tsx' : `${relPath.replace(/^\//, '')}/page.tsx`);
    const fileStat = await stat(filePath);
    return fileStat.mtime.toISOString();
  } catch {
    return null;
  }
}

const staticPaths = [
  '/',
  '/about',
  '/solutions',
  '/services',
  '/insights',
  '/products',
  '/products/vps',
  '/products/gxmail',
  '/products/gxnotify',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
];

const routes = [];

for (const path of staticPaths) {
  const lastmod = await getPageLastMod(path);
  routes.push({ path, lastmod });
}

for (const service of ENGINEERING_SERVICES) {
  const path = `/services/${service.slug}`;
  const lastmod = await getPageLastMod('/services/[slug]');
  routes.push({ path, lastmod });
}

for (const insight of INSIGHTS) {
  const path = `/insights/${insight.slug}`;
  const lastmod = insight.dateModified || insight.datePublished || (await getPageLastMod('/insights/[slug]'));
  routes.push({ path, lastmod });
}

const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const urls = routes
  .map(({ path, lastmod }) => {
    const loc = escapeXml(`${baseUrl}${path === '/' ? '' : path}`);
    const lines = [
      '  <url>',
      `    <loc>${loc}</loc>`,
    ];
    if (lastmod) {
      lines.push(`    <lastmod>${lastmod}</lastmod>`);
    }
    lines.push('  </url>');
    return lines.join('\n');
  })
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

console.log(`Generated ${outputPath} with ${routes.length} URLs (changefreq & priority removed).`);
