import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { INSIGHTS } from '@/data/insights';
import { PageIntro, PageClose } from '@/components/site/Primitives';
import { siteMetadata } from '@/lib/siteMetadata';

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
  return <><PageIntro lines={article.headline} description={article.description} /><article className="site-container site-article-layout"><aside><Link href="/insights"><ArrowLeft />All insights</Link><span>{article.category}</span><nav aria-label="Article contents">{article.sections.map((section, index) => <a href={`#section-${index}`} key={section.title}>{section.title}</a>)}</nav></aside><div className="site-article-body">{article.sections.map((section, index) => <section id={`section-${index}`} key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div></article><PageClose service={article.relatedService} title="Put the thinking into practice." /></>;
}
