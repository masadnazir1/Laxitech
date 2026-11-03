import { PageIntro, SiteButton } from '@/components/site/Primitives';

export default function NotFound() {
  return <div className="site-not-found"><PageIntro lines={['A wrong turn.', 'A fresh start.']} description="We couldn’t find that page. Head home or explore the engineering services that brought you here." action="Back to home" href="/"><SiteButton href="/services" secondary>Explore services</SiteButton></PageIntro></div>;
}
