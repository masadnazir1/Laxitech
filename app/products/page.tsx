import { PageIntro, PageClose } from '@/components/site/Primitives';
import { ProductShowcase } from '@/components/site/ProductPreviews';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Our products', 'Explore Pakistan-hosted NVMe cloud infrastructure, GXMail business email and the GXNotify multi-channel notification API.', '/products');

export default function ProductsPage() {
  return <><PageIntro lines={['Made by us.', 'Built for you.']} description="Infrastructure, business email and notification tools for the systems your team uses every day, with the engineering team behind them." /><ProductShowcase /><PageClose title="Need something more specific?" description="We can help with a custom infrastructure configuration or an engineering engagement around your business." /></>;
}
