import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { SITE } from '@/data/laxitechSite';
import { PageIntro } from '@/components/site/Primitives';
import { ContactForm } from '@/components/site/ContactForm';
import { Faq } from '@/components/site/Faq';
import { siteMetadata } from '@/lib/siteMetadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContactPageSchema } from '@/lib/schema';

export const metadata = siteMetadata(
  'Contact Our Engineering Team to Start a Project',
  'Reach out to Laxitech to discuss custom software engineering, cloud architecture, Pakistan VPS hosting, or enterprise workflow automation partnerships.',
  '/contact'
);

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const query = await searchParams;
  const service = Array.isArray(query.service) ? query.service[0] : query.service;
  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Contact', item: '/contact' },
  ];

  return (
    <>
      <JsonLd data={getContactPageSchema()} />
      <PageIntro
        breadcrumbs={breadcrumbs}
        lines={['Let’s build', 'what’s next.']}
        description="A new product, a technical challenge or something you are still working out. We’d like to hear about it."
        action="Write to us"
        href={`mailto:${SITE.email}`}
      />
      <section className="site-container site-contact-layout">
        <aside className="site-contact-aside">
          <h2>Talk to the<br />engineering team.</h2>
          <p>Tell us where you are and where you want to go. We’ll help you work through the next step.</p>
          <a href={`mailto:${SITE.email}`}>
            <Mail />
            <span>
              <small>Email the team</small>
              {SITE.email}
            </span>
            <ArrowUpRight />
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            <span>
              <small>Prefer WhatsApp?</small>
              Start a conversation
            </span>
            <ArrowUpRight />
          </a>
          <div className="site-contact-expect">
            <h3>What comes next?</h3>
            <p>We review your requirements, discuss the approach and prepare a scope that fits the work.</p>
          </div>
        </aside>
        <ContactForm initialService={service} />
      </section>
      <div id="faq">
        <Faq title="Before we get started." />
      </div>
    </>
  );
}
