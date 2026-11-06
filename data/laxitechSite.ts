export const SITE = {
  name: "Laxitech",
  url: "https://laxitech.com",
  email: "contact@laxitech.com",
  phone: "+92 340 8882796",
  whatsapp: "https://wa.me/923408882796",
  cloudPortal: "https://cloud.laxitech.com/#pricing",
  mailSignup: "https://manage.laxitech.com/auth/register",
  mailPortal: "https://manage.laxitech.com/auth/login",
  webmail: "https://webmail.laxitech.com",
  notifyDashboard: "https://gxnotify.laxitech.com/dashboard",
  notifySignIn: "https://gxnotify.laxitech.com/sign-in",
  notifySignUp: "https://gxnotify.laxitech.com/sign-up",
} as const;

export type ServiceKind =
  | "software"
  | "cloud"
  | "infrastructure"
  | "devops"
  | "automation"
  | "security";

export interface EngineeringService {
  slug: string;
  kind: ServiceKind;
  name: string;
  headline: readonly string[];
  summary: string;
  introduction: string;
  deliverables: { title: string; description: string }[];
  stack: string[];
  outcome: string;
  nodes: [string, string, string];
}

export const ENGINEERING_SERVICES: EngineeringService[] = [
  {
    slug: "software-engineering",
    kind: "software",
    name: "Custom software engineering",
    headline: ["Software that", "works for you."],
    summary:
      "Web platforms, mobile experiences and desktop applications built around the way your business works.",
    introduction:
      "Your processes should shape your software. We work with your team to turn a real business problem into a maintainable product, with clear interfaces, thoughtful data models and room to evolve.",
    deliverables: [
      {
        title: "Web & mobile applications",
        description:
          "Customer-facing products and internal tools, with an experience that works across devices.",
      },
      {
        title: "Desktop & business systems",
        description:
          "Purpose-built Windows applications, operational software and integrations with your existing systems.",
      },
      {
        title: "APIs & backend engineering",
        description:
          "Well-defined services, secure integrations and database architecture that support the whole product.",
      },
      {
        title: "Modernization & ownership",
        description:
          "A considered route out of legacy software, with documentation, source code and a practical handover.",
      },
    ],
    stack: ["TypeScript", "React / Next.js", "Node.js", "Python", "PostgreSQL"],
    outcome: "A product your team can use, own and keep building on.",
    nodes: ["Your application", "Secure API", "Your data"],
  },
  {
    slug: "cloud-architecture",
    kind: "cloud",
    name: "Cloud architecture & migration",
    headline: ["Cloud without", "the complexity."],
    summary:
      "Thoughtful cloud architecture, careful migrations and infrastructure that fits your workload.",
    introduction:
      "Moving to the cloud is an engineering decision, not a checklist. We assess your application, dependencies and operating needs before designing a migration path and a cloud environment you can understand.",
    deliverables: [
      {
        title: "Architecture & readiness",
        description:
          "Workload assessment, dependency mapping, deployment topology and a clearly defined migration plan.",
      },
      {
        title: "Cloud migration",
        description:
          "Application and database moves across AWS, Azure and Google Cloud, with validation and a rollback plan.",
      },
      {
        title: "Resilience & recovery",
        description:
          "Redundancy, failover design, backup policies and recovery procedures appropriate to your business.",
      },
      {
        title: "Cloud cost optimization",
        description:
          "Practical rightsizing, resource visibility and cost controls that grow with your workloads.",
      },
    ],
    stack: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Terraform",
    ],
    outcome:
      "A cloud environment with a clear architecture and an operating plan.",
    nodes: ["Your workload", "Cloud platform", "Observability"],
  },
  {
    slug: "infrastructure",
    kind: "infrastructure",
    name: "IT infrastructure & operations",
    headline: ["A stronger", "foundation."],
    summary:
      "Servers, networks, virtualization and recovery systems designed to support everyday operations.",
    introduction:
      "Reliable software needs reliable foundations. We bring physical and virtual infrastructure into one clear operating picture, from server configuration and access policies to backups and ongoing monitoring.",
    deliverables: [
      {
        title: "Servers & virtualization",
        description:
          "Bare-metal and virtual environments configured for the applications your team actually runs.",
      },
      {
        title: "Networks & access",
        description:
          "Private networking, VPNs and access boundaries that keep the right systems connected.",
      },
      {
        title: "Backups & disaster recovery",
        description:
          "Scheduled backups, retention planning and restore procedures your team can put into practice.",
      },
      {
        title: "Managed operations",
        description:
          "Monitoring, maintenance and an agreed support process for production environments.",
      },
    ],
    stack: ["Linux", "Proxmox", "VMware", "KVM", "WireGuard", "PostgreSQL"],
    outcome: "Infrastructure you understand, with people you can turn to.",
    nodes: ["Your systems", "Private network", "Recovery & support"],
  },
  {
    slug: "devops-automation",
    kind: "devops",
    name: "DevOps & delivery automation",
    headline: ["Ship with", "confidence."],
    summary:
      "Repeatable environments, automated checks and a more dependable path from code to production.",
    introduction:
      "A good delivery process makes progress visible. We connect development and operations with versioned infrastructure, automated pipelines and useful observability, so releasing software becomes a routine your team trusts.",
    deliverables: [
      {
        title: "CI/CD pipelines",
        description:
          "Build, test and deployment workflows with the checks and approvals your team needs.",
      },
      {
        title: "Infrastructure as code",
        description:
          "Reproducible infrastructure and environment configuration stored alongside your engineering work.",
      },
      {
        title: "Containers & orchestration",
        description:
          "Docker packaging and Kubernetes deployment patterns matched to the scale of your application.",
      },
      {
        title: "Monitoring & release practices",
        description:
          "Useful logs, actionable alerts, staged rollouts and recovery procedures.",
      },
    ],
    stack: [
      "GitHub Actions",
      "GitLab CI",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Grafana",
    ],
    outcome:
      "Less release-day uncertainty. A clearer path to the next improvement.",
    nodes: ["Commit", "Build & check", "Release"],
  },
  {
    slug: "ai-automation",
    kind: "automation",
    name: "AI & workflow automation",
    headline: ["Less repetition.", "More possibility."],
    summary:
      "Connected workflows and focused AI tools that help your team get useful work done.",
    introduction:
      "Start with the work, then choose the technology. We look for repeatable processes, disconnected tools and time-consuming information tasks, and build automation with clear boundaries and human oversight.",
    deliverables: [
      {
        title: "Workflow integrations",
        description:
          "Connect your business applications, notifications and approval processes around a useful outcome.",
      },
      {
        title: "Document & data processing",
        description:
          "Extract, organize and route information with validation before it reaches important systems.",
      },
      {
        title: "AI-assisted applications",
        description:
          "Search, retrieval and assistant features grounded in the information and permissions you provide.",
      },
      {
        title: "Evaluation & handover",
        description:
          "Define useful success criteria, review failure cases and give your team control of the workflow.",
      },
    ],
    stack: ["Python", "TypeScript", "APIs", "PostgreSQL", "AI integrations"],
    outcome: "Automation that earns its place in your day-to-day work.",
    nodes: ["Incoming work", "Review & automate", "Useful output"],
  },
  {
    slug: "security-engineering",
    kind: "security",
    name: "Security & backend engineering",
    headline: ["Protection at", "every layer."],
    summary:
      "Access control, encryption and application hardening built into your systems from the beginning.",
    introduction:
      "Security works best as part of the architecture. We examine how users, services and data interact, then establish practical controls and a clear plan for the risks that matter to your application.",
    deliverables: [
      {
        title: "Application & API security",
        description:
          "Authentication, authorization and validation at the boundaries where your systems exchange information.",
      },
      {
        title: "Encryption & secrets",
        description:
          "Appropriate transport and storage protection, with managed credentials and restricted access.",
      },
      {
        title: "Zero-trust access",
        description:
          "Least-privilege roles, network segmentation and explicit service-to-service trust.",
      },
      {
        title: "Review & remediation",
        description:
          "Source and infrastructure reviews that lead to prioritized fixes and documented decisions.",
      },
    ],
    stack: [
      "TLS",
      "Role-based access",
      "Linux",
      "Private networks",
      "Secure APIs",
    ],
    outcome: "Security decisions you can explain, maintain and review.",
    nodes: ["Identity", "Access policy", "Protected data"],
  },
];

export const SERVICE_ALIASES: Record<string, string> = {
  "crafted-websites": "/services/software-engineering",
  "website-redesign": "/services/cloud-architecture",
  "ecommerce-website-design": "/services/infrastructure",
  "cms-and-dynamic-websites": "/products/vps",
  "landing-pages-and-microsites": "/products/gxmail",
  "consistent-identity": "/services/devops-automation",
  "motion-and-interaction-design": "/services/security-engineering",
  "ux-centric-strategy": "/services/ai-automation",
  "performance-optimization": "/services/cloud-architecture",
  "maintenance-and-ongoing-support": "/services/infrastructure",
};

export const VPS_PLANS = [
  {
    name: "Starter",
    price: 999,
    cpu: "1 core",
    ram: "2 GB",
    storage: "30 GB",
    bandwidth: "1 TB",
    description:
      "A solid beginning for a website, small API or development environment.",
  },
  {
    name: "Business",
    price: 1799,
    cpu: "2 cores",
    ram: "4 GB",
    storage: "60 GB",
    bandwidth: "2 TB",
    description:
      "More room for production applications, Docker and growing workloads.",
  },
  {
    name: "Pro",
    price: 3299,
    cpu: "4 cores",
    ram: "8 GB",
    storage: "120 GB",
    bandwidth: "4 TB",
    description:
      "Capacity for busier applications, multiple services and larger databases.",
  },
] as const;

/**
 * GXMail's published plans. These values mirror the GXMail administration
 * frontend and its public plans endpoint, verified on 2026-11-05.
 */
export const GXMAIL_PLANS = [
  {
    code: "starter",
    name: "Starter",
    description: "For individuals and small businesses.",
    billing: {
      monthly: { price: 250, durationDays: 30 },
      yearly: { price: 3000, durationDays: 365 },
    },
    maxDomains: 1,
    maxMailboxes: 15,
    sharedStorageGb: 30,
    defaultMailboxStorageGb: 2,
    maxMailboxStorageGb: 2,
    maxSmtpCredentials: 5,
    gnotifyDiscountPercent: 0,
    support: "Email",
  },
  {
    code: "business",
    name: "Business",
    description: "For growing businesses and professional teams.",
    billing: {
      monthly: { price: 333, durationDays: 30 },
      yearly: { price: 3999, durationDays: 365 },
    },
    maxDomains: 3,
    maxMailboxes: 20,
    sharedStorageGb: 60,
    defaultMailboxStorageGb: 3,
    maxMailboxStorageGb: 3,
    maxSmtpCredentials: 15,
    gnotifyDiscountPercent: 10,
    support: "Email + WhatsApp",
  },
  {
    code: "business-pro",
    name: "Business Pro",
    description:
      "For organisations with larger email infrastructure requirements.",
    billing: {
      monthly: { price: 500, durationDays: 30 },
      yearly: { price: 5999, durationDays: 365 },
    },
    maxDomains: 5,
    maxMailboxes: null,
    sharedStorageGb: 200,
    defaultMailboxStorageGb: 5,
    maxMailboxStorageGb: null,
    maxSmtpCredentials: 20,
    gnotifyDiscountPercent: 20,
    support: "Priority email + WhatsApp",
  },
] as const;

/**
 * GXNotify's published monthly plans. These values mirror the GXNotify source
 * and its production marketing page, verified on 2026-11-05.
 */
export const GXNOTIFY_PLANS = [
  {
    code: "starter",
    name: "Starter",
    price: 500,
    audience: "For individual developers.",
    support: "Standard support",
    limits: {
      projects: 1,
      email: 200,
      push: 100,
      sms: 50,
      apiKeys: 10,
      templates: 5,
    },
  },
  {
    code: "business",
    name: "Business",
    price: 1999,
    audience: "For growing businesses.",
    support: "Dedicated email support",
    limits: {
      projects: 10,
      email: 100000,
      push: 10000,
      sms: 500,
      apiKeys: 20,
      templates: 50,
    },
  },
  {
    code: "business-pro",
    name: "Business Pro",
    price: 3999,
    audience: "For agencies and high-volume applications.",
    support: "Priority dedicated email support",
    limits: {
      projects: 50,
      email: 300000,
      push: 30000,
      sms: 1000,
      apiKeys: 30,
      templates: 200,
    },
  },
] as const;

export const DELIVERY_STEPS = [
  {
    title: "Understand the work.",
    description:
      "We discuss the problem, the people using the system and the constraints that matter.",
    detail: "Discovery & scope",
    illustration: "discovery",
  },
  {
    title: "Make the plan clear.",
    description:
      "Architecture, deliverables and milestones become a shared plan before the build begins.",
    detail: "Architecture & planning",
    illustration: "planning",
  },
  {
    title: "Build, test, refine.",
    description:
      "Working software, regular reviews and automated checks keep progress tangible.",
    detail: "Engineering & validation",
    illustration: "engineering",
  },
  {
    title: "Launch with support.",
    description:
      "A considered release, a practical handover and an agreed plan for what comes next.",
    detail: "Delivery & operations",
    illustration: "launch",
  },
] as const;

export const GENERAL_FAQS = [
  {
    question: "Can you work with our existing systems?",
    answer:
      "Yes. We can assess an existing application or infrastructure setup, identify what needs attention and scope a targeted upgrade or a broader modernization.",
  },
  {
    question: "Do we need a complete technical brief?",
    answer:
      "A clear problem is a good starting point. Discovery helps us turn your goals, current process and constraints into a practical scope and delivery plan.",
  },
  {
    question: "Can we hire you for a single service?",
    answer:
      "Yes. Engage us for a complete product, a specific integration, a cloud migration, an infrastructure review or ongoing engineering support.",
  },
  {
    question: "Who owns the code and deliverables?",
    answer:
      "Ownership, source-code handover and access are defined in your project agreement. We make those expectations clear before work begins.",
  },
  {
    question: "How are projects priced?",
    answer:
      "Pricing follows the scope. We discuss deliverables, complexity and your timeline, then propose an appropriate milestone, time-based or ongoing engagement.",
  },
  {
    question: "Do you support projects after launch?",
    answer:
      "We can include monitoring, maintenance and engineering support in the engagement. Coverage, response expectations and responsibilities are agreed for your project.",
  },
] as const;

export const CLOUD_FAQS = [
  {
    question: "Where are the VPS servers hosted?",
    answer:
      "The VPS offering is hosted in Pakistan, with local-currency billing and infrastructure intended for workloads serving local audiences.",
  },
  {
    question: "Can I run Docker or my own application?",
    answer:
      "The published VPS plans support workloads such as Docker applications, Node.js services, databases and control panels. Discuss any specific operating-system or resource requirements before provisioning.",
  },
  {
    question: "What if I need a different configuration?",
    answer:
      "Contact us about custom CPU, RAM, storage, bandwidth or dedicated-server requirements. We will scope a configuration for your workload.",
  },
  {
    question: "Is managed support available?",
    answer:
      "Managed setup, ongoing operations and backup requirements can be discussed with the infrastructure team. Your order defines the included coverage.",
  },
] as const;

export const MAIL_FAQS = [
  {
    question: "Can I use my own domain?",
    answer:
      "Yes. GXMail supports addresses on your business domain. Setup includes the domain and DNS records needed to route and authenticate your email.",
  },
  {
    question: "Can I use Gmail, Outlook or a phone mail app?",
    answer:
      "GXMail provides secure SMTP and IMAP access so you can connect a compatible mail application. You can also use webmail in your browser.",
  },
  {
    question: "How do mailbox storage limits work?",
    answer:
      "Storage is shared across the mailboxes in your workspace. Starter includes 30 GB with up to 2 GB per mailbox, Business includes 60 GB with up to 3 GB per mailbox, and Business Pro includes 200 GB with a 5 GB default allocation and flexible per-mailbox limits.",
  },
  {
    question: "What protects outgoing email?",
    answer:
      "SPF, DKIM and DMARC authenticate your domain and help protect it from spoofing. TLS protects supported connections in transit.",
  },
  {
    question: "Can an application send through GXMail?",
    answer:
      "Yes. You can generate SMTP credentials for applications and services. Starter includes up to 5 credentials, Business 15 and Business Pro 20.",
  },
  {
    question: "How do I manage my team’s mailboxes?",
    answer:
      "The GXMail administration portal provides domain and mailbox management, storage allocation, SMTP credentials, access controls and billing. Your selected plan defines the available limits.",
  },
] as const;

export const NOTIFY_FAQS = [
  {
    question: "Which notification channels does GXNotify support?",
    answer:
      "GXNotify supports transactional email, SMS and Firebase Cloud Messaging push notifications through one notification model. Channel availability depends on the providers configured for your project.",
  },
  {
    question: "Do I use my own delivery providers?",
    answer:
      "Yes. Connect your own SMTP infrastructure, SMS gateway and Firebase project. GXNotify coordinates delivery without locking your application to one provider.",
  },
  {
    question: "What happens when a delivery fails?",
    answer:
      "Transient failures use bounded retries. Permanent failures can move to a dead-letter queue, while the delivery timeline keeps the attempts and provider responses available for inspection.",
  },
  {
    question: "What do the monthly plan limits cover?",
    answer:
      "Each plan defines its number of projects, email notifications, FCM push notifications, SMS credits, API keys and reusable templates. The pricing cards show the published limit for every tier.",
  },
  {
    question: "Can I manage recipients and delivery events?",
    answer:
      "GXNotify includes subscribers, opt-out status, variable-powered templates, signed webhooks and delivery history so your team can manage and inspect notification activity from one dashboard.",
  },
] as const;

export const SOLUTION_TRACKS = [
  {
    title: "Launch something new.",
    description:
      "Turn a business idea into a working web, mobile or desktop product with the backend and infrastructure it needs.",
    services: ["software-engineering", "cloud-architecture"],
    deliverables: ["Product scope", "Custom application", "Production setup"],
  },
  {
    title: "Improve what you have.",
    description:
      "Modernize a legacy application, connect disconnected processes or bring clarity to an expanding cloud environment.",
    services: ["ai-automation", "devops-automation"],
    deliverables: [
      "System assessment",
      "Prioritized improvements",
      "Measured validation",
    ],
  },
  {
    title: "Extend your team.",
    description:
      "Bring in an engineering partner for a specialist workstream, agency collaboration or an ongoing technical engagement.",
    services: ["security-engineering", "infrastructure"],
    deliverables: [
      "Clear responsibilities",
      "Direct collaboration",
      "Documented handover",
    ],
  },
] as const;
