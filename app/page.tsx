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
import { siteMetadata } from '@/lib/siteMetadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/schema';

export const metadata = siteMetadata(
  'Laxitech | Software, cloud & engineering',
  'Custom software, intelligent automation and dependable infrastructure. Laxitech is your engineering partner from idea to operation and beyond.',
  '/',
  { absoluteTitle: true }
);

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
