'use client';

import React from 'react';

interface SplitRollTextProps {
  text: string;
  className?: string;
}

export function SplitRollText({ text, className = '' }: SplitRollTextProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Screen-reader accessible label */}
      <span className="vv-roll-label sr-only pointer-coarse:not-sr-only">{text}</span>
      
      {/* Kinetic staggered vertical roll */}
      <span aria-hidden="true" className="vv-roll">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="vv-roll-char"
            style={{ '--i': index } as React.CSSProperties}
          >
            <span>{char === ' ' ? '\u00A0' : char}</span>
            <span>{char === ' ' ? '\u00A0' : char}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
