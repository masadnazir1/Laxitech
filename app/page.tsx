import { HeroHeader } from '@/components/sections/hero/HeroHeader';
import { ImpactScrollStage } from '@/components/sections/proof/ImpactScrollStage';
import { LogoCloud } from '@/components/ui/logo-cloud-2';
import { ServicesShowcase } from '@/components/site/ServicesShowcase';
import { ProductShowcase } from '@/components/site/ProductPreviews';
import { DeliveryProcess } from '@/components/site/DeliveryProcess';
import { Faq } from '@/components/site/Faq';
import { Reveal } from '@/components/site/Primitives';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Laxitech | Software, cloud & engineering', 'Custom software, intelligent automation and dependable infrastructure. Laxitech is your engineering partner from idea to operation.', '/');

export default function HomePage() {
  return <div className="site-home"><HeroHeader direction="editorial" showTable={false} /><section className="site-technology site-container" data-atmosphere="beams" aria-label="Engineering technologies"><Reveal><p>Good engineering starts with proven foundations.</p><LogoCloud /></Reveal></section><ServicesShowcase /><div id="pricing"><ProductShowcase /></div><ImpactScrollStage /><DeliveryProcess /><Faq /></div>;
}
