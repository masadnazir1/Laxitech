import { permanentRedirect } from 'next/navigation';
import { INSIGHTS, INSIGHT_ALIASES } from '@/data/insights';
export function generateStaticParams() { return [...Object.keys(INSIGHT_ALIASES), ...INSIGHTS.map((item) => item.slug)].map((slug) => ({ slug })); }
export function generateMetadata() { return { title: 'Engineering insights' }; }
export default async function InsightAlias({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = INSIGHT_ALIASES[slug] || (INSIGHTS.some((item) => item.slug === slug) ? slug : '');
  permanentRedirect(destination ? `/insights/${destination}` : '/insights');
}
