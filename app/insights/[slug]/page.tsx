import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { INSIGHTS } from '@/data/insights';
import { PageIntro, PageClose } from '@/components/site/Primitives';
import { siteMetadata } from '@/lib/siteMetadata';

export function generateStaticParams() { return INSIGHTS.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = INSIGHTS.find((item) => item.slug === slug);
  return article ? siteMetadata(article.title, article.description, `/insights/${slug}`) : { title: 'Guide not found' };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = INSIGHTS.find((item) => item.slug === slug);
  if (!article) notFound();
  return <><PageIntro lines={article.headline} description={article.description} /><article className="site-container site-article-layout"><aside><Link href="/insights"><ArrowLeft />All insights</Link><span>{article.category}</span><nav aria-label="Article contents">{article.sections.map((section, index) => <a href={`#section-${index}`} key={section.title}>{section.title}</a>)}</nav></aside><div className="site-article-body">{article.sections.map((section, index) => <section id={`section-${index}`} key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div></article><PageClose service={article.relatedService} title="Put the thinking into practice." /></>;
}
