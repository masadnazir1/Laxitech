import { AtSign, Inbox, KeyRound, LockKeyhole } from 'lucide-react';
import { MAIL_FAQS, SITE } from '@/data/laxitechSite';
import { PageIntro, PageClose, Reveal, SectionHeading, SiteButton } from '@/components/site/Primitives';
import { MailPreview, MailPricing } from '@/components/site/ProductPreviews';
import { Faq } from '@/components/site/Faq';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('GXMail business email plans', 'Compare GXMail plans for custom-domain email, shared mailbox storage, SMTP credentials, secure access, webmail and central administration.', '/products/gxmail');

export default function GxmailPage() {
  const features = [
    { Icon: AtSign, title: 'Use your own domains.', text: 'Add 1, 3 or 5 business domains, depending on the plan you choose.' },
    { Icon: Inbox, title: 'Size mailboxes to your team.', text: 'Set up plan-based mailbox capacity and allocate storage from one shared pool.' },
    { Icon: LockKeyhole, title: 'Authenticate and connect.', text: 'Use SPF, DKIM and DMARC for your domain, with TLS-protected SMTP and IMAP access.' },
    { Icon: KeyRound, title: 'Send from your applications.', text: 'Create SMTP credentials for services and applications, then manage them from the administration portal.' },
  ];
  const onboarding = [
    ['Create your workspace', 'Register your business in the GXMail administration portal.'],
    ['Choose a plan', 'Select the capacity and billing period that fit your team.'],
    ['Connect your domains', 'Add the provided DNS records, then verify each domain.'],
    ['Add your mailboxes', 'Allocate storage, open webmail or connect a compatible mail application.'],
  ];

  return <><PageIntro lines={['Your business.', 'Your email.']} description="Meet GXMail. Custom-domain email with three clear plans for your domains, mailboxes, shared storage and application sending." action="Get GXMail" href={SITE.mailSignup} external><SiteButton href={SITE.webmail} secondary external>Open webmail</SiteButton></PageIntro><section className="site-container site-product-hero-art"><MailPreview /><div className="site-product-facts"><span><strong>1–5 domains</strong>Plan-based capacity</span><span><strong>30–200 GB</strong>Shared mailbox storage</span><span><strong>5–20 SMTP</strong>Application credentials</span></div></section><section className="site-section site-container"><SectionHeading title={<>Your email.<br />Under your control.</>} /><div className="site-feature-grid">{features.map(({ Icon, title, text }) => <Reveal key={title}><Icon /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><MailPricing /><section className="site-section site-container"><SectionHeading title="From your domain to your inbox." /><div className="site-mail-onboarding">{onboarding.map(([title, text]) => <Reveal key={title}><span className="site-onboarding-dot" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><Faq items={MAIL_FAQS} title="A clearer inbox starts here." /><PageClose service="GXMail" title="Your next conversation starts here." /></>;
}
