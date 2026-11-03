import { AtSign, Inbox, LockKeyhole, Settings2 } from 'lucide-react';
import { MAIL_FAQS, SITE } from '@/data/laxitechSite';
import { PageIntro, PageClose, Reveal, SectionHeading, SiteButton } from '@/components/site/Primitives';
import { MailPreview, MailPricing } from '@/components/site/ProductPreviews';
import { Faq } from '@/components/site/Faq';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('GXMail business email', 'Business email on your own domain with GXMail. Secure SMTP/IMAP, SPF, DKIM and DMARC, webmail and central mailbox management.', '/products/gxmail');

export default function GxmailPage() {
  const features = [
    { Icon: AtSign, title: 'Make it your domain.', text: 'Professional addresses that carry your business identity into every conversation.' },
    { Icon: Inbox, title: 'Work where you prefer.', text: 'Use webmail or connect a compatible desktop or mobile mail application.' },
    { Icon: LockKeyhole, title: 'Authenticate your email.', text: 'SPF, DKIM and DMARC help protect your sending domain, with TLS for secure access.' },
    { Icon: Settings2, title: 'Keep your team organized.', text: 'Manage domains, mailboxes and account settings from the administration portal.' },
  ];
  return <><PageIntro lines={['Your business.', 'Your email.']} description="Meet GXMail. Professional mailboxes on your own domain, with secure access and a central home for your team’s email." action="Get GXMail" href={SITE.mailSignup}><SiteButton href={SITE.webmail} secondary external>Open webmail</SiteButton></PageIntro><section className="site-container site-product-hero-art"><MailPreview /><div className="site-product-facts"><span><strong>Your domain</strong>Your business identity</span><span><strong>SMTP / IMAP</strong>Your preferred mail app</span><span><strong>One portal</strong>Your team’s administration</span></div></section><section className="site-section site-container"><SectionHeading title={<>Every conversation.<br />A better impression.</>} /><div className="site-feature-grid">{features.map(({ Icon, title, text }) => <Reveal key={title}><Icon /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><MailPricing /><section className="site-section site-container"><SectionHeading title="From your domain to your inbox." /><div className="site-mail-onboarding">{[['Create an account', 'Start in the GXMail administration portal.'], ['Connect your domain', 'Follow the DNS settings provided for your account.'], ['Add your mailboxes', 'Set up your team and their mailbox access.'], ['Start the conversation', 'Open webmail or connect your preferred mail app.']].map(([title, text]) => <Reveal key={title}><span className="site-onboarding-dot" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><Faq items={MAIL_FAQS} title="A clearer inbox starts here." /><PageClose service="GXMail" title="Your next conversation starts here." /></>;
}
