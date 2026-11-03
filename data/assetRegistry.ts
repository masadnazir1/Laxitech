/**
 * Centralized Real Client Snapshot & Asset Registry
 * -------------------------------------------------
 * Uses real 1440x1080 high-resolution captures of CYNEX Studio's live deployed client platforms
 * stored locally in `/public/snapshots/`.
 */

export const STUDIO_TEAM_AVATARS = [
  {
    src: '/team/avatar-1.0c4e3fc0.jpg',
    alt: 'CH Manan — CYNEX Founder & Lead Architect',
  },
  {
    src: '/team/avatar-2.58306c73.jpg',
    alt: 'CYNEX Systems & AI Engineering',
  },
];

export const CLOUDINARY_AVATARS = {
  founderPortrait: '/team/avatar-1.0c4e3fc0.jpg',
  editorUser1: '/team/avatar-1.0c4e3fc0.jpg',
  editorUser2: '/team/avatar-2.58306c73.jpg',
  client1: '/team/avatar-1.0c4e3fc0.jpg',
  client3: '/team/avatar-2.58306c73.jpg',
};

export const CLOUDINARY_PROJECTS = {
  vixionStudio: '/snapshots/vixion.png',
  movixStudio: '/snapshots/movixstudio-2.png',
  commerceLions: '/snapshots/commercelions.png',
  superLuxuries: '/snapshots/superluxuries.png',
  macVision: '/snapshots/macvision.png',
  novaMind: '/media/1f86edb223f61286936b085b42edc107.jpg',
  nullShield: '/media/43a45f30543208de53ade25795bdc673.jpg',
  flameHouse: '/media/ae4d73e3a7d806960f421c98e525ac2a.jpg',
  ironCore: '/media/f23aef1579afdfca8471ccc112558b8c.jpg',
};

export const PROJECT_SNAPSHOT_SEQUENCES: Record<string, string[]> = {
  'vixion-studio': [
    '/snapshots/vixion.png',
    '/snapshots/vixion-1.png',
    '/snapshots/vixion-2.png',
    '/snapshots/vixion-3.png',
    '/snapshots/vixion-4.png',
  ],
  'movix-studio': [
    '/snapshots/movixstudio-2.png',
    '/snapshots/movixstudio-1.png',
    '/snapshots/movixstudio-3.png',
    '/snapshots/movixstudio-4.png',
    '/snapshots/movixstudio.png',
  ],
  'commerce-lions': [
    '/snapshots/commercelions.png',
    '/snapshots/commercelions-1.png',
    '/snapshots/commercelions-2.png',
    '/snapshots/commercelions-3.png',
    '/snapshots/commercelions-4.png',
  ],
  'superluxuries-store': [
    '/snapshots/superluxuries.png',
    '/snapshots/superluxuries-1.png',
    '/snapshots/superluxuries-2.png',
    '/snapshots/superluxuries-3.png',
    '/snapshots/superluxuries-4.png',
  ],
  'mac-vision': [
    '/snapshots/macvision.png',
    '/snapshots/macvision-1.png',
    '/snapshots/macvision-2.png',
    '/snapshots/macvision-3.png',
    '/snapshots/macvision-4.png',
  ],
};

export function getProjectSnapshotSequence(
  slug: string,
  fallbackImage?: string
): string[] {
  if (PROJECT_SNAPSHOT_SEQUENCES[slug]) {
    return PROJECT_SNAPSHOT_SEQUENCES[slug];
  }
  return fallbackImage ? [fallbackImage] : ['/snapshots/vixion.png'];
}

export const TESTIMONIAL_AVATAR_URLS: Record<string, string> = {
  '01': '/team/avatar-1.0c4e3fc0.jpg',
  '03': '/team/avatar-2.58306c73.jpg',
};

export const EDITOR_PROJECT_PLACEHOLDERS = [
  {
    title: 'SuperLuxuries',
    slug: 'superluxuries-store',
    desktop: '/snapshots/superluxuries.png',
    mobile: '/snapshots/superluxuries.png',
    themes: ['dark', 'light'] as ('dark' | 'light')[],
  },
  {
    title: 'MacVision Store',
    slug: 'mac-vision',
    desktop: '/snapshots/macvision.png',
    mobile: '/snapshots/macvision.png',
    themes: ['dark', 'light'] as ('dark' | 'light')[],
  },
  {
    title: 'Vixion Studio',
    slug: 'vixion-studio',
    desktop: '/snapshots/vixion.png',
    mobile: '/snapshots/vixion.png',
    themes: ['dark', 'light'] as ('dark' | 'light')[],
  },
  {
    title: 'Commerce Lions',
    slug: 'commerce-lions',
    desktop: '/snapshots/commercelions.png',
    mobile: '/snapshots/commercelions.png',
    themes: ['dark', 'light'] as ('dark' | 'light')[],
  },
  {
    title: 'Movix Studio',
    slug: 'movix-studio',
    desktop: '/snapshots/movixstudio-2.png',
    mobile: '/snapshots/movixstudio-2.png',
    themes: ['dark', 'light'] as ('dark' | 'light')[],
  },
];

export const MEDIA_PLACEHOLDER_MAP: Record<string, string> = {
  '/media/43a45f30543208de53ade25795bdc673.tex.webp': '/snapshots/vixion.png',
  '/media/43a45f30543208de53ade25795bdc673.jpg': '/snapshots/vixion.png',
  '/media/ae4d73e3a7d806960f421c98e525ac2a.tex.webp':
    '/snapshots/movixstudio-2.png',
  '/media/ae4d73e3a7d806960f421c98e525ac2a.jpg':
    '/snapshots/movixstudio-2.png',
  '/media/f23aef1579afdfca8471ccc112558b8c.tex.webp':
    '/snapshots/commercelions.png',
  '/media/f23aef1579afdfca8471ccc112558b8c.jpg':
    '/snapshots/commercelions.png',
  '/media/8c1a7114fc1bfec6490aeb80e841b066.tex.webp':
    '/snapshots/superluxuries.png',
  '/media/8c1a7114fc1bfec6490aeb80e841b066.jpg':
    '/snapshots/superluxuries.png',
  '/media/f51bbfe772c3d754c3738d4af8efca44.tex.webp':
    '/snapshots/macvision.png',
  '/media/f51bbfe772c3d754c3738d4af8efca44.jpg': '/snapshots/macvision.png',
  '/media/1f86edb223f61286936b085b42edc107.tex.webp':
    '/media/1f86edb223f61286936b085b42edc107.jpg',
  '/media/1f86edb223f61286936b085b42edc107.jpg':
    '/media/1f86edb223f61286936b085b42edc107.jpg',
  '/media/54f06e115564feee03cc900ead225dd7.tex.webp':
    '/media/54f06e115564feee03cc900ead225dd7.jpg',
  '/media/54f06e115564feee03cc900ead225dd7.jpg':
    '/media/54f06e115564feee03cc900ead225dd7.jpg',
  '/media/eace44ddc70352a3c3d0d1ea71b9fcb9.jpg':
    '/media/eace44ddc70352a3c3d0d1ea71b9fcb9.jpg',
  '/media/fa6a9d8c4c3126f5ceb10e26d0d16805.jpg':
    '/media/fa6a9d8c4c3126f5ceb10e26d0d16805.jpg',
};

export function resolveStockPlaceholder(
  src: string | undefined
): string {
  if (!src) {
    return '/snapshots/vixion.png';
  }
  if (MEDIA_PLACEHOLDER_MAP[src]) {
    return MEDIA_PLACEHOLDER_MAP[src];
  }
  if (src.startsWith('/snapshots/') || src.startsWith('/')) {
    return src;
  }
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  return '/snapshots/vixion.png';
}
