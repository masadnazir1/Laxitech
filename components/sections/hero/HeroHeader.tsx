'use client';

import Link from 'next/link';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { ActionArrow } from '@/components/ui/ActionArrow';
import { Magnetic } from '@/components/motion/Magnetic';
import { TextEffect } from '@/components/motion/TextEffect';
import { HERO_COPY, type HeroDirection } from '@/data/heroExperience';
import { MacBookStage } from './MacBookStage';

export function HeroHeader({ direction = 'editorial', showTable = true }: {
  direction?: HeroDirection;
  showTable?: boolean;
}) {
  return (
    <section id="hero" className={`lx-hero lx-hero--${direction}`} data-atmosphere="aurora" aria-label="Laxitech software and infrastructure engineering">
      <div className="lx-hero-container">
        <div className="lx-hero-intro">
          <TextEffect key={direction} lines={HERO_COPY.lines} className="lx-hero-title" />
          <div className="lx-hero-copy">
            <p>{HERO_COPY.description}</p>
            <div className="lx-hero-actions">
              <Magnetic>
                <Link href={HERO_COPY.primaryHref} className="lx-primary-button"><SplitRollText text={HERO_COPY.primaryLabel} /><ActionArrow /></Link>
              </Magnetic>
              <Link href={HERO_COPY.secondaryHref} className="lx-text-link"><SplitRollText text={HERO_COPY.secondaryLabel} /></Link>
            </div>
          </div>
        </div>
        <MacBookStage showTable={showTable} />
      </div>
    </section>
  );
}
