export interface FeaturedWork {
  slug: string;
  category: string;
  title: string;
  titleAccent: string;
  description: string;
  liveUrl: string;
  img: string;
  accentColor: string;
}

export const FEATURED_WORKS: FeaturedWork[] = [
  {
    slug: "vixion-studio",
    category: "Tier III Pakistan Infrastructure",
    title: "Pakistan NVMe",
    titleAccent: "Cloud VPS",
    description:
      "High-performance KVM virtualization hosted in Islamabad and Karachi data centers with Gen4 NVMe storage, 10Gbps unmetered uplink, and sub-15ms domestic ping.",
    liveUrl: "https://cloud.laxitech.com/",
    img: "/snapshots/vixion.png",
    accentColor: "#0066FF",
  },
  {
    slug: "movix-studio",
    category: "Enterprise Business Email",
    title: "GXMail Enterprise",
    titleAccent: "Suite",
    description:
      "Dedicated corporate email infrastructure with 100% inbox deliverability, automated SPF/DKIM/DMARC authentication, and proactive spam shielding.",
    liveUrl: "https://www.laxitech.com/",
    img: "/snapshots/movixstudio-2.png",
    accentColor: "#8B5CF6",
  },
  {
    slug: "commerce-lions",
    category: "Managed Cloud Databases",
    title: "High-Availability",
    titleAccent: "Database Mesh",
    description:
      "Distributed PostgreSQL, MySQL, and Redis clusters engineered for zero-data-loss failover, automated point-in-time recovery, and SOC 2 compliance.",
    liveUrl: "https://cloud.laxitech.com/",
    img: "/snapshots/commercelions.png",
    accentColor: "#2563EB",
  },
  {
    slug: "superluxuries-store",
    category: "Web Hosting Infrastructure",
    title: "cPanel & LiteSpeed",
    titleAccent: "Hosting",
    description:
      "Turbocharged enterprise cPanel web hosting powered by LiteSpeed web servers, free Let's Encrypt SSL, 1-click WordPress staging, and automated daily backups.",
    liveUrl: "https://www.laxitech.com/",
    img: "/snapshots/superluxuries.png",
    accentColor: "#7C3AED",
  },
  {
    slug: "mac-vision",
    category: "Hybrid Cloud & Disaster Recovery",
    title: "Multi-Cloud Edge",
    titleAccent: "Fabric",
    description:
      "Multi-region hybrid cloud mesh interconnecting domestic Pakistan compute clusters with global Cloudflare edge CDN, AWS, and GCP failover.",
    liveUrl: "https://cloud.laxitech.com/",
    img: "/snapshots/macvision.png",
    accentColor: "#0066FF",
  },
];
