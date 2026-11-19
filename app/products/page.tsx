import { PageIntro, PageClose } from '@/components/site/Primitives';
import { ProductShowcase } from '@/components/site/ProductPreviews';
import { siteMetadata } from '@/lib/siteMetadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProductsCollectionSchema } from '@/lib/schema';

export const metadata = siteMetadata(
  'Cloud Products, Business Email & Messaging API',
  'Explore proprietary Laxitech products: low-latency Pakistan-hosted NVMe VPS hosting, GXMail business email suites, and the GXNotify multi-channel API.',
  '/products'
);

export default function ProductsPage() {
  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Products', item: '/products' },
  ];

  return (
    <>
      <JsonLd data={getProductsCollectionSchema()} />
      <PageIntro
        breadcrumbs={breadcrumbs}
        lines={['Made by us.', 'Built for you.']}
        description="Infrastructure, business email and notification tools for the systems your team uses every day, with the engineering team behind them."
      />
      <ProductShowcase />
      <PageClose
        title="Need something more specific?"
        description="We can help with a custom infrastructure configuration or an engineering engagement around your business."
      />
    </>
  );
}
