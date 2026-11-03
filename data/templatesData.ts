export interface TemplateCardItem {
  id: string;
  title: string;
  category:
    | 'Pakistan VPS Hosting'
    | 'GXMail Business Email'
    | 'Cloud & DevOps Solutions'
    | 'Infrastructure & Security';
  badge: 'OPEN SOURCE' | 'FREE TOOL' | 'PRO SYSTEM' | 'CYBER SKILL';
  image: string;
  href: string;
  price: string;
  was?: string;
  platformName: string;
  summary: string;
  slugForPreview?: string;
}

export interface CommunityToolIdea {
  id: string;
  title: string;
  category: string;
  replacesPaidApp: string;
  description: string;
  votes: number;
  status: 'Building Now' | 'Top Voted' | 'Under Review';
}

export const ALL_TEMPLATE_CATEGORY = 'All';

export const TEMPLATES_SUBTITLE =
  'Enterprise-grade Pakistan Hosted VPS, GXMail custom domain business email, multi-cloud Kubernetes infrastructure, and zero-trust security engineered by Laxitech.';

export const TEMPLATE_ITEMS: TemplateCardItem[] = [
  {
    id: 'vps-starter',
    title: 'Pakistan Hosted VPS Starter — 1 vCPU, 2 GB RAM, 30 GB NVMe',
    category: 'Pakistan VPS Hosting',
    badge: 'PRO SYSTEM',
    image: '/approach/dashboard.webp',
    href: '/contact',
    price: 'PKR 999/mo',
    was: 'PKR 1,500',
    platformName: 'Pakistan Local NVMe Cloud',
    summary:
      '1 Core vCPU, 2 GB High-Speed RAM, 30 GB Enterprise NVMe, 1 TB Bandwidth. Sub-5ms local latency in Pakistan for websites, WordPress, and small APIs.',
    slugForPreview: 'vixion-studio',
  },
  {
    id: 'vps-business',
    title: 'Pakistan Hosted VPS Business — 2 vCPUs, 4 GB RAM, 60 GB NVMe',
    category: 'Pakistan VPS Hosting',
    badge: 'PRO SYSTEM',
    image: '/approach/panel.webp',
    href: '/contact',
    price: 'PKR 1,799/mo',
    was: 'PKR 2,600',
    platformName: 'Most Popular Cloud Tier',
    summary:
      '2 Cores vCPU, 4 GB High-Speed RAM, 60 GB Enterprise NVMe, 2 TB Bandwidth. Engineered for multiple websites, Docker apps, Node.js/NestJS, and databases.',
    slugForPreview: 'commerce-lions',
  },
  {
    id: 'vps-pro',
    title: 'Pakistan Hosted VPS Pro — 4 vCPUs, 8 GB RAM, 120 GB NVMe',
    category: 'Pakistan VPS Hosting',
    badge: 'PRO SYSTEM',
    image: '/approach/site-a.webp',
    href: '/contact',
    price: 'PKR 3,299/mo',
    was: 'PKR 4,800',
    platformName: 'High-Throughput Enterprise',
    summary:
      '4 Cores vCPU, 8 GB High-Speed RAM, 120 GB Enterprise NVMe, 4 TB Bandwidth. Tailored for high-traffic platforms, large API clusters, and databases.',
    slugForPreview: 'movix-studio',
  },
  {
    id: 'gxmail-monthly',
    title: 'GXMail Business Email — Monthly Plan (@yourcompany.com)',
    category: 'GXMail Business Email',
    badge: 'PRO SYSTEM',
    image: '/approach/site-b.webp',
    href: '/contact',
    price: 'Rs 250/mo',
    was: 'Rs 450',
    platformName: 'Authenticated Domain Mail',
    summary:
      'Professional business email on your domain with SPF, DKIM, and DMARC DNS authentication, automated anti-spam protection, and TLS encrypted SMTP/IMAP.',
    slugForPreview: 'mac-vision',
  },
  {
    id: 'gxmail-yearly',
    title: 'GXMail Annual Suite — Full Organizational Deployment',
    category: 'GXMail Business Email',
    badge: 'PRO SYSTEM',
    image: '/approach/site-c.webp',
    href: '/contact',
    price: 'Rs 2,999/yr',
    was: 'Rs 4,800',
    platformName: 'Annual Discounted Tier',
    summary:
      'Complete organization email solution with team mailboxes, centralized admin controls, webmail access, anti-phishing protection, and priority support.',
    slugForPreview: 'superluxuries-store',
  },
  {
    id: 'cloud-multi-k8s',
    title: 'Multi-Cloud Kubernetes & Terraform GitOps Blueprint',
    category: 'Cloud & DevOps Solutions',
    badge: 'OPEN SOURCE',
    image: '/approach/site-d.webp',
    href: 'https://github.com/galaxydev-pk',
    price: 'Open Source',
    platformName: 'AWS • Azure • GCP',
    summary:
      'Resilient multi-cloud container orchestration blueprint with automated horizontal pod autoscaling, blue/green deployments, and cross-region failover.',
    slugForPreview: 'vixion-studio',
  },
  {
    id: 'infra-bare-metal',
    title: 'Dedicated Bare-Metal Server Clusters',
    category: 'Infrastructure & Security',
    badge: 'PRO SYSTEM',
    image: '/approach/watches.jpg',
    href: '/contact',
    price: 'Custom Scope',
    platformName: 'Pakistan Tier III Facility',
    summary:
      'Single-tenant physical servers hosted in domestic Pakistan data centers with IPMI out-of-band management, high-throughput uplinks, and custom hardware.',
    slugForPreview: 'commerce-lions',
  },
  {
    id: 'infra-zero-trust',
    title: 'Zero-Trust Perimeter & WireGuard Security Gateway',
    category: 'Infrastructure & Security',
    badge: 'CYBER SKILL',
    image: '/approach/agency.jpg',
    href: '/contact',
    price: 'Enterprise',
    platformName: 'ISO 27001 Security Standard',
    summary:
      'Defense-in-depth perimeter security architecture with mutual TLS, encrypted WireGuard VPN tunnels, and continuous penetration auditing.',
    slugForPreview: 'movix-studio',
  },
];

export const INITIAL_COMMUNITY_IDEAS: CommunityToolIdea[] = [
  {
    id: 'idea-dns-email-auditor',
    title: '1-Click @yourdomain.com SPF / DKIM / DMARC Deliverability Fixer',
    category: 'Cyber & DNS Utility',
    replacesPaidApp: 'Replaces $49/mo MX/Email Audit SaaS',
    description:
      'Paste any business domain to instantly test why emails land in spam and generate exact copy-paste Cloudflare/Namecheap DNS records.',
    votes: 42,
    status: 'Building Now',
  },
  {
    id: 'idea-finops-auditor',
    title: 'Multi-Cloud Terraform Cost Estimator & FinOps Auditor',
    category: 'Cloud FinOps Utility',
    replacesPaidApp: 'Replaces Expensive Cloud Cost Tools',
    description:
      'Analyze your Terraform state or AWS/GCP bills to identify idle resources, oversized instances, and potential 30-40% cost reductions.',
    votes: 38,
    status: 'Top Voted',
  },
  {
    id: 'idea-latency-tracer',
    title: 'Pakistan Edge Latency Ping & Domestic Route Tracer',
    category: 'Network Telemetry Utility',
    replacesPaidApp: 'Replaces Synthetic Monitoring Services',
    description:
      'Measure real-time local roundtrip pings from PTCL, Nayatel, StormFiber, and Jazz across Pakistan data centers.',
    votes: 31,
    status: 'Top Voted',
  },
];

export function extractTemplateCategories(items: TemplateCardItem[]): string[] {
  const seen = new Set<string>();
  const cats: string[] = [ALL_TEMPLATE_CATEGORY];
  for (const item of items) {
    if (item.category && !seen.has(item.category)) {
      seen.add(item.category);
      cats.push(item.category);
    }
  }
  return cats;
}

export function countTemplateCategories(
  items: TemplateCardItem[]
): Record<string, number> {
  const counts: Record<string, number> = {
    [ALL_TEMPLATE_CATEGORY]: items.length,
  };
  for (const item of items) {
    if (item.category) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
  }
  return counts;
}

export function filterTemplatesByCategory(
  items: TemplateCardItem[],
  category: string
): TemplateCardItem[] {
  if (!category || category === ALL_TEMPLATE_CATEGORY) return items;
  return items.filter((item) => item.category === category);
}

export function getTemplatesBreadcrumbJsonLd() {
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
        name: 'Products & Cloud',
        item: 'https://www.galaxydev.pk/templates',
      },
    ],
  };
}
