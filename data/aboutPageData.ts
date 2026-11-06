export interface AboutBadge {
  id: string;
  icon: string;
  metric: string;
  label: string;
  sublabel: string;
}

export interface AboutValueItem {
  step: string;
  phase: string;
  icon: string;
  title: string;
  description: string;
  highlights: string[];
  side: "left" | "right";
  marginTop?: number;
}

export const ABOUT_BADGES: AboutBadge[] = [
  {
    id: "uptime",
    icon: "speed",
    metric: "99.99%",
    label: "Cloud SLA",
    sublabel: "Uptime Target",
  },
  {
    id: "security",
    icon: "verified_user",
    metric: "ISO 27001",
    label: "Certified",
    sublabel: "SOC 2 Type II",
  },
  {
    id: "latency",
    icon: "bolt",
    metric: "< 5ms",
    label: "Local Latency",
    sublabel: "Pakistan DC",
  },
  {
    id: "projects",
    icon: "auto_awesome",
    metric: "150+",
    label: "Projects",
    sublabel: "Shipped Live",
  },
];

export const ABOUT_VALUES: AboutValueItem[] = [
  {
    step: "01",
    phase: "2018 • Inception",
    icon: "lightbulb",
    title: "Company Founded",
    description:
      "Laxitech was founded on a simple premise: enterprise systems should be rock-solid, lightning-fast, and built to adapt. We started as a specialized cloud architecture consultancy assisting high-growth tech startups.",
    highlights: ["Cloud Strategy", "System Audits", "Architecture Design"],
    side: "left",
    marginTop: 47,
  },
  {
    step: "02",
    phase: "2020 • Scaling",
    icon: "palette",
    title: "Enterprise Engineering",
    description:
      "Expanded our core capabilities to full-stack custom software engineering, microservices development, and high-throughput backend APIs across financial, healthcare, and e-commerce platforms.",
    highlights: ["Microservice Core", "High Throughput", "Distributed DBs"],
    side: "right",
  },
  {
    step: "03",
    phase: "2022 • Accreditation",
    icon: "shield_lock",
    title: "ISO 27001 Certification",
    description:
      "Achieved global ISO 27001 and SOC 2 Type II compliance accreditations, establishing defense-in-depth security architectures and zero-trust perimeter controls across all environments.",
    highlights: ["ISO 27001 Certified", "SOC 2 Type II", "Zero-Trust mTLS"],
    side: "left",
  },
  {
    step: "04",
    phase: "2023 • Edge Cloud",
    icon: "speed",
    title: "Pakistan Local VPS Launch",
    description:
      "Deployed domestic high-frequency Tier III data center facilities in Islamabad and Lahore, providing sub-5ms local latency, NVMe SSD speeds, and direct PKR billing with zero forex friction.",
    highlights: ["<5ms Local Ping", "Enterprise NVMe", "Data Sovereignty"],
    side: "right",
  },
  {
    step: "05",
    phase: "2024 • Communication",
    icon: "dashboard",
    title: "GXMail Business Engine",
    description:
      "Engineered GXMail, an enterprise-grade business email solution with automated SPF, DKIM, and DMARC authentication, encrypted storage, and real-time anti-phishing protection.",
    highlights: ["SPF / DKIM / DMARC", "Turnkey Admin", "99.9% Mail SLA"],
    side: "left",
  },
  {
    step: "06",
    phase: "2025 • Automation",
    icon: "auto_awesome",
    title: "GitOps & DevSecOps",
    description:
      "Integrated end-to-end Infrastructure as Code (Terraform) and automated CI/CD deployment pipelines, enabling bi-weekly agile sprint releases and continuous chaos testing.",
    highlights: ["Terraform IaC", "GitOps Pipelines", "Blue/Green Deploys"],
    side: "right",
  },
  {
    step: "07",
    phase: "2026+ • Global Reach",
    icon: "rocket_launch",
    title: "150+ Enterprise Deployments",
    description:
      "Operating globally from Silicon Valley, CA and Pakistan, delivering mission-critical multi-cloud architectures, custom software, and 24/7 dedicated SRE monitoring.",
    highlights: ["99.99% Cloud SLA", "24/7 Global Ops", "Dedicated Architect"],
    side: "left",
  },
];

export function getAboutBreadcrumbJsonLd() {
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
        name: "About Us",
        item: "https://www.laxitech.com/about-us",
      },
    ],
  };
}
