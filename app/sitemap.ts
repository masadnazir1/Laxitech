import type { MetadataRoute } from 'next';
import { SITE_URL, ENGINEERING_SERVICES } from '@/data/laxitechSite';
import { INSIGHTS } from '@/data/insights';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL.replace(/\/$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/solutions` },
    { url: `${baseUrl}/services` },
    { url: `${baseUrl}/insights` },
    { url: `${baseUrl}/products` },
    { url: `${baseUrl}/products/vps` },
    { url: `${baseUrl}/products/gxmail` },
    { url: `${baseUrl}/products/gxnotify` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/privacy-policy` },
    { url: `${baseUrl}/terms-and-conditions` },
    { url: `${baseUrl}/refund-policy` },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = ENGINEERING_SERVICES.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
  }));

  const insightRoutes: MetadataRoute.Sitemap = INSIGHTS.map((i) => ({
    url: `${baseUrl}/insights/${i.slug}`,
    lastModified: i.dateModified || i.datePublished,
  }));

  return [...staticRoutes, ...serviceRoutes, ...insightRoutes];
}
