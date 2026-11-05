'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { stagger, useAnimate, useInView, useReducedMotion } from 'motion/react';
import { TextEffect } from '@/components/motion/TextEffect';
import { Magnetic } from '@/components/motion/Magnetic';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { ActionArrow } from '@/components/ui/ActionArrow';

export function Reveal({ children, className = '', delay = 0, id }: { children: ReactNode; className?: string; delay?: number; id?: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const visible = useInView(scope, { once: true, margin: '0px 0px -40px 0px' });
  const played = useRef(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible || played.current || reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    played.current = true;
    const parts = Array.from(scope.current.children);
    const controls = animate(parts.length ? parts : [scope.current], { opacity: [0, 1], y: [22, 0] }, { duration: 0.75, delay: stagger(0.075, { startDelay: delay }), ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [visible, reduced, animate, scope, delay]);
  return <div ref={scope} id={id} className={className} data-reveal-group>{children}</div>;
}

export function SiteButton({ href, children, secondary = false, external = false, className = '' }: { href: string; children: string; secondary?: boolean; external?: boolean; className?: string }) {
  const content = <><SplitRollText text={children} />{!secondary && <ActionArrow />}</>;
  const classes = `${secondary ? 'lx-text-link' : 'lx-primary-button'} ${className}`;
  const link = external ? <a href={href} className={classes} target="_blank" rel="noopener noreferrer">{content}</a> : <Link href={href} className={classes}>{content}</Link>;
  return secondary ? link : <Magnetic>{link}</Magnetic>;
}

export function PageIntro({ lines, description, action = 'Get a quote', href = '/contact', external = false, children }: { lines: readonly string[]; description: string; action?: string; href?: string; external?: boolean; children?: ReactNode }) {
  return (
    <header className="site-page-intro site-container" data-atmosphere="rays">
      <TextEffect lines={lines} className="site-page-title" />
      <div className="site-page-description"><p>{description}</p><div className="site-intro-actions"><SiteButton href={href} external={external}>{action}</SiteButton>{children}</div></div>
    </header>
  );
}

export function SectionHeading({ title, description, action, href }: { title: ReactNode; description?: string; action?: string; href?: string }) {
  return <div className="site-section-heading"><Reveal><h2>{title}</h2>{description && <p>{description}</p>}</Reveal>{action && href && <SiteButton href={href} secondary>{action}</SiteButton>}</div>;
}

export function PageClose({ title = 'Let’s make it happen.', description = 'Tell us what you are working on. We’ll help you find a clear next step.', service }: { title?: string; description?: string; service?: string }) {
  return <section className="site-container site-page-close" data-atmosphere="rays"><Reveal className="site-close-inner"><div><h2>{title}</h2><p>{description}</p></div><SiteButton href={service ? `/contact?service=${encodeURIComponent(service)}` : '/contact'}>Start a conversation</SiteButton></Reveal></section>;
}
