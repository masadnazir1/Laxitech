export interface BlogPostItem {
  id: string;
  slug: string;
  href: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  categoryKey: "cloud-architecture" | "infrastructure-vps" | "security-devops";
  categoryLabel: string;
  summary: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface BlogCategoryOption {
  key: string;
  label: string;
  href: string;
  count: number;
}

export const BLOG_CATEGORIES: BlogCategoryOption[] = [
  { key: "all", label: "All", href: "/blog", count: 6 },
  {
    key: "cloud-architecture",
    label: "Cloud Architecture",
    href: "/blog/category/cloud-architecture",
    count: 2,
  },
  {
    key: "infrastructure-vps",
    label: "Pakistan VPS & Infrastructure",
    href: "/blog/category/infrastructure-vps",
    count: 2,
  },
  {
    key: "security-devops",
    label: "Security & DevSecOps",
    href: "/blog/category/security-devops",
    count: 2,
  },
];

export const BLOG_POSTS: BlogPostItem[] = [
  {
    id: "blog-multi-cloud-resilience",
    slug: "multi-cloud-resilience-failover",
    href: "/blog/multi-cloud-resilience-failover",
    title:
      "Architecting Multi-Cloud Resilience: Achieving 99.99% SLA Across AWS and GCP",
    date: "28 Feb 2025",
    readTime: "6 min read",
    image: "/approach/dashboard.webp",
    categoryKey: "cloud-architecture",
    categoryLabel: "Cloud Architecture",
    summary:
      "How Laxitech designs fault-tolerant Kubernetes topologies, automated Terraform state synchronization, and zero-downtime failover for enterprise platforms.",
    sections: [
      {
        heading: "Designing Beyond Single-Cloud Failure Modes",
        body: "Even premier cloud hyper-scalers suffer regional availability zone outages. For mission-critical workloads, single-cloud reliance represents an unacceptable business risk. Laxitech builds multi-cloud control planes across AWS and Google Cloud Platform utilizing Kubernetes service meshes, external DNS geo-routing, and synchronized state layers.",
      },
      {
        heading: "Automated Terraform Synchronization & Zero-Downtime Failover",
        body: "Through GitOps delivery and declarative Terraform modules, compute topologies are codified, reproducible, and self-healing. Health checks evaluate packet latency and database replication lag every second, routing traffic away from degraded regions within milliseconds.",
      },
    ],
  },
  {
    id: "blog-pakistan-vps-latency",
    slug: "pakistan-hosted-vps-low-latency",
    href: "/blog/pakistan-hosted-vps-low-latency",
    title:
      "The Low-Latency Advantage: Why In-Country Pakistan VPS Hosting Matters",
    date: "19 Feb 2025",
    readTime: "5 min read",
    image: "/approach/panel.webp",
    categoryKey: "infrastructure-vps",
    categoryLabel: "Pakistan VPS & Infrastructure",
    summary:
      "Exploring sub-5ms local roundtrip latencies, Enterprise NVMe Gen4 speeds, and domestic data sovereignty for Pakistan fintech and web applications.",
    sections: [
      {
        heading: "Sub-5ms Local Response Times vs Overseas Data Centers",
        body: "Hosting a web application in Singapore or Frankfurt introduces an unavoidable 120ms to 240ms roundtrip network overhead for users in Karachi, Lahore, and Islamabad. Laxitech’s Pakistan Hosted VPS operates directly inside Tier III facilities in Islamabad and Lahore, bringing roundtrip ping down to under 5ms.",
      },
      {
        heading: "Data Sovereignty, Enterprise NVMe & Direct PKR Billing",
        body: "Beyond speed, local hosting satisfies regulatory data residency mandates for financial and health data. Paired with Enterprise NVMe Gen4 SSD arrays and billing natively in PKR without foreign transaction charges, organizations maximize reliability while minimizing overhead.",
      },
    ],
  },
  {
    id: "blog-gxmail-deliverability",
    slug: "gxmail-spf-dkim-dmarc-deliverability",
    href: "/blog/gxmail-spf-dkim-dmarc-deliverability",
    title:
      "Eliminating Spam Placement: The Definitive Guide to SPF, DKIM, and DMARC with GXMail",
    date: "08 Feb 2025",
    readTime: "5 min read",
    image: "/approach/site-a.webp",
    categoryKey: "security-devops",
    categoryLabel: "Security & DevSecOps",
    summary:
      "Why authenticated custom domain email is crucial for corporate credibility and how GXMail guarantees 100% inbox deliverability with TLS encryption.",
    sections: [
      {
        heading: "The Mechanics of Modern Email Authentication",
        body: "Sending corporate proposals and invoices from free email providers or poorly configured mail servers results in high spam bounce rates. GXMail integrates cryptographic 2048-bit DKIM signatures, strict SPF validation, and DMARC reject policies to prove domain identity to Gmail, Microsoft 365, and Yahoo.",
      },
      {
        heading: "Turnkey Administration with Encrypted Protocols",
        body: "Every mailbox on GXMail is backed by TLS 1.3 protocol encryption for all incoming and outgoing SMTP and IMAP connections, protecting executive communication against eavesdropping and domain spoofing.",
      },
    ],
  },
  {
    id: "blog-iso-27001-compliance",
    slug: "iso-27001-soc-2-compliance",
    href: "/blog/iso-27001-soc-2-compliance",
    title:
      "Enterprise Zero-Trust Security: Navigating ISO 27001 & SOC 2 Type II Accreditation",
    date: "26 Jan 2025",
    readTime: "6 min read",
    image: "/approach/site-b.webp",
    categoryKey: "security-devops",
    categoryLabel: "Security & DevSecOps",
    summary:
      "How to implement defense-in-depth network boundaries, mutual TLS encryption, and automated compliance auditing across distributed infrastructure.",
    sections: [
      {
        heading: "Establishing Zero-Trust Network Boundaries",
        body: "Traditional perimeter firewalls are insufficient for distributed modern enterprises. Laxitech deploys zero-trust access control, requiring cryptographic mutual TLS (mTLS) verification and least-privilege role-based access for every microservice and staff connection.",
      },
      {
        heading: "Audit Trails & Continuous Compliance Automation",
        body: "Achieving ISO 27001 and SOC 2 Type II compliance requires verifiable audit logs, automated chaos testing, and vulnerability patch verification embedded directly into GitOps pull request pipelines.",
      },
    ],
  },
  {
    id: "blog-finops-cloud-cost",
    slug: "finops-cloud-cost-reduction",
    href: "/blog/finops-cloud-cost-reduction",
    title:
      "FinOps in Practice: How We Reduced Enterprise Cloud Spend by 38% Without Downtime",
    date: "14 Jan 2025",
    readTime: "5 min read",
    image: "/approach/site-c.webp",
    categoryKey: "cloud-architecture",
    categoryLabel: "Cloud Architecture",
    summary:
      "A step-by-step breakdown of architectural rightsizing, spot instance automation, and database tuning that saved tens of thousands in annual AWS spend.",
    sections: [
      {
        heading: "Eliminating Cloud Waste and Overprovisioning",
        body: "Over 30% of enterprise cloud spend is typically wasted on idle compute nodes, unattached persistent storage volumes, and inefficient data transfer routes. Our FinOps architects audit resource utilization to rightsize workloads and eliminate cloud waste.",
      },
      {
        heading: "Dynamic Autoscaling & Database Query Optimization",
        body: "By optimizing PostgreSQL indexing, implementing Redis caching layers, and introducing horizontal pod autoscalers, systems achieve higher throughput with fewer compute instances.",
      },
    ],
  },
  {
    id: "blog-bare-metal-virtualization",
    slug: "bare-metal-virtualization-proxmox",
    href: "/blog/bare-metal-virtualization-proxmox",
    title:
      "Enterprise Virtualization: High-Availability Clusters on Bare-Metal NVMe Hardware",
    date: "02 Jan 2025",
    readTime: "6 min read",
    image: "/approach/site-d.webp",
    categoryKey: "infrastructure-vps",
    categoryLabel: "Pakistan VPS & Infrastructure",
    summary:
      "Deploying high-performance Proxmox and KVM clusters with distributed Ceph storage and automated disaster recovery failover drills.",
    sections: [
      {
        heading: "Bare-Metal Compute vs Shared Hypervisors",
        body: "For latency-sensitive enterprise applications, noisy-neighbor contention on shared public clouds degrades performance. Laxitech engineers single-tenant dedicated bare-metal infrastructure running hardened Linux KVM and Proxmox VE environments.",
      },
      {
        heading: "High Availability with Distributed Ceph Storage",
        body: "With distributed Ceph storage replication across multiple physical nodes, if any physical server experiences hardware fault, virtual instances automatically live-migrate to healthy nodes with zero downtime.",
      },
    ],
  },
];

export function filterBlogsByCategory(
  posts: BlogPostItem[],
  categoryKey: string,
): BlogPostItem[] {
  if (!categoryKey || categoryKey === "all") return posts;
  return posts.filter((p) => p.categoryKey === categoryKey);
}

export function getBlogBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.laxitech.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.laxitech.com/blog",
      },
    ],
  };
}
