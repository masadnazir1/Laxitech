import type { Metadata } from 'next';
import { SITE } from '@/data/laxitechSite';

export function siteMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}${path}` },
    openGraph: { title: title.startsWith(SITE.name) ? title : `${title} | Laxitech`, description, url: `${SITE.url}${path}`, siteName: SITE.name },
  };
}
