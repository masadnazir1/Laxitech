import { PolicyPage } from '@/components/site/PolicyPage';
import { siteMetadata } from '@/lib/siteMetadata';

export const metadata = siteMetadata('Terms and conditions', 'General information about Laxitech project scope, ordering, ownership and support arrangements.', '/terms-and-conditions');

export default function TermsAndConditionsPage() {
  return <PolicyPage title="Terms & conditions." introduction="A clear scope and a shared agreement are the foundation of a good engagement." sections={[
    { title: 'Scope and service agreements.', paragraphs: ['Laxitech offers software engineering, cloud architecture, infrastructure, DevOps, automation and security engineering, alongside cloud hosting and GXMail business email.', 'The accepted proposal, order or project agreement defines the services being purchased, the contracting parties, deliverables, charges, timelines and responsibilities. Information on this website is an introduction to those services.'] },
    { title: 'Orders and billing.', paragraphs: ['Review the resources, billing period, renewal arrangements and any applicable charges before completing an order. Published product prices are shown in Pakistani Rupees where indicated.', 'Custom engineering is scoped individually. Payment schedules, milestones and changes to scope are agreed for the engagement.'] },
    { title: 'Ownership and handover.', paragraphs: ['Source-code ownership, licences, third-party components, access credentials and handover materials are defined in the project agreement. Confirm these details before work begins so the delivery matches your team’s needs.'] },
    { title: 'Operations and support.', paragraphs: ['Support coverage, maintenance, backups, recovery responsibilities and any service-level commitments depend on the service you order. The applicable agreement sets out these arrangements and any service-credit process.'] },
    { title: 'Responsible use.', paragraphs: ['Use hosted services and business email in accordance with the applicable service terms and law. Account holders are responsible for managing authorized users and access to their systems.', 'Discuss unusual workloads or configuration requirements with the team before ordering so the service can be assessed for the intended use.'] },
    { title: 'Questions and changes.', paragraphs: ['Contact us if a proposal, order or invoice is unclear. Changes to an active engagement should be discussed and recorded with the team responsible for delivery.'] },
  ]} />;
}
