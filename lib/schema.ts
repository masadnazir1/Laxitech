import { SITE, ENGINEERING_SERVICES, VPS_PLANS, GXMAIL_PLANS, GXNOTIFY_PLANS } from '@/data/laxitechSite';
import type { Insight } from '@/data/insights';

export const ORGANIZATION_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.png`,
    email: SITE.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE.email,
      telephone: SITE.phone,
      availableLanguage: ['English', 'Urdu'],
    },
    sameAs: [
      SITE.whatsapp,
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    alternateName: 'Laxitech',
    url: SITE.url,
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : `${SITE.url}${item.item === '/' ? '' : item.item}`,
    })),
  };
}

export function getAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE.url}/about#webpage`,
    url: `${SITE.url}/about`,
    name: 'About Our Engineering Team & Technology Partner | Laxitech',
    description:
      'Laxitech combines software engineering, cloud architecture and infrastructure operations in one practical engineering partnership.',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
  };
}

export function getContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE.url}/contact#webpage`,
    url: `${SITE.url}/contact`,
    name: 'Contact Our Engineering Team to Start a Project | Laxitech',
    description:
      'Talk to Laxitech about your custom software, cloud architecture, Pakistan VPS hosting, or enterprise workflow automation project.',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': ORGANIZATION_ID },
  };
}

export function getServicesCollectionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE.url}/services#webpage`,
    url: `${SITE.url}/services`,
    name: 'Engineering Services & Systems Architecture | Laxitech',
    description:
      'Software, cloud architecture, infrastructure, DevOps, AI automation and security engineering from one team.',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: ENGINEERING_SERVICES.length,
      itemListElement: ENGINEERING_SERVICES.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: service.name,
        url: `${SITE.url}/services/${service.slug}`,
      })),
    },
  };
}

export function getServiceSchema(slug: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.url}/services/${slug}#service`,
    url: `${SITE.url}/services/${slug}`,
    name,
    description,
    provider: { '@id': ORGANIZATION_ID },
    serviceType: name,
  };
}

export function getProductsCollectionSchema() {
  const products = [
    { name: 'Pakistan VPS Hosting', url: `${SITE.url}/products/vps` },
    { name: 'GXMail Business Email', url: `${SITE.url}/products/gxmail` },
    { name: 'GXNotify Notification API', url: `${SITE.url}/products/gxnotify` },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE.url}/products#webpage`,
    url: `${SITE.url}/products`,
    name: 'Cloud Products, Business Email & Messaging API | Laxitech',
    description:
      'Explore Pakistan-hosted NVMe cloud infrastructure, GXMail business email and the GXNotify multi-channel notification API.',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: prod.name,
        url: prod.url,
      })),
    },
  };
}

export function getVpsProductSchema() {
  const lowestPrice = Math.min(...VPS_PLANS.map((p) => p.price));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE.url}/products/vps#product`,
    url: `${SITE.url}/products/vps`,
    name: 'Pakistan VPS Hosting',
    description:
      'Pakistan-hosted NVMe VPS plans starting from PKR 999 per month with sub-10ms domestic latency and local PKR billing.',
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: lowestPrice,
      offerCount: VPS_PLANS.length,
    },
    provider: { '@id': ORGANIZATION_ID },
  };
}

export function getGxmailProductSchema() {
  const lowestMonthlyPrice = Math.min(
    ...GXMAIL_PLANS.map((p) => p.billing.monthly.price)
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE.url}/products/gxmail#software`,
    url: `${SITE.url}/products/gxmail`,
    name: 'GXMail Business Email',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Secure custom-domain business email hosting with pooled mailbox storage, strict SPF/DKIM/DMARC deliverability, webmail, and administration.',
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: lowestMonthlyPrice,
      offerCount: GXMAIL_PLANS.length,
    },
    provider: { '@id': ORGANIZATION_ID },
  };
}

export function getGxnotifyProductSchema() {
  const lowestPrice = Math.min(...GXNOTIFY_PLANS.map((p) => p.price));
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE.url}/products/gxnotify#software`,
    url: `${SITE.url}/products/gxnotify`,
    name: 'GXNotify Notification API',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description:
      'Developer API suite unifying Email, SMS, and Firebase Cloud Messaging push notifications with template management and delivery tracking.',
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: lowestPrice,
      offerCount: GXNOTIFY_PLANS.length,
    },
    provider: { '@id': ORGANIZATION_ID },
  };
}

export function getInsightArticleSchema(article: Insight) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE.url}/insights/${article.slug}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    image: `${SITE.url}/opengraph-image`,
    mainEntityOfPage: `${SITE.url}/insights/${article.slug}`,
  };
}
