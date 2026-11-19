import { PolicyPage } from '@/components/site/PolicyPage';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata(
  'Refund, Billing & Service Cancellation Policy',
  'Clear guidelines and transparent policies on subscription billing, refund eligibility, payment handling, and service cancellations for Laxitech products.',
  '/refund-policy'
);

export default function RefundPolicyPage() {
  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Refund Policy', item: '/refund-policy' },
  ];

  return (
    <PolicyPage
      breadcrumbs={breadcrumbs}
      title="Refunds & cancellations."
      introduction="For a billing question or a change of plans, start with the details of your order."
      sections={[
    { title: 'The terms of your order.', paragraphs: ['Refund eligibility, cancellation timing, renewal arrangements and any exclusions are defined by the accepted order or project agreement, together with applicable law. Ask for these details before purchasing if they are unclear.'] },
    { title: 'Subscription products.', paragraphs: ['For a cloud hosting, GXMail or GXNotify subscription enquiry, include the service name, account email, order or invoice reference and the billing period involved. Tell us whether you want to discuss an invoice, cancel a renewal or request a refund.', 'Any applicable notice period, setup charge or third-party cost is assessed under the terms of that service.'] },
    { title: 'Engineering engagements.', paragraphs: ['Project cancellations and changes are reviewed against the agreed scope, payment schedule, work completed and handover obligations. Discuss the request with your project contact so the remaining work and materials can be accounted for.'] },
    { title: 'Service concerns.', paragraphs: ['If a service is not working as expected, share the affected service, relevant dates and a description of the issue. Any service-credit or refund request is reviewed under the commitments in your agreement.'] },
    { title: 'Making a request.', paragraphs: ['Email contact@laxitech.com with your order reference and the outcome you are requesting. The team can review the details and explain the next step.'] },
      ]}
    />
  );
}
