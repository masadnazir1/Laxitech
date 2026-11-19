import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { INSIGHTS } from '@/data/insights';
import { ENGINEERING_SERVICES } from '@/data/laxitechSite';
import { PageIntro, PageClose } from '@/components/site/Primitives';
import { siteMetadata } from '@/lib/siteMetadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getInsightArticleSchema } from '@/lib/schema';

export function generateStaticParams() { return INSIGHTS.map(({ slug }) => ({ slug })); }
const INSIGHT_SEO: Record<string, { title: string; description: string }> = {
  'choosing-a-vps': {
    title: 'How to Choose the Right VPS for Your Workload',
    description: 'A comprehensive engineering guide on sizing CPU, RAM, NVMe storage, and network bandwidth to select the ideal virtual server for your web applications.',
  },
  'planning-a-cloud-migration': {
    title: 'Step-by-Step Enterprise Cloud Migration Plan',
    description: 'Essential engineering roadmap for executing a smooth cloud migration: dependency mapping, database synchronization, risk mitigation, and rollback plans.',
  },
  'business-email-authentication': {
    title: 'Configuring SPF, DKIM & DMARC for Email Trust',
    description: 'Learn how to protect your domain reputation, prevent email spoofing, and guarantee inbox deliverability with correct SPF, DKIM, and DMARC configurations.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = INSIGHTS.find((item) => item.slug === slug);
  const seo = INSIGHT_SEO[slug];
  if (!article) return { title: 'Guide not found' };
  return siteMetadata(
    seo?.title || article.title,
    seo?.description || article.description,
    `/insights/${slug}`,
    { type: 'article' }
  );
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = INSIGHTS.find((item) => item.slug === slug);
  if (!article) notFound();

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Insights', item: '/insights' },
    { name: article.title, item: `/insights/${slug}` },
  ];

  const relatedService = ENGINEERING_SERVICES.find(
    (item) => item.slug === article.relatedService || item.kind === article.relatedService
  );

  return (
    <>
      <JsonLd data={getInsightArticleSchema(article)} />
      <PageIntro
        breadcrumbs={breadcrumbs}
        lines={article.headline}
        description={article.description}
      />
      <article className="site-container site-article-layout">
        <aside>
          <Link href="/insights">
            <ArrowLeft />All insights
          </Link>
          <span>{article.category}</span>
          <nav aria-label="Article contents">
            {article.sections.map((section, index) => (
              <a href={`#section-${index}`} key={section.title}>
                {section.title}
              </a>
            ))}
          </nav>
          {relatedService && (
            <div className="pt-6 border-t border-line-strong mt-6 text-sm">
              <span className="block text-xs uppercase tracking-wider text-fg-muted mb-2">Related discipline</span>
              <Link
                href={`/services/${relatedService.slug}`}
                className="group flex items-center justify-between text-fg font-medium hover:text-accent transition-colors"
              >
                <span>{relatedService.name}</span>
                <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </aside>
        <div className="site-article-body">
          {article.sections.map((section, index) => (
            <section id={`section-${index}`} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          {relatedService && (
            <section className="pt-8 border-t border-line-strong mt-12">
              <h2 className="text-xl font-medium">Explore related engineering capability</h2>
              <p className="mt-3 text-fg-muted">
                Learn more about how our team approaches {relatedService.name.toLowerCase()} in production environments:
              </p>
              <div className="mt-4">
                <Link
                  href={`/services/${relatedService.slug}`}
                  className="inline-flex items-center gap-2 text-fg font-medium underline underline-offset-4 hover:text-accent transition-colors"
                >
                  <span>{relatedService.name}</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </section>
          )}
        </div>
      </article>
      <PageClose service={article.relatedService} title="Put the thinking into practice." />
    </>
  );
}
