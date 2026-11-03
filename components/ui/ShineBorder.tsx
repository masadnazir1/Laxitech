'use client';

import React from 'react';

interface ShineBorderProps {
  borderWidth?: number;
  duration?: number;
  colors?: [string, string];
}

export function ShineBorder({
  borderWidth = 1,
  duration = 2.8,
  colors = ['#0066FF', '#8B5CF6'],
}: ShineBorderProps) {
  const [c1, c2] = colors;

  const getStyle = (propName: string): React.CSSProperties => ({
    padding: borderWidth,
    animationDuration: `${duration}s`,
    backgroundImage: `conic-gradient(from calc(var(${propName}) - var(--vv-shine-w, 24deg)), transparent 0deg, ${c1} calc(var(--vv-shine-w, 24deg) / 2), ${c2} var(--vv-shine-w, 24deg), transparent calc(var(--vv-shine-w, 24deg) * 2), transparent 360deg)`,
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    WebkitMaskComposite: 'xor',
  });

  return (
    <>
      <span
        aria-hidden="true"
        className="vv-shine vv-shine-lyr-a pointer-events-none absolute inset-0 rounded-[inherit] pointer-coarse:hidden"
        style={getStyle('--vv-shine-a')}
      />
      <span
        aria-hidden="true"
        className="vv-shine vv-shine-lyr-b pointer-events-none absolute inset-0 rounded-[inherit] pointer-coarse:hidden"
        style={getStyle('--vv-shine-b')}
      />
    </>
  );
}
