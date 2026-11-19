import { HeroHeader } from '@/components/sections/hero/HeroHeader';
import { ImpactScrollStage } from '@/components/sections/proof/ImpactScrollStage';
import { LogoCloud } from '@/components/ui/logo-cloud-2';
import { ServicesShowcase } from '@/components/site/ServicesShowcase';
import { ProductShowcase } from '@/components/site/ProductPreviews';
import { DeliveryProcess } from '@/components/site/DeliveryProcess';
import { Faq } from '@/components/site/Faq';
import { Reveal } from '@/components/site/Primitives';
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
      <Faq />
    </div>
  );
}
