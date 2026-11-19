import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Laxitech',
    short_name: 'Laxitech',
    description: 'Custom software, intelligent automation and dependable infrastructure.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0d11',
    theme_color: '#0b0d11',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
