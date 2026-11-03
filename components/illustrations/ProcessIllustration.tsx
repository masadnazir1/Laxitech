'use client';

import Image from 'next/image';
import { useTheme } from '@/components/theme/ThemeProvider';

export function ProcessIllustration({ kind }: { kind: 'discovery' | 'planning' | 'engineering' | 'launch' }) {
  const { resolvedTheme } = useTheme();
  return <Image className="site-process-illustration" src={`/illustrations/process/${kind}-${resolvedTheme}.webp`} alt="" width={160} height={160} sizes="(max-width: 600px) 96px, (max-width: 1100px) 124px, 144px" loading="lazy" draggable={false} data-source="3dicons-v1" />;
}
