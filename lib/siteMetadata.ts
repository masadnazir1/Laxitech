import type { Metadata } from 'next';
import { SITE, SITE_URL } from '@/data/laxitechSite';

interface SiteMetadataOptions {
  type?: 'website' | 'article';
  robots?: Metadata['robots'];
  absoluteTitle?: boolean;
}

export function siteMetadata(
  title: string,
  description: string,
  path: string,
  options?: SiteMetadataOptions
): Metadata {
  const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;
  const isHome = path === '/';
  const hasBrand = title.includes('Laxitech');

  // Prevent double-brand in fullTitle and OG/Twitter titles
  const fullTitle = (options?.absoluteTitle || hasBrand)
    ? title
    : `${title} | Laxitech`;

  const imageAlt = (isHome || hasBrand)
    ? (title.includes('—') ? title : title.replace(' | ', ' — '))
    : `${title} — Laxitech`;

  const resolvedTitle = (options?.absoluteTitle || isHome)
    ? { absolute: title }
    : title;

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: options?.absoluteTitle || isHome ? title : fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE.name,
      type: options?.type ?? 'website',
      locale: 'en_US',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options?.absoluteTitle || isHome ? title : fullTitle,
      description,
      images: ['/opengraph-image'],
    },
    robots: options?.robots ?? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
