import { PolicyPage } from '@/components/site/PolicyPage';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Refunds and cancellations', 'How to discuss a billing issue, cancellation or refund request for a Laxitech service.', '/refund-policy');

export default function RefundPolicyPage() {
  return <PolicyPage title="Refunds & cancellations." introduction="For a billing question or a change of plans, start with the details of your order." sections={[
    { title: 'The terms of your order.', paragraphs: ['Refund eligibility, cancellation timing, renewal arrangements and any exclusions are defined by the accepted order or project agreement, together with applicable law. Ask for these details before purchasing if they are unclear.'] },
    { title: 'Subscription products.', paragraphs: ['For a cloud hosting, GXMail or GXNotify subscription enquiry, include the service name, account email, order or invoice reference and the billing period involved. Tell us whether you want to discuss an invoice, cancel a renewal or request a refund.', 'Any applicable notice period, setup charge or third-party cost is assessed under the terms of that service.'] },
    { title: 'Engineering engagements.', paragraphs: ['Project cancellations and changes are reviewed against the agreed scope, payment schedule, work completed and handover obligations. Discuss the request with your project contact so the remaining work and materials can be accounted for.'] },
    { title: 'Service concerns.', paragraphs: ['If a service is not working as expected, share the affected service, relevant dates and a description of the issue. Any service-credit or refund request is reviewed under the commitments in your agreement.'] },
    { title: 'Making a request.', paragraphs: ['Email contact@laxitech.com with your order reference and the outcome you are requesting. The team can review the details and explain the next step.'] },
  ]} />;
}
