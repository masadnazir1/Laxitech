import type { Metadata } from 'next';
import { HeroPreview } from '@/components/sections/hero/HeroPreview';

export const metadata: Metadata = {
  title: 'Hero Design Study',
  robots: { index: false, follow: false },
};

export default function DesignPreviewPage() {
  return <HeroPreview />;
}
