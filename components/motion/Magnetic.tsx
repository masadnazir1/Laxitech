'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export function Magnetic({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.4 });

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <span
      ref={ref}
      className={`lx-magnetic ${className}`}
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType !== 'mouse' || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width / 2) * 0.12)));
        y.set(Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) * 0.12)));
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onFocus={reset}
      onBlur={reset}
    >
      <motion.span className="lx-magnetic-inner" style={{ x: reducedMotion ? 0 : springX, y: reducedMotion ? 0 : springY }}>
        {children}
      </motion.span>
    </span>
  );
}
