'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy, Mail, MessageCircle } from 'lucide-react';
import { useStoredValue } from '@/lib/browserState';
import { SITE } from '@/data/laxitechSite';
import { SplitRollText } from '@/components/ui/SplitRollText';

export function ContactConfirmation() {
  const [raw] = useStoredValue('laxitech_project_brief', '', 'session');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const brief = useMemo(() => {
    try {
      const data: unknown = raw ? JSON.parse(raw) : null;
      if (!data || typeof data !== 'object') return null;
      const read = (key: string) => { const value: unknown = Reflect.get(data, key); return typeof value === 'string' ? value : ''; };
      return { name: read('name'), email: read('email'), company: read('company'), service: read('service'), budget: read('budget'), message: read('message') };
    } catch { return null; }
  }, [raw]);
  const text = brief ? [`Hello Laxitech,`, `I’m ${brief.name}${brief.company ? ` from ${brief.company}` : ''}.`, `Email: ${brief.email}`, `Service: ${brief.service}`, brief.budget ? `Budget: ${brief.budget}` : '', '', brief.message].filter((line) => line !== '').join('\n') : 'Hello Laxitech, I would like to discuss a project.';
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopyError(true); } };
  return <section className="site-container site-confirmation"><span className="site-confirmation-icon"><Check /></span><h1>Your brief is ready.</h1><p>Choose how to send it to the Laxitech team.</p>{brief && <div className="site-brief-summary"><span>{brief.service}</span><h2>{brief.name}{brief.company && <small>{brief.company}</small>}</h2><p>{brief.message}</p><div><span>{brief.email}</span>{brief.budget && <span>{brief.budget}</span>}</div></div>}<div className="site-confirmation-actions"><a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Project enquiry${brief?.name ? ` from ${brief.name}` : ''}`)}&body=${encodeURIComponent(text)}`} className="lx-primary-button"><Mail /><SplitRollText text="Send by email" /></a><a href={`${SITE.whatsapp}?text=${encodeURIComponent(text)}`} className="site-secondary-button" target="_blank" rel="noopener noreferrer"><MessageCircle /><SplitRollText text="Send by WhatsApp" /></a></div><button type="button" className="site-copy-brief" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'Brief copied' : 'Copy the brief'}</button>{copyError && <textarea className="site-copy-fallback" readOnly value={text} aria-label="Your project brief, ready to copy" />}<p className="site-confirmation-note">Your enquiry is sent when you complete the message in your email or WhatsApp app.</p><Link href="/services" className="site-inline-link">Explore our services <ArrowUpRight /></Link></section>;
}
