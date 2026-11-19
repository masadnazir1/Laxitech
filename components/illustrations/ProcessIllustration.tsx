'use client';

import Image from 'next/image';
import { useTheme } from '@/components/theme/ThemeProvider';

const PROCESS_ALT_TEXT: Record<string, string> = {
  discovery: 'Discovery and requirements gathering illustration',
  planning: 'Technical architecture and project roadmap illustration',
  engineering: 'Software engineering and infrastructure build illustration',
  launch: 'Testing, deployment, and operational handover illustration',
};

export function ProcessIllustration({ kind }: { kind: 'discovery' | 'planning' | 'engineering' | 'launch' }) {
  const { resolvedTheme } = useTheme();
  return (
    <Image
      className="site-process-illustration"
      src={`/illustrations/process/${kind}-${resolvedTheme}.webp`}
      alt={PROCESS_ALT_TEXT[kind] || `${kind} step illustration`}
      width={160}
      height={160}
      sizes="(max-width: 600px) 96px, (max-width: 1100px) 124px, 144px"
      loading="lazy"
      draggable={false}
      data-source="3dicons-v1"
    />
  );
}
