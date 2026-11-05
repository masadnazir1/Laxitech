'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { ENGINEERING_SERVICES, SITE } from '@/data/laxitechSite';
import { Reveal, SiteButton } from '@/components/site/Primitives';
import { SplitRollText } from '@/components/ui/SplitRollText';

export function Footer() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  if (pathname === '/design-preview') return null;
  const hasPageClose = ['/services', '/products', '/about', '/solutions', '/insights'].some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch { window.location.href = `mailto:${SITE.email}`; }
  };
  return <footer className="site-footer" data-atmosphere="rays"><div className="site-container">{!hasPageClose && <Reveal className="site-footer-invitation"><h2>What are we<br />building next?</h2><div><p>A conversation is a good place to start.</p><SiteButton href="/contact">Get a quote</SiteButton></div></Reveal>}<div className="site-footer-directory"><div className="site-footer-contact"><span>Let’s talk.</span><a href={`mailto:${SITE.email}`}>{SITE.email}<ArrowUpRight /></a><button type="button" onClick={copyEmail}>{copied ? <Check /> : <Copy />}<span aria-live="polite">{copied ? 'Email copied' : 'Copy email address'}</span></button><p>Software, systems and the people behind them.</p></div><div><h3>Engineering</h3>{ENGINEERING_SERVICES.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}><SplitRollText text={service.name.replace('Custom ', '').replace(' & operations', '')} /></Link>)}</div><div><h3>Explore</h3>{[['About Laxitech', '/about'], ['Our solutions', '/solutions'], ['Cloud hosting', '/products/vps'], ['GXMail', '/products/gxmail'], ['GXNotify', '/products/gxnotify'], ['Engineering insights', '/insights'], ['Contact', '/contact']].map(([label, href]) => <Link href={href} key={href}><SplitRollText text={label} /></Link>)}</div></div><div className="site-footer-wordmark" aria-hidden="true">Laxitech</div><div className="site-footer-bottom"><span>© {new Date().getFullYear()} Laxitech.</span><div><Link href="/privacy-policy">Privacy</Link><Link href="/terms-and-conditions">Terms</Link><Link href="/refund-policy">Refund policy</Link><a href={SITE.mailPortal} target="_blank" rel="noopener noreferrer">GXMail access <ArrowUpRight /></a><a href={SITE.notifySignIn} target="_blank" rel="noopener noreferrer">GXNotify access <ArrowUpRight /></a></div></div></div></footer>;
}
