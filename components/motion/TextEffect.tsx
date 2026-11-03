'use client';

import { useEffect } from 'react';
import { stagger, useAnimate, useReducedMotion } from 'motion/react';

export function TextEffect({
  lines,
  className = '',
}: {
  lines: readonly string[];
  className?: string;
}) {
  const [scope, animate] = useAnimate<HTMLHeadingElement>();
  const reducedMotion = useReducedMotion();
  const text = lines.join(' ');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const controls = animate(
      '[data-reveal-word]',
      { transform: ['translateY(105%)', 'translateY(0%)'], opacity: [0, 1] },
      { duration: 0.85, delay: stagger(0.045, { startDelay: 0.08 }), ease: [0.22, 1, 0.36, 1] }
    );
    return () => controls.stop();
  }, [animate, reducedMotion, text]);

  return (
    <h1 ref={scope} className={className} aria-label={text}>
      {lines.map((line) => (
        <span key={line} className="lx-heading-line" aria-hidden="true">
          {line.split(' ').map((word, index) => (
            <span key={`${word}-${index}`} className="lx-word-mask">
              <span data-reveal-word>{word}{index < line.split(' ').length - 1 ? '\u00a0' : ''}</span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
