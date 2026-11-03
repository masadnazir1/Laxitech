import { Cloud, Database, Globe2, HardDrive, ShieldCheck, Terminal } from 'lucide-react';
import { SITE, CLOUD_FAQS } from '@/data/laxitechSite';
import { PageIntro, PageClose, Reveal, SectionHeading, SiteButton } from '@/components/site/Primitives';
import { CloudPreview, VpsPricing } from '@/components/site/ProductPreviews';
import { Faq } from '@/components/site/Faq';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Pakistan VPS hosting', 'Pakistan-hosted NVMe VPS plans from PKR 999 per month. Explore cloud compute, dedicated configurations and local billing.', '/products/vps');

export default function VpsPage() {
  const features = [
    { Icon: Globe2, title: 'Closer to your audience.', text: 'In-country hosting for applications and businesses serving Pakistan.' },
    { Icon: HardDrive, title: 'NVMe at the foundation.', text: 'Enterprise NVMe storage across the published VPS tiers.' },
    { Icon: Terminal, title: 'Your stack, your setup.', text: 'Run your applications, containers and preferred operating environment.' },
    { Icon: ShieldCheck, title: 'Support behind the service.', text: 'Discuss managed setup, backups and ongoing infrastructure operations.' },
  ];
  return <><PageIntro lines={['Your next', 'deployment.']} description="Pakistan-hosted NVMe compute. Clear resource tiers, local billing and an engineering team you can talk to." action="Compare the plans" href="#pricing"><SiteButton href={SITE.cloudPortal} secondary external>Cloud portal</SiteButton></PageIntro><section className="site-container site-product-hero-art"><CloudPreview /><div className="site-product-facts"><span><strong>Pakistan</strong>Local hosting</span><span><strong>NVMe</strong>Enterprise storage</span><span><strong>PKR</strong>Monthly billing</span></div></section><section className="site-section site-container"><SectionHeading title={<>A practical place<br />to run your business.</>} /><div className="site-feature-grid">{features.map(({ Icon, title, text }) => <Reveal key={title}><Icon /><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section><VpsPricing /><section className="site-section site-container site-infrastructure-options"><Reveal><Cloud /><h2>A configuration<br />that fits.</h2><p>Need more memory, a different storage profile or a particular operating system? Start with your workload, then scope the resources around it.</p><SiteButton href="/contact?service=Custom%20VPS" secondary>Request a custom VPS</SiteButton></Reveal><Reveal><Database /><h2>Your own<br />dedicated machine.</h2><p>For workloads that need an entire physical server, we can discuss bare-metal configuration, management and backup requirements.</p><SiteButton href="/contact?service=Dedicated%20server" secondary>Discuss dedicated hosting</SiteButton></Reveal></section><Faq items={CLOUD_FAQS} title="Before you deploy." /><PageClose service="infrastructure" title="Let’s find the right fit." /></>;
}
