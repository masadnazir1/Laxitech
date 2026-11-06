export interface ServiceCardData {
  id: string;
  slug: string;
  href: string;
  title: string;
  description: string;
  illustration?: unknown;
}

export const SERVICES_SUBTITLE =
  "Enterprise custom software engineering, resilient multi-cloud architecture, and rock-solid IT infrastructure built for high-throughput demands.";

export function getServicesBreadcrumbJsonLd() {
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
        name: "Services",
        item: "https://www.laxitech.com/services",
      },
    ],
  };
}

export const SERVICE_CARDS: ServiceCardData[] = [
  {
    id: "38dbcd11-c024-4d2c-8fba-52b4529cfcc3",
    slug: "crafted-websites",
    href: "/services/crafted-websites",
    title: "Custom Software\nEngineering",
    description:
      "Full-stack web & mobile apps, microservices, and high-throughput backend APIs built in React, Next.js, Node.js, Python, Go, and PostgreSQL.",
  },
  {
    id: "153c6a09-77d6-4d70-9c74-9614b98d8b58",
    slug: "website-redesign",
    href: "/services/website-redesign",
    title: "Cloud Architecture\n& Migration",
    description:
      "Seamless cloud migration across AWS, Azure, and GCP, containerization with Docker & Kubernetes, and multi-region zero-downtime failover.",
  },
  {
    id: "e1f2f0db-4271-4090-9146-7517513c8eb5",
    slug: "ecommerce-website-design",
    href: "/services/ecommerce-website-design",
    title: "IT Infrastructure\n& Virtualization",
    description:
      "High-availability server clusters, enterprise virtualization (VMware, Proxmox), disaster recovery planning, and bare-metal environments.",
  },
  {
    id: "00f10d35-58df-4091-b495-6ee62b8869a6",
    slug: "cms-and-dynamic-websites",
    href: "/services/cms-and-dynamic-websites",
    title: "Pakistan Hosted VPS\n& NVMe Cloud",
    description:
      "Low-latency (<5ms) Pakistan in-country VPS hosting with Enterprise NVMe SSD storage, data sovereignty compliance, and billing in PKR.",
  },
  {
    id: "5e898e7b-3e0e-4821-8176-66202a1739d7",
    slug: "landing-pages-and-microsites",
    href: "/services/landing-pages-and-microsites",
    title: "GXMail Enterprise\nDomain Email",
    description:
      "Custom domain email (@yourcompany.com) with SPF, DKIM, DMARC DNS authentication, anti-spam protection, and TLS encrypted SMTP/IMAP.",
  },
  {
    id: "b2b27038-1b1c-427e-a892-682f27f69939",
    slug: "consistent-identity",
    href: "/services/consistent-identity",
    title: "DevOps Automation\n& GitOps CI/CD",
    description:
      "Automated CI/CD pipelines, Infrastructure as Code with Terraform, container orchestration, and continuous security compliance.",
  },
  {
    id: "d18f182a-7627-44a4-821b-3318b989d6eb",
    slug: "motion-and-interaction-design",
    href: "/services/motion-and-interaction-design",
    title: "Zero-Trust Security\n& ISO 27001",
    description:
      "Rigorous zero-trust network boundaries, mTLS, role-based access control, vulnerability auditing, and SOC 2 / ISO 27001 accreditations.",
  },
  {
    id: "943a76a0-0102-4069-b2d1-6eb85f0b8103",
    slug: "ux-centric-strategy",
    href: "/services/ux-centric-strategy",
    title: "AI Integration &\nThroughput Engines",
    description:
      "Scalable LLM and ML model integration, automated intelligent workflows, and high-performance processing engines for business automation.",
  },
  {
    id: "89f88721-9b0c-4a62-842b-1111270b3791",
    slug: "performance-optimization",
    href: "/services/performance-optimization",
    title: "FinOps & Cloud\nCost Optimization",
    description:
      "In-depth cloud expenditure audits, rightsizing compute resources, database query tuning, and automated autoscaling to reduce cloud bills by 30-40%.",
  },
  {
    id: "a7091722-3b1e-4449-9072-7315622e7369",
    slug: "maintenance-and-ongoing-support",
    href: "/services/maintenance-and-ongoing-support",
    title: "24/7 Managed Cloud\n& Operations",
    description:
      "Round-the-clock infrastructure telemetry with Prometheus and Grafana, automated backup verification, incident response, and 99.99% SLA.",
  },
];
