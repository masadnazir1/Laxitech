'use client';

import { useId, useRef, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function SelectionControl<T extends string>({ options, value, onChange, label, className = '' }: { options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void; label: string; className?: string }) {
  const id = useId();
  const reduced = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % options.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return <div className={`site-selection ${className}`} role="radiogroup" aria-label={label}>
    {options.map((option, index) => <button key={option.value} ref={(element) => { refs.current[index] = element; }} type="button" role="radio" aria-checked={option.value === value} tabIndex={option.value === value ? 0 : -1} onClick={() => onChange(option.value)} onKeyDown={(event) => navigate(event, index)}>
      {option.value === value && <motion.span className="site-selection-indicator" layoutId={`${id}-selection`} transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }} />}
      <span className="site-selection-label">{option.label}</span>
    </button>)}
  </div>;
}
