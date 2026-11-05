import { BellRing, KeyRound, Layers3, RefreshCw } from 'lucide-react';
import { NOTIFY_FAQS, SITE } from '@/data/laxitechSite';
import { Faq } from '@/components/site/Faq';
import { NotifyPreview, NotifyPricing } from '@/components/site/ProductPreviews';
import { PageClose, PageIntro, Reveal, SectionHeading, SiteButton } from '@/components/site/Primitives';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata(
  'GXNotify notification API',
  'Send email, SMS and FCM push through one GXNotify API, with templates, subscribers, retries, delivery history and clear monthly PKR plans.',
  '/products/gxnotify',
);

export default function GxnotifyPage() {
  const features = [
    {
      Icon: BellRing,
      title: 'One request. Three channels.',
      text: 'Use one notification model for transactional email, SMS and Firebase Cloud Messaging push.',
    },
    {
      Icon: KeyRound,
      title: 'Bring your own providers.',
      text: 'Connect your SMTP infrastructure, SMS gateway and Firebase project instead of locking delivery to one vendor.',
    },
    {
      Icon: Layers3,
      title: 'Reuse the work.',
      text: 'Manage variable-powered templates, subscribers, opt-out state and project API keys from one dashboard.',
    },
    {
      Icon: RefreshCw,
      title: 'Follow every attempt.',
      text: 'Use bounded retries, dead-letter handling, signed webhooks and delivery history to investigate failures.',
    },
  ];
  const onboarding = [
    ['Create your account', 'Register on GXNotify, then create an organisation and its first project.'],
    ['Connect providers', 'Add the SMTP, SMS gateway and Firebase configuration used by your channels.'],
    ['Issue an API key', 'Generate a test or live project key from the GXNotify dashboard.'],
    ['Send and inspect', 'Submit a notification request, then follow its delivery state and provider response.'],
  ];

  return <><PageIntro lines={['Every notification.', 'One simple API.']} description="GXNotify gives your applications one workflow for email, SMS and FCM push, with your providers and a clear record of every delivery." action="Create account" href={SITE.notifySignUp} external><SiteButton href={SITE.notifySignIn} secondary external>Sign in</SiteButton><SiteButton href={SITE.notifyDashboard} secondary external>Open dashboard</SiteButton></PageIntro><section className="site-container site-product-hero-art"><NotifyPreview /><div className="site-product-facts"><span><strong>3 channels</strong>Email, SMS and FCM push</span><span><strong>1 API</strong>One notification workflow</span><span><strong>From PKR 500</strong>Monthly local billing</span></div></section><section className="site-section site-container"><SectionHeading title={<>Keep delivery logic.<br />Out of your application.</>} /><div className="site-feature-grid">{features.map(({ Icon, title, text }) => <Reveal key={title}><Icon /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><NotifyPricing /><section className="site-section site-container"><SectionHeading title="From project to first notification." /><div className="site-mail-onboarding">{onboarding.map(([title, text]) => <Reveal key={title}><span className="site-onboarding-dot" /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><Faq items={NOTIFY_FAQS} title="Build notifications on clearer foundations." /><PageClose service="GXNotify" title="Need help planning your notification flow?" /></>;
}
