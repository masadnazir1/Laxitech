import { permanentRedirect } from 'next/navigation';
export const metadata = { title: 'Engineering insights' };
export default function InsightsAlias() { permanentRedirect('/insights'); }
