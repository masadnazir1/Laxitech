'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Moon, Sun } from 'lucide-react';
import { HeroHeader } from './HeroHeader';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { HeroDirection } from '@/data/heroExperience';

export function HeroPreview() {
  const [direction, setDirection] = useState<HeroDirection>('editorial');
  const [showTable, setShowTable] = useState(true);
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="lx-preview-page">
      <aside className="lx-review-toolbar" aria-label="Hero concept comparison" data-ui>
        <span className="lx-review-label">Hero study</span>
        <div className="lx-review-directions" role="group" aria-label="Design direction">
          <button type="button" aria-pressed={direction === 'editorial'} onClick={() => setDirection('editorial')}>Editorial</button>
          <button type="button" aria-pressed={direction === 'cinematic'} onClick={() => setDirection('cinematic')}>Cinematic</button>
        </div>
        <button type="button" className="lx-review-table" aria-pressed={showTable} onClick={() => setShowTable((value) => !value)}><span>{showTable && <Check />}</span>Studio table</button>
        <button type="button" className="lx-review-theme" onClick={toggleTheme} aria-label={`Preview ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}>{resolvedTheme === 'dark' ? <Sun /> : <Moon />}</button>
        <Link href="/" className="lx-review-home" aria-label="View the homepage"><ArrowUpRight /></Link>
      </aside>
      <HeroHeader direction={direction} showTable={showTable} />
    </div>
  );
}
