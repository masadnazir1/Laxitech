import { PolicyPage } from '@/components/site/PolicyPage';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Privacy policy', 'Information about enquiries, browser storage and service-specific data handling at Laxitech.', '/privacy-policy');

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy policy." introduction="How this website uses the information you choose to share, and where to ask about your project or service." sections={[
    { title: 'Your enquiry.', paragraphs: ['The contact form prepares a project brief using the name, email address, company, service, budget and project details you enter. The brief is stored in your browser’s session storage so you can review it.', 'Preparing the brief does not send it to Laxitech. You choose whether to complete the handoff through your email application or WhatsApp. Information you send is used to respond to your enquiry and discuss your requirements.'] },
    { title: 'Browser preferences.', paragraphs: ['This website uses local browser storage to remember your display theme. The project brief is kept in session storage for the current browsing session. You can clear this information through your browser settings.', 'The address preview on the GXMail page changes the illustration in your browser. Entering a domain there does not register a domain or create a mailbox.'] },
    { title: 'Linked services.', paragraphs: ['Cloud ordering, GXMail administration, webmail and WhatsApp open services outside this website. Their account settings, service terms and data-handling arrangements apply when you use them.', 'For hosting or email services, ask for the data location, retention, access and recovery arrangements that apply to your order. These details depend on the service and configuration.'] },
    { title: 'Project information.', paragraphs: ['Confidentiality, access to business systems, delivery materials and any data-processing requirements should be set out in the project agreement. Share the requirements relevant to your business when scoping the engagement.'] },
    { title: 'Questions about your data.', paragraphs: ['Contact us to ask about information you have shared, request a correction or discuss access and deletion. The response depends on the information involved, the service agreement and applicable legal requirements.'] },
  ]} />;
}
