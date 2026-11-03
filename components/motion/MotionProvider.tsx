'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';
import { MotionConfig } from 'motion/react';

function ScrollLifecycle() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    lenis.resize();
    const syncScrollLock = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncScrollLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    syncScrollLock();
    return () => observer.disconnect();
  }, [lenis, pathname]);

  return null;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const options = useMemo(() => ({
    autoRaf: true,
    lerp: 0.12,
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -104 },
    stopInertiaOnNavigate: true,
    respectReducedMotion: true,
    prevent: (node: HTMLElement) => node.hasAttribute('data-lenis-prevent'),
  }), []);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      <ReactLenis root options={options}>
        <ScrollLifecycle />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
