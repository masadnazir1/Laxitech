import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HeroHeader } from '@/components/sections/hero/HeroHeader';
import { ImpactScrollStage } from '@/components/sections/proof/ImpactScrollStage';
import { LogoCloud } from '@/components/ui/logo-cloud-2';
import { ServicesShowcase } from '@/components/site/ServicesShowcase';
import { ProductShowcase } from '@/components/site/ProductPreviews';
import { DeliveryProcess } from '@/components/site/DeliveryProcess';
import { Faq } from '@/components/site/Faq';
import { Reveal, SectionHeading } from '@/components/site/Primitives';
import { EngineeringIllustration, type IllustrationKind } from '@/components/illustrations/EngineeringIllustration';
import { INSIGHTS } from '@/data/insights';
import { SITE, SITE_URL } from '@/data/laxitechSite';
import { JsonLd } from '@/components/seo/JsonLd';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/schema';

const HOME_TITLE = 'Laxitech | Software, cloud & engineering';
const HOME_DESCRIPTION =
  'Custom software, intelligent automation and dependable infrastructure. Laxitech is your engineering partner from idea to operation and beyond.';

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE.name,
    type: 'website',
    locale: 'en_US',
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function HomePage() {
  const kinds: IllustrationKind[] = ['vps', 'cloud', 'mail'];

  return (
    <div className="site-home">
      <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
      <HeroHeader direction="editorial" showTable={false} />
      <section className="site-technology site-container" data-atmosphere="beams" aria-label="Engineering technologies">
        <Reveal>
          <p>Good engineering starts with proven foundations.</p>
          <LogoCloud />
        </Reveal>
      </section>
      <ServicesShowcase />
      <div id="pricing">
        <ProductShowcase />
      </div>
      <ImpactScrollStage />
      <DeliveryProcess />
      <section className="site-section site-container" data-atmosphere="rays">
        <SectionHeading
          title={<>Engineering insights.<br />Practical guidance.</>}
          description="Guidance on infrastructure, cloud migration and business email from our practice."
          action="All insights"
          href="/insights"
        />
        <div className="site-insights-grid">
          {INSIGHTS.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.07}>
              <Link href={`/insights/${article.slug}`} className="site-insight-card">
                <div className="site-insight-art">
                  <EngineeringIllustration kind={kinds[index]} compact caption={false} />
                  <span>{article.category}</span>
                </div>
                <div className="site-insight-text">
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <span>Read guide <ArrowUpRight /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <Faq />
    </div>
  );
}
