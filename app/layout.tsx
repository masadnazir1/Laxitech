import type { Metadata } from 'next';
import './globals.css';
import 'lenis/dist/lenis.css';
import './hero.css';
import './site.css';
import './illustrations.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoutePreloader } from '@/components/layout/RoutePreloader';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { LiveAtmosphereField } from '@/components/motion/LiveAtmosphereField';
import { SITE } from '@/data/laxitechSite';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Laxitech | Software, cloud & engineering',
    template: '%s | Laxitech',
  },
  description:
    'Custom software, intelligent automation and dependable infrastructure. Laxitech is your engineering partner from idea to operation.',
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: 'Laxitech',
    title: 'Laxitech | Software, cloud & engineering',
    description:
      'Custom software, intelligent automation and dependable infrastructure. Laxitech is your engineering partner from idea to operation.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Laxitech — Software, cloud & engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laxitech | Software, cloud & engineering',
    description:
      'Custom software, intelligent automation and dependable infrastructure. Laxitech is your engineering partner from idea to operation.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" data-currency="usd" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vv-theme')||'dark';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):(t==='light'?'light':'dark');document.documentElement.setAttribute('data-theme',r);document.documentElement.style.colorScheme=r;var c=localStorage.getItem('vv-currency');if(c==='pkr'||c==='usd'){document.documentElement.setAttribute('data-currency',c);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-bg text-fg font-sans antialiased">
        <a className="site-skip-link" href="#vv-main">Skip to content</a>
        <ThemeProvider>
          <MotionProvider>
          <LiveAtmosphereField />
          <RoutePreloader />
          <Navbar />
          <main id="vv-main" tabIndex={-1} className="relative z-[1] isolate outline-none">
            {children}
          </main>
          <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
