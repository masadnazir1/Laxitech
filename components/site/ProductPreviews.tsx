'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SITE, VPS_PLANS } from '@/data/laxitechSite';
import { TransitionPanel } from '@/components/motion/TransitionPanel';
import { EngineeringIllustration } from '@/components/illustrations/EngineeringIllustration';
import { SelectionControl } from './SelectionControl';
import { Reveal, SectionHeading, SiteButton } from './Primitives';

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
  const [active, setActive] = useState<'cloud' | 'mail'>('cloud');
  return <section className="site-section site-product-section" data-atmosphere="silk"><div className="site-container"><SectionHeading title={<>Our engineering.<br />Your everyday tools.</>} description="Purpose-built products, backed by the team that builds your systems." /><SelectionControl className="site-product-choice" label="Explore Laxitech products" value={active} onChange={setActive} options={[{ value: 'cloud', label: 'Cloud infrastructure' }, { value: 'mail', label: 'GXMail' }]} /><div className="site-product-feature"><Reveal className="site-product-copy"><TransitionPanel activeKey={active}><div><h3>{active === 'cloud' ? <>A local home.<br />A bigger future.</> : <>Your business.<br />Your email.</>}</h3><p>{active === 'cloud' ? 'Pakistan-hosted NVMe servers with practical resource tiers and predictable PKR billing. Start small, then choose the capacity your workload needs.' : 'Professional email on your own domain, with secure access, domain authentication and a central place to manage your team’s mailboxes.'}</p><span className="site-product-price">From <strong>PKR {active === 'cloud' ? '999' : '250'}</strong> / month</span><SiteButton href={active === 'cloud' ? '/products/vps' : '/products/gxmail'}>{active === 'cloud' ? 'Explore cloud hosting' : 'Discover GXMail'}</SiteButton></div></TransitionPanel></Reveal><Reveal className="site-product-interface" delay={0.08}><TransitionPanel activeKey={active}>{active === 'cloud' ? <CloudPreview /> : <MailPreview />}</TransitionPanel></Reveal></div></div></section>;
}

export function VpsPricing() {
  return <section id="pricing" className="site-section site-container" data-atmosphere="silk"><SectionHeading title={<>Room to grow.<br />Clear pricing.</>} description="Pakistan-hosted VPS plans. Monthly billing in Pakistani Rupees." /><div className="site-pricing-grid">{VPS_PLANS.map((plan, index) => <Reveal key={plan.name} className="site-price-plan" delay={index * 0.07}><div className="site-plan-name"><h3>{plan.name}</h3></div><div className="site-plan-price"><span>PKR</span><strong>{plan.price.toLocaleString('en-US')}</strong><span>/ mo</span></div><p>{plan.description}</p><dl>{[['vCPU', plan.cpu], ['Memory', plan.ram], ['NVMe storage', plan.storage], ['Bandwidth', plan.bandwidth]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><SiteButton href={SITE.cloudPortal} external>{`Choose ${plan.name}`}</SiteButton></Reveal>)}</div><p className="site-pricing-note">Need a different configuration or a dedicated server? <Link href="/contact?service=Custom%20infrastructure">Let’s scope your infrastructure.</Link></p></section>;
}

export function MailPricing() {
  const [billing, setBilling] = useState('monthly');
  const annual = billing === 'yearly';
  return <section className="site-section site-container" id="pricing" data-atmosphere="silk"><div className="site-mail-pricing"><Reveal><h2>Your name.<br />On every message.</h2><p>Professional business email with clear, local-currency billing.</p><SelectionControl className="site-billing-choice" label="GXMail billing period" value={billing} onChange={setBilling} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} /></Reveal><Reveal className="site-mail-plan" delay={0.08}><span>GXMail business email</span><div aria-live="polite" aria-atomic="true"><TransitionPanel activeKey={billing}><div className="site-plan-price"><span>PKR</span><strong>{annual ? '2,999' : '250'}</strong><span>/ {annual ? 'year' : 'month'}</span></div><p className="site-billing-note">{annual ? 'Billed once a year.' : 'Billed monthly.'}</p></TransitionPanel></div><ul>{['Your own business domain', 'Professional mailboxes', 'Secure SMTP / IMAP access', 'SPF, DKIM & DMARC', 'Webmail and administration'].map((feature) => <li key={feature}><Check />{feature}</li>)}</ul><SiteButton href={SITE.mailSignup} external>Get GXMail</SiteButton></Reveal></div></section>;
}
