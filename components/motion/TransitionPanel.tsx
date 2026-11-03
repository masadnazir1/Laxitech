'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';

function Panel({ children }: { children: ReactNode }) {
  const isPresent = useIsPresent();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="lx-transition-panel"
      inert={!isPresent}
      aria-hidden={!isPresent}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
      transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function TransitionPanel({
  activeKey,
  children,
}: {
  activeKey: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false} mode="wait">
      <Panel key={activeKey}>{children}</Panel>
    </AnimatePresence>
  );
}
