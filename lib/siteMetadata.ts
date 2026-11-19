import type { Metadata } from 'next';
import { SITE } from '@/data/laxitechSite';

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
  const canonicalUrl = `${SITE.url}${path === '/' ? '' : path}`;
  const fullTitle = title.endsWith('Laxitech') ? title : `${title} | Laxitech`;

  return {
    title: options?.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
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
          alt: `${title} — Laxitech`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
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
