'use client';

import Image from 'next/image';
import { useTheme } from '@/components/theme/ThemeProvider';

export function LaxitechWordmark({ className = '', symbolOnly = false, monument = false }: {
  className?: string;
  symbolOnly?: boolean;
  monument?: boolean;
}) {
  const { resolvedTheme } = useTheme();

  if (monument) return <span className={`lx-brand-monument ${className}`}>Laxitech</span>;

  const logoSrc = resolvedTheme === 'dark' ? '/brand/logo-white.png' : '/brand/laxitech-source.png';

  return (
    <Image
      src={logoSrc}
      width={150}
      height={100}
      alt={symbolOnly ? 'Laxitech' : ''}
      loading="eager"
      className={`object-contain ${className}`}
    />
  );
}
