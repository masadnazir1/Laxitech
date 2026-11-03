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
    default: 'Laxitech | Enterprise Custom Software & Cloud Infrastructure',
    template: '%s | Laxitech',
  },
  description:
    'Build a scalable digital future with Laxitech. Modern cloud architecture, enterprise custom software engineering, high-performance Pakistan-hosted VPS, and rock-solid IT infrastructure.',
  keywords: [
    'Laxitech',
    'Pakistan Hosted VPS',
    'Enterprise Custom Software',
    'Multi-Cloud Architecture',
    'Zero-Trust IT Infrastructure',
    'DevOps CI/CD Automation',
    'GXMail Business Email',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: 'Laxitech',
    title: 'Laxitech | Enterprise Custom Software & Cloud Infrastructure',
    description:
      'Engineering high-performance custom software, resilient multi-cloud architecture, and rock-solid IT infrastructure built for high-throughput enterprise demands.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Laxitech — Enterprise Custom Software & Cloud Infrastructure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laxitech | Enterprise Custom Software & Cloud Infrastructure',
    description:
      'Engineering high-performance custom software, resilient multi-cloud architecture, and Pakistan-hosted VPS.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/brand/laxitech-icon.png',
    apple: '/brand/laxitech-icon.png',
  },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: SITE.name, url: SITE.url, email: SITE.email, logo: `${SITE.url}/brand/laxitech-icon.png` }) }} />
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
