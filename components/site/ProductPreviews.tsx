'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GXMAIL_PLANS, GXNOTIFY_PLANS, SITE, VPS_PLANS } from '@/data/laxitechSite';
import { TransitionPanel } from '@/components/motion/TransitionPanel';
import { EngineeringIllustration } from '@/components/illustrations/EngineeringIllustration';
import { SelectionControl } from './SelectionControl';
import { Reveal, SectionHeading, SiteButton } from './Primitives';

type MailBilling = keyof (typeof GXMAIL_PLANS)[number]['billing'];
type NotifyChannel = 'email' | 'sms' | 'push';

const formatPrice = (price: number) => price.toLocaleString('en-PK');

export function MailPreview() {
  const [domain, setDomain] = useState('');
  const [mailbox, setMailbox] = useState('hello');
  const id = useId();
  const previewDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].replace(/\s/g, '') || 'yourcompany.com';
  return <div className="site-mail-illustration">
    <EngineeringIllustration kind="mail" caption={false} />
    <div className="site-mail-address-preview">
      <p className="site-address-output" aria-live="polite" aria-atomic="true">{mailbox}<span>@</span>{previewDomain}</p>
      <div className="site-domain-field"><label htmlFor={`${id}-domain`}>Preview your business address</label><div><input id={`${id}-domain`} type="text" inputMode="url" maxLength={64} autoCapitalize="none" autoComplete="off" spellCheck={false} placeholder="Enter your domain" value={domain} onChange={(event) => setDomain(event.target.value)} /><ArrowRight aria-hidden="true" /></div></div>
      <SelectionControl label="Email address name" value={mailbox} onChange={setMailbox} options={[{ value: 'hello', label: 'Hello' }, { value: 'sales', label: 'Sales' }, { value: 'team', label: 'Team' }]} />
    </div>
  </div>;
}

const NOTIFY_CHANNELS = {
  email: { label: 'Email', provider: 'Your SMTP', capability: 'Templates + tracking' },
  sms: { label: 'SMS', provider: 'Your gateway', capability: 'E.164 + segments' },
  push: { label: 'FCM push', provider: 'Your Firebase', capability: 'Devices + cleanup' },
} as const;

export function NotifyPreview() {
  const [channel, setChannel] = useState<NotifyChannel>('email');
  const selected = NOTIFY_CHANNELS[channel];

  return <div className="site-notify-illustration"><EngineeringIllustration kind="automation" caption={false} /><div className="site-notify-preview"><SelectionControl className="site-notify-channel-choice" label="Preview GXNotify channel" value={channel} onChange={setChannel} options={[{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }, { value: 'push', label: 'Push' }]} /><div aria-live="polite" aria-atomic="true"><TransitionPanel activeKey={channel}><dl className="site-notify-summary"><div><dt>Channel</dt><dd>{selected.label}</dd></div><div><dt>Provider</dt><dd>{selected.provider}</dd></div><div><dt>Built in</dt><dd>{selected.capability}</dd></div></dl><p className="site-notify-endpoint">POST <span>/api/v1/notifications</span></p></TransitionPanel></div></div></div>;
}

export function CloudPreview() {
  const [plan, setPlan] = useState<(typeof VPS_PLANS)[number]['name']>('Starter');
  const selected = VPS_PLANS.find((item) => item.name === plan) ?? VPS_PLANS[0];
  return <div className="site-cloud-illustration">
    <EngineeringIllustration kind="vps" caption={false} />
    <div className="site-plan-explorer">
      <SelectionControl label="Preview VPS plan" value={plan} onChange={setPlan} options={VPS_PLANS.map((item) => ({ value: item.name, label: item.name }))} />
      <div aria-live="polite" aria-atomic="true"><TransitionPanel activeKey={plan}><dl className="site-resource-summary">{[['Compute', selected.cpu], ['Memory', selected.ram], ['NVMe storage', selected.storage]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="site-config-price">PKR <strong>{selected.price.toLocaleString('en-US')}</strong> / month</p></TransitionPanel></div>
    </div>
  </div>;
}

export function ProductShowcase() {
  const [active, setActive] = useState<'cloud' | 'mail' | 'notify'>('cloud');
  const product = active === 'cloud'
    ? {
      title: <>A local home.<br />A bigger future.</>,
      copy: 'Pakistan-hosted NVMe servers with practical resource tiers and predictable PKR billing. Start small, then choose the capacity your workload needs.',
      price: VPS_PLANS[0].price,
      href: '/products/vps',
      action: 'Explore cloud hosting',
      preview: <CloudPreview />,
    }
    : active === 'mail'
      ? {
        title: <>Your business.<br />Your email.</>,
        copy: 'Professional email on your own domain, with plan-based mailbox capacity, shared storage, secure access and central administration.',
        price: GXMAIL_PLANS[0].billing.monthly.price,
        href: '/products/gxmail',
        action: 'Discover GXMail',
        preview: <MailPreview />,
      }
      : {
        title: <>Every notification.<br />One simple API.</>,
        copy: 'Send email, SMS and FCM push through one notification workflow, using your own providers with templates, retries and delivery history.',
        price: GXNOTIFY_PLANS[0].price,
        href: '/products/gxnotify',
        action: 'Discover GXNotify',
        preview: <NotifyPreview />,
      };

  return <section className="site-section site-product-section" data-atmosphere="silk"><div className="site-container"><SectionHeading title={<>Our engineering.<br />Your everyday tools.</>} description="Purpose-built products, backed by the team that builds your systems." /><SelectionControl className="site-product-choice" label="Explore Laxitech products" value={active} onChange={setActive} options={[{ value: 'cloud', label: 'Cloud VPS' }, { value: 'mail', label: 'GXMail' }, { value: 'notify', label: 'GXNotify' }]} /><div className="site-product-feature"><Reveal className="site-product-copy"><TransitionPanel activeKey={active}><div><h3>{product.title}</h3><p>{product.copy}</p><span className="site-product-price">From <strong>PKR {formatPrice(product.price)}</strong> / month</span><SiteButton href={product.href}>{product.action}</SiteButton></div></TransitionPanel></Reveal><Reveal className="site-product-interface" delay={0.08}><TransitionPanel activeKey={active}>{product.preview}</TransitionPanel></Reveal></div></div></section>;
}

export function VpsPricing() {
  return <section id="pricing" className="site-section site-container" data-atmosphere="silk"><SectionHeading title={<>Room to grow.<br />Clear pricing.</>} description="Pakistan-hosted VPS plans. Monthly billing in Pakistani Rupees." /><div className="site-pricing-grid">{VPS_PLANS.map((plan, index) => <Reveal key={plan.name} className="site-price-plan" delay={index * 0.07}><div className="site-plan-name"><h3>{plan.name}</h3></div><div className="site-plan-price"><span>PKR</span><strong>{plan.price.toLocaleString('en-US')}</strong><span>/ mo</span></div><p>{plan.description}</p><dl>{[['vCPU', plan.cpu], ['Memory', plan.ram], ['NVMe storage', plan.storage], ['Bandwidth', plan.bandwidth]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><SiteButton href={SITE.cloudPortal} external>{`Choose ${plan.name}`}</SiteButton></Reveal>)}</div><p className="site-pricing-note">Need a different configuration or a dedicated server? <Link href="/contact?service=Custom%20infrastructure">Let’s scope your infrastructure.</Link></p></section>;
}

export function MailPricing() {
  const [billing, setBilling] = useState<MailBilling>('monthly');
  const annual = billing === 'yearly';
  return <section className="site-section site-container" id="pricing" data-atmosphere="silk"><div className="site-mail-pricing-heading"><SectionHeading title={<>A plan for<br />every workspace.</>} description="Choose mailbox, storage and sending capacity with clear billing in Pakistani Rupees." /><SelectionControl className="site-billing-choice" label="GXMail billing period" value={billing} onChange={setBilling} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} /></div><div className="site-pricing-grid site-mail-plan-grid">{GXMAIL_PLANS.map((plan, index) => {
    const selectedBilling = plan.billing[billing];
    const alternateBilling = plan.billing[annual ? 'monthly' : 'yearly'];
    const mailboxStorage = plan.maxMailboxStorageGb === null
      ? `${plan.defaultMailboxStorageGb} GB default, flexible`
      : `${plan.maxMailboxStorageGb} GB per mailbox`;
    const details = [
      ['Domains', String(plan.maxDomains)],
      ['Mailboxes', plan.maxMailboxes === null ? 'Unlimited' : String(plan.maxMailboxes)],
      ['Shared storage', `${plan.sharedStorageGb} GB`],
      ['Mailbox storage', mailboxStorage],
      ['SMTP credentials', String(plan.maxSmtpCredentials)],
      ['GNotify discount', plan.gnotifyDiscountPercent ? `${plan.gnotifyDiscountPercent}%` : 'None'],
      ['Support', plan.support],
    ];

    return <Reveal key={plan.code} className="site-price-plan site-mail-plan-card" delay={index * 0.07}><div className="site-plan-name"><h3>{plan.name}</h3></div><div className="site-mail-plan-price-switch" aria-live="polite" aria-atomic="true"><TransitionPanel activeKey={billing}><div className="site-plan-price"><span>PKR</span><strong>{formatPrice(selectedBilling.price)}</strong><span>/ {annual ? 'year' : 'month'}</span></div><p className="site-billing-note">{annual ? `PKR ${formatPrice(alternateBilling.price)} month-to-month.` : `PKR ${formatPrice(alternateBilling.price)} billed yearly.`}</p></TransitionPanel></div><p>{plan.description}</p><dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><SiteButton href={SITE.mailSignup} external>Create workspace</SiteButton></Reveal>;
  })}</div><p className="site-pricing-note">Storage is shared across each workspace. Business Pro has no mailbox-count limit, but its 200 GB shared-storage limit still applies. Create your workspace, then select and pay for a plan in the GXMail administration portal.</p></section>;
}

export function NotifyPricing() {
  return <section className="site-section site-container" id="pricing" data-atmosphere="silk"><SectionHeading title={<>Start small.<br />Scale when you need to.</>} description="Monthly notification capacity with local PKR billing and clear limits for every channel." /><div className="site-pricing-grid site-notify-plan-grid">{GXNOTIFY_PLANS.map((plan, index) => {
    const details = [
      ['Projects', formatPrice(plan.limits.projects)],
      ['Email notifications', formatPrice(plan.limits.email)],
      ['FCM notifications', formatPrice(plan.limits.push)],
      ['SMS credits', formatPrice(plan.limits.sms)],
      ['API keys', formatPrice(plan.limits.apiKeys)],
      ['Templates', formatPrice(plan.limits.templates)],
      ['Support', plan.support],
    ];

    return <Reveal key={plan.code} className="site-price-plan site-notify-plan-card" delay={index * 0.07}><div className="site-plan-name"><h3>{plan.name}</h3></div><div className="site-plan-price"><span>PKR</span><strong>{formatPrice(plan.price)}</strong><span>/ month</span></div><p>{plan.audience}</p><dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><SiteButton href={SITE.notifySignUp} external>Create account</SiteButton></Reveal>;
  })}</div><p className="site-pricing-note">Quotas apply to each monthly billing period. Delivery also depends on the SMTP, SMS gateway and Firebase providers connected to your GXNotify projects.</p></section>;
}
