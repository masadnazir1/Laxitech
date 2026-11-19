import Link from 'next/link';
import { SITE } from '@/data/laxitechSite';
import { Reveal } from './Primitives';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from '@/lib/schema';

export function PolicyPage({
  title,
  introduction,
  sections,
  breadcrumbs,
}: {
  title: string;
  introduction: string;
  sections: readonly { title: string; paragraphs: readonly string[] }[];
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <article className="site-container site-policy">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-8" />}
      <Reveal><h1>{title}</h1><p className="site-policy-intro">{introduction}</p></Reveal>
      {sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <section><h2>Talk to us.</h2><p>For questions about this page or your service, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or <Link href="/contact">start a conversation</Link>.</p></section>
      <nav aria-label="Related policies"><Link href="/privacy-policy">Privacy</Link><Link href="/terms-and-conditions">Terms</Link><Link href="/refund-policy">Refunds & cancellations</Link></nav>
    </article>
  );
}
