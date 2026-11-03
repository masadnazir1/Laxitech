export type HeroDirection = 'editorial' | 'cinematic';
export type HeroService = 'software' | 'automation' | 'cloud';

export const HERO_COPY = {
  lines: ['Your business.', 'Better engineered.'],
  description: 'Custom software, intelligent automation and cloud infrastructure. Built around your business, from the first conversation to the next chapter.',
  primaryLabel: 'Get a quote',
  primaryHref: '/contact',
  secondaryLabel: 'Explore services',
  secondaryHref: '/services',
} as const;

export const HERO_SERVICES: readonly {
  id: HeroService;
  label: string;
  caption: string;
  href: string;
}[] = [
  {
    id: 'software',
    label: 'Custom software',
    caption: 'An interface built around the way you work.',
    href: '/services/software-engineering',
  },
  {
    id: 'automation',
    label: 'Intelligent automation',
    caption: 'Turn the work between your tools into a workflow.',
    href: '/services/ai-automation',
  },
  {
    id: 'cloud',
    label: 'Cloud infrastructure',
    caption: 'A clear path from your application to production.',
    href: '/services/cloud-architecture',
  },
];

export const DEMO_REQUESTS = [
  { title: 'Client workspace', detail: 'A place for your team and your customers', state: 'In review' },
  { title: 'Approval workflow', detail: 'The right people, at the right moment', state: 'Connected' },
  { title: 'Cloud deployment', detail: 'From development to everyday operation', state: 'Ready' },
] as const;

export const DEMO_WORKFLOW = ['Receive request', 'Review details', 'Notify your team'] as const;
export const DEMO_DEPLOYMENT = ['Build application', 'Run checks', 'Release to production'] as const;
