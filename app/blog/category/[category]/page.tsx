import { permanentRedirect } from 'next/navigation';
export function generateStaticParams() { return ['cloud-architecture', 'infrastructure-vps', 'security-devops'].map((category) => ({ category })); }
export function generateMetadata() { return { title: 'Engineering insights' }; }
export default function InsightCategoryAlias() { permanentRedirect('/insights'); }
