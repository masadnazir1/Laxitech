import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { EngineeringIllustration, type IllustrationKind } from '@/components/illustrations/EngineeringIllustration';
import { INSIGHTS } from '@/data/insights';
import { PageIntro, PageClose, Reveal } from '@/components/site/Primitives';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Engineering insights', 'Practical guidance on infrastructure, cloud migration and business email from the Laxitech engineering practice.', '/insights');

export default function InsightsPage() {
  const kinds: IllustrationKind[] = ['vps', 'cloud', 'mail'];
  return <><PageIntro lines={['Useful thinking.', 'Practical answers.']} description="A few things worth understanding before your next technical decision." /><section className="site-container site-insights-grid">{INSIGHTS.map((article, index) => <Reveal key={article.slug} delay={index * 0.07}><Link href={`/insights/${article.slug}`} className="site-insight-card"><div className="site-insight-art"><EngineeringIllustration kind={kinds[index]} compact caption={false} /><span>{article.category}</span></div><div className="site-insight-text"><h2>{article.title}</h2><p>{article.description}</p><span>Read the guide <ArrowUpRight /></span></div></Link></Reveal>)}</section><PageClose title="Have a question of your own?" /></>;
}
