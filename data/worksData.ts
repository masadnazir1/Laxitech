export interface WorkProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  url: string;
  domain: string;
  summary: string;
}

export const ALL_CATEGORY = 'All';

export const ALL_WORKS: WorkProject[] = [
  {
    id: 'lx-pakistan-vps',
    slug: 'vixion-studio',
    title: 'Pakistan NVMe Cloud VPS',
    category: 'VPS Hosting',
    image: '/snapshots/vixion.png',
    url: 'https://cloud.galaxydev.pk/',
    domain: 'galaxydev.pk',
    summary:
      'High-performance KVM virtualization hosted in Islamabad and Karachi data centers with Gen4 NVMe storage and sub-15ms domestic ping.',
  },
  {
    id: 'lx-gxmail-suite',
    slug: 'movix-studio',
    title: 'GXMail Enterprise Suite',
    category: 'Cloud Architecture',
    image: '/snapshots/movixstudio-2.png',
    url: 'https://www.galaxydev.pk/',
    domain: 'galaxydev.pk',
    summary:
      'Dedicated corporate business email infrastructure with automated SPF, DKIM, DMARC, and 100% inbox placement.',
  },
  {
    id: 'lx-managed-databases',
    slug: 'commerce-lions',
    title: 'High-Availability Database Mesh',
    category: 'Zero-Trust Security',
    image: '/snapshots/commercelions.png',
    url: 'https://cloud.galaxydev.pk/',
    domain: 'galaxydev.pk',
    summary:
      'Distributed PostgreSQL and MySQL database clusters with automated point-in-time recovery and zero data loss failover.',
  },
  {
    id: 'lx-cpanel-hosting',
    slug: 'superluxuries-store',
    title: 'cPanel & LiteSpeed Web Hosting',
    category: 'Custom Software',
    image: '/snapshots/superluxuries.png',
    url: 'https://www.galaxydev.pk/',
    domain: 'galaxydev.pk',
    summary:
      'Turbocharged cPanel hosting powered by LiteSpeed web servers, free Let\'s Encrypt SSL, and 1-click WordPress staging.',
  },
  {
    id: 'lx-multi-cloud-edge',
    slug: 'mac-vision',
    title: 'Multi-Cloud Edge Fabric',
    category: 'VPS Hosting',
    image: '/snapshots/macvision.png',
    url: 'https://cloud.galaxydev.pk/',
    domain: 'galaxydev.pk',
    summary:
      'Multi-region hybrid cloud mesh interconnecting domestic Pakistan compute clusters with global Cloudflare edge CDN and AWS failover.',
  },
];

export function extractWorkCategories(
  items: WorkProject[] = ALL_WORKS
): string[] {
  const cats: string[] = [];
  for (const item of items) {
    if (item.category && !cats.includes(item.category)) {
      cats.push(item.category);
    }
  }
  return [ALL_CATEGORY, ...cats];
}

export function countWorkCategories(
  items: WorkProject[] = ALL_WORKS
): Record<string, number> {
  const counts: Record<string, number> = { [ALL_CATEGORY]: items.length };
  for (const item of items) {
    if (item.category) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
  }
  return counts;
}

export function filterWorksByCategory(
  items: WorkProject[],
  activeCategory: string
): WorkProject[] {
  if (activeCategory === ALL_CATEGORY) return items;
  return items.filter((item) => item.category === activeCategory);
}

export const WORK_CATEGORIES = extractWorkCategories(ALL_WORKS);

export function getWorksBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.galaxydev.pk/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Works',
        item: 'https://www.galaxydev.pk/works',
      },
    ],
  };
}
