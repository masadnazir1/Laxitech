import { ContactConfirmation } from '@/components/site/ContactConfirmation';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = { ...siteMetadata('Your project brief', 'Review and send your project brief to the Laxitech team.', '/contact/thank-you'), robots: { index: false, follow: false } };

export default function ContactThankYouPage() {
  return <ContactConfirmation />;
}
