export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  industry: string;
  created: string;
  pages: string;
  platform: string;
  liveUrl?: string;
  heroImage: string;
  secondaryImage: string;
  galleryImages: string[];
  overview: string;
  brief: string;
  approach: string;
  outcome: string;
  aboutParagraphs: string[];
  pagesList: string[];
  featuresList: string[];
  challenge: string;
  solution: string;
  deliverables: string[];
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'vixion-studio': {
    slug: 'vixion-studio',
    title: 'Vixion Studio',
    category: 'Creative Studio',
    industry: 'Creative',
    created: '2025',
    pages: '10',
    platform: 'Custom Web',
    liveUrl: 'https://www.vixion.studio/',
    heroImage: '/snapshots/vixion.png',
    secondaryImage: '/snapshots/vixion-2.png',
    galleryImages: [
      '/snapshots/vixion-1.png',
      '/snapshots/vixion-2.png',
      '/snapshots/vixion-3.png',
      '/snapshots/vixion-4.png',
    ],
    overview:
      'Vixion Studio is a cinematic visual production website built from a single reference with no written brief—featuring a smooth dark-to-light scroll transition, interactive package comparison, custom @vixionstudio.com business email, and a 24/7 AI sales concierge.',
    brief:
      'A Dubai and Pakistan visual production house needed a flagship website that felt like a film premiere—starting from zero written brief—while guiding real estate developers and commercial brands to the right production package.',
    approach:
      'We designed the complete visual identity in Figma, engineered a smooth dark-to-light scroll color transition, built an interactive package comparison matrix, set up info@vixionstudio.com business email, and trained a 24/7 AI sales assistant.',
    outcome:
      'The studio launched with sub-second mobile performance, automated 24/7 package recommendations via AI chat, and direct WhatsApp lead handoff for commercial and real estate film shoots.',
    aboutParagraphs: [
      'Vixion Studio is a modern media production website built to showcase commercial films, real estate cinematography, and production packages in a bold digital environment. The project was designed from zero brief with a strong focus on visual impact, structured storytelling, and instant buyer clarity.',
      'The website includes essential sections such as Home, Portfolio, Services, Pricing, Our Studio, Blog, and Contact—each organized to guide brand directors and real estate developers through showreels, deliverables, and transparent package comparisons.',
      'The visual direction uses a signature dark-to-light scroll transition, high-contrast typography, and large full-bleed video frames to create an immersive cinema-grade experience across desktop and mobile.',
      'Paired with a custom 24/7 AI sales concierge and official @vixionstudio.com business email routing, the platform turns visitors into qualified WhatsApp production enquiries around the clock.',
    ],
    pagesList: ['Home', 'Portfolio', 'Services', 'Pricing', 'Our Studio', 'Contact'],
    featuresList: ['24/7 AI Sales Chat', 'Animation', 'Business Email', 'SEO'],
    challenge:
      'Delivering a cinematic, motion-rich Dubai production studio website starting from zero written brief while keeping mobile scrolling effortless and guiding visitors to the right production package.',
    solution:
      'Designed the complete visual identity in Figma, engineered a smooth dark-to-light scroll color transition, built an interactive package comparison matrix, set up info@vixionstudio.com business email, and trained a 24/7 AI sales assistant with direct WhatsApp handoff.',
    deliverables: [
      'Zero-Brief Brand Direction & UI/UX',
      'Smooth Dark-to-Light Scroll Motion',
      '24/7 AI Client Sales Assistant',
      'Custom @vixionstudio.com Email & WhatsApp Funnel',
    ],
  },
  'movix-studio': {
    slug: 'movix-studio',
    title: 'Movix Studio',
    category: 'Media Production',
    industry: 'Media',
    created: '2025',
    pages: '8',
    platform: 'Custom Web',
    liveUrl: 'https://www.movixstudio.com/',
    heroImage: '/snapshots/movixstudio.png',
    secondaryImage: '/snapshots/movixstudio-2.png',
    galleryImages: [
      '/snapshots/movixstudio-1.png',
      '/snapshots/movixstudio-2.png',
      '/snapshots/movixstudio-3.png',
      '/snapshots/movixstudio-4.png',
    ],
    overview:
      'Movix Studio is an international video editing and post-production agency platform featuring instant HD showreel streaming via cloud CDN, custom domain routing, and verified Google Search indexing within 20 minutes of launch.',
    brief:
      'A high-retention video editing house needed to showcase full-screen HD showreels and before/after client edits without slow loading or video buffering, while ranking on Google Search immediately upon launch.',
    approach:
      'We engineered a dedicated cloud CDN video streaming pipeline paired with an editorial cream-and-gold visual identity, pre-rendered SEO metadata, and instant order routing.',
    outcome:
      'Showreels play instantaneously on mobile and desktop with zero buffering, and the custom domain was indexed and live on Google Search within 20 minutes of deployment.',
    aboutParagraphs: [
      'Movix Studio is a boutique video editing and post-production agency website designed to present high-retention commercial edits, documentary storytelling, and creator reels with zero playback friction.',
      'The platform features dedicated sections for the main Showreel, Retention Metrics, Editing Packages, Client Testimonials, and Direct Order onboarding—structured so agencies and creators can evaluate craft within seconds.',
      'To prevent heavy video files from slowing down mobile visitors, all showreels stream through a global cloud CDN with adaptive preloading and hardware-accelerated playback.',
      'Built with technical SEO and clean schema markup from day one, Movix Studio achieved verified Google Search indexing within 20 minutes of going live.',
    ],
    pagesList: ['Home', 'Showreel', 'About', 'Packages', 'Contact'],
    featuresList: ['Cloud Video CDN', 'Animation', 'Google SEO', 'Custom Domain'],
    challenge:
      'Streaming full-screen HD showreels and client production films without slow loading or buffering, while getting the new domain ranked on Google Search immediately at launch.',
    solution:
      'Built a high-speed cloud video streaming pipeline that plays HD showreels instantly without slowing down mobile devices, paired with custom domain routing and Google Search Console setup that indexed on Google within 20 minutes.',
    deliverables: [
      'Custom Video Agency Website',
      'Instant HD Video Streaming (Cloud CDN)',
      'Google SEO & 20-Minute Search Indexing',
      'Custom Domain & Global Cloud Hosting',
    ],
  },
  'commerce-lions': {
    slug: 'commerce-lions',
    title: 'Commerce Lions',
    category: 'E-Commerce',
    industry: 'Education',
    created: '2025',
    pages: '12',
    platform: 'Custom Portal',
    liveUrl: 'https://www.commercelions.com/',
    heroImage: '/snapshots/commercelions.png',
    secondaryImage: '/snapshots/commercelions-2.png',
    galleryImages: [
      '/snapshots/commercelions-1.png',
      '/snapshots/commercelions-2.png',
      '/snapshots/commercelions-3.png',
      '/snapshots/commercelions-4.png',
    ],
    overview:
      'Commerce Lions is an e-commerce education and mentorship portal featuring 1-click Google Sign-In, a protected student and member database, Google-ready SEO pages, and automated WhatsApp cohort onboarding.',
    brief:
      'An e-commerce mentorship academy needed a secure student portal and high-converting public website that protected private course modules while making cohort enrollment effortless.',
    approach:
      'We combined a bold dark-and-gold conversion front-end with 1-click Google Sign-In authentication, strict cloud database security rules, and direct WhatsApp student onboarding.',
    outcome:
      'Students sign in with a single tap via Google, private mentorship resources remain 100% locked against unauthorized access, and public landing pages rank cleanly on Google Search.',
    aboutParagraphs: [
      'Commerce Lions is a specialized e-commerce education platform and student portal built to onboard aspiring founders, present verified student case studies, and host protected mentorship curricula.',
      'The website bridges public conversion pages—including Curriculum, Student Results, Mentorship Tracks, and FAQs—with a gated member portal secured by 1-click Google Sign-In.',
      'Behind the scenes, role-based database rules protect student profiles and cohort materials while keeping public pages pre-rendered for instant loading and Google Search visibility.',
      'Direct WhatsApp cohort routing allows prospective students to verify enrollment details and join upcoming mentorship batches without friction.',
    ],
    pagesList: ['Home', 'Curriculum', 'Student Results', 'Member Portal', 'FAQ', 'Contact'],
    featuresList: ['Google Sign-In', 'Protected Database', 'CMS', 'WhatsApp Funnel'],
    challenge:
      'Protecting private student mentorship modules and member accounts from unauthorized access while ensuring all public pages rank cleanly on Google Search.',
    solution:
      'Built a secure member portal with 1-click Google Sign-In, strict database protection rules, pre-rendered Google SEO pages across all public routes, and instant WhatsApp student onboarding.',
    deliverables: [
      'Protected Student & Admin Portal',
      '1-Click Google Sign-In & Database Security',
      'Automated WhatsApp Student Onboarding',
      'Google-Ready SEO Page Structure',
    ],
  },
  'superluxuries-store': {
    slug: 'superluxuries-store',
    title: 'SuperLuxuries',
    category: 'Luxury Retail',
    industry: 'Luxury Retail',
    created: '2025',
    pages: '14',
    platform: 'Custom Store',
    liveUrl: 'https://www.superluxuries.store/',
    heroImage: '/snapshots/superluxuries.png',
    secondaryImage: '/snapshots/superluxuries-2.png',
    galleryImages: [
      '/snapshots/superluxuries-1.png',
      '/snapshots/superluxuries-2.png',
      '/snapshots/superluxuries-3.png',
      '/snapshots/superluxuries-4.png',
    ],
    overview:
      'SuperLuxuries is a bespoke luxury digital boutique featuring an easy-to-use Admin Dashboard, role-based staff accounts, high-speed cloud image & video hosting, and a Gemini AI personal shopper.',
    brief:
      'A luxury timepiece and leather goods retailer needed to replace a slow template store with an editorial digital showroom capable of handling VIP concierge checkout and rapid inventory updates.',
    approach:
      'We built a custom luxury storefront paired with a role-locked Admin Dashboard, cloud CDN media delivery, an itemized WhatsApp VIP checkout bag, and an AI personal shopping concierge.',
    outcome:
      'Staff can upload high-resolution product galleries in seconds, VIP buyers complete itemized concierge orders via WhatsApp, and pages load in under a second worldwide.',
    aboutParagraphs: [
      'SuperLuxuries is a digital luxury showroom crafted for collectors of fine timepieces, heritage leather goods, and bespoke accessories. Every collection page is designed with editorial restraint so product photography takes center stage.',
      'The storefront includes curated category filters, detailed product specification sheets, a multi-item slide-out shopping bag, and 1-click itemized WhatsApp VIP concierge checkout.',
      'Store managers run daily operations through a custom Admin Dashboard with separate founder and staff permissions, enabling instant inventory updates and cloud CDN media uploads without touching code.',
      'An integrated Gemini AI personal shopper assists visitors around the clock—answering sizing, craftsmanship, and availability questions before routing VIP orders directly to the concierge team.',
    ],
    pagesList: ['Home', 'Collections', 'Timepieces', 'Leather Goods', 'Admin Panel', 'Concierge'],
    featuresList: ['Admin Dashboard', 'Gemini AI Shopper', 'Cloud Media CDN', 'WhatsApp Checkout'],
    challenge:
      'Replacing slow, generic store templates with an editorial luxury showroom capable of private VIP inquiries, high-resolution product galleries, and effortless catalog updates.',
    solution:
      'Created a custom Admin Dashboard with separate founder and staff permissions, fast cloud image & video hosting, a Gemini AI personal shopping assistant, and itemized WhatsApp VIP checkout.',
    deliverables: [
      'Easy Admin Dashboard & Product Catalog',
      'Fast Cloud Image & Video Hosting (CDN)',
      'Gemini AI Personal Shopper Assistant',
      'Direct WhatsApp VIP Concierge Checkout',
    ],
  },
  'mac-vision': {
    slug: 'mac-vision',
    title: 'MacVision Store',
    category: 'E-Commerce',
    industry: 'Hardware Retail',
    created: '2025',
    pages: '11',
    platform: 'Custom Store',
    liveUrl: 'https://www.macvision.store/',
    heroImage: '/snapshots/macvision.png',
    secondaryImage: '/snapshots/macvision-2.png',
    galleryImages: [
      '/snapshots/macvision-1.png',
      '/snapshots/macvision-2.png',
      '/snapshots/macvision-3.png',
      '/snapshots/macvision-4.png',
    ],
    overview:
      'MacVision Store is a flagship Apple and premium hardware retail store featuring a founder-locked Admin Dashboard, 1-click bulk percentage price adjustment, background product uploads, and itemized WhatsApp ordering.',
    brief:
      'An Apple hardware retailer needed a fast storefront where the founder could adjust prices across hundreds of MacBooks and iPhones in 1 click whenever currency exchange rates moved.',
    approach:
      'We engineered a custom Apple-grade dark retail storefront with a protected founder Admin Dashboard featuring a 1-click bulk percentage markup/markdown engine and background cloud uploads.',
    outcome:
      'Store-wide pricing updates now take 3 seconds instead of hours of manual editing, and buyers can filter MacBook specs and send itemized WhatsApp orders seamlessly.',
    aboutParagraphs: [
      'MacVision Store is a dedicated Apple hardware e-commerce platform built for buyers comparing new and certified pre-owned MacBooks, iMacs, iPads, and accessories.',
      'Shoppers can filter inventory by chip generation, RAM, storage, and condition, inspect real device galleries, and generate an itemized order summary directly into WhatsApp or checkout.',
      'To solve daily currency fluctuations, the protected founder Admin Dashboard includes a 1-click bulk percentage price adjustment tool that updates every product across the catalog instantaneously.',
      'Background cloud image uploads and sub-second page transitions make managing and shopping the catalog effortless on both mobile and desktop.',
    ],
    pagesList: ['Home', 'MacBooks', 'iPhones & iPads', 'Compare Specs', 'Admin Dashboard', 'Contact'],
    featuresList: ['1-Click Bulk Pricing', 'Founder Admin Lock', 'Cloud Image CDN', 'WhatsApp Order Bag'],
    challenge:
      'Daily currency exchange rate swings required instant store-wide price updates across hundreds of Apple devices without editing every product one by one.',
    solution:
      'Built a 1-click bulk percentage price markup/markdown tool inside a protected founder Admin Dashboard, paired with background cloud image uploads and itemized WhatsApp order generation.',
    deliverables: [
      'Protected Founder Admin Dashboard',
      '1-Click Bulk Percentage Price Update Tool',
      'Background Product Image Uploader',
      'Itemized WhatsApp Order Checkout',
    ],
  },
};

export function getCaseStudy(slug: string): CaseStudy {
  const study = CASE_STUDIES[slug];
  if (study) return study;

  return CASE_STUDIES['vixion-studio'];
}
