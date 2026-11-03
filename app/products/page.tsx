import { PageIntro, PageClose } from '@/components/site/Primitives';
import { ProductShowcase } from '@/components/site/ProductPreviews';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Our products', 'Explore Pakistan-hosted NVMe cloud infrastructure and GXMail professional business email, built and supported by Laxitech.', '/products');

export default function ProductsPage() {
  return <><PageIntro lines={['Made by us.', 'Built for you.']} description="The infrastructure and communication tools your business uses every day, with the engineering team behind them." /><ProductShowcase /><PageClose title="Need something more specific?" description="We can help with a custom infrastructure configuration or an engineering engagement around your business." /></>;
}
