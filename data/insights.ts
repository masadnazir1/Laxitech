export interface Insight {
  slug: string;
  title: string;
  headline: string[];
  category: string;
  description: string;
  sections: { title: string; paragraphs: string[] }[];
  relatedService: string;
}

export const INSIGHTS: Insight[] = [
  {
    slug: 'choosing-a-vps', title: 'Choosing a VPS for your workload', headline: ['Choose the', 'right VPS.'], category: 'Infrastructure',
    description: 'A practical way to think about compute, memory and storage before you choose a server.', relatedService: 'infrastructure',
    sections: [
      { title: 'Start with the application.', paragraphs: ['A server specification is only useful in the context of the work it needs to do. A small website, a database and a background processing service place different demands on the same resources.', 'List the processes you will run, the software they depend on and the traffic you expect. Include supporting services such as the database, cache and scheduled jobs. That gives you a starting point for a capacity conversation.'] },
      { title: 'Match the resource to the constraint.', paragraphs: ['CPU supports active computation. Memory gives applications and databases room to work. Storage capacity holds your files, while storage performance affects how quickly the system can read and write them. Bandwidth is another budget to consider for workloads that move a lot of data.', 'Watch these resources together. Adding CPU will not solve a memory shortage, and a larger disk will not fix an inefficient database query. Measure the application before deciding which resource needs attention.'] },
      { title: 'Plan for operation, not just launch.', paragraphs: ['Include backups, monitoring and a recovery process in the plan. Decide who maintains the operating system, who responds to alerts and how you will know when it is time to scale.', 'A sensible first configuration should leave room for normal variation without paying for capacity you do not yet need. Review the workload after launch and use actual measurements to guide the next step.'] },
    ],
  },
  {
    slug: 'planning-a-cloud-migration', title: 'A more considered cloud migration', headline: ['A considered', 'cloud migration.'], category: 'Cloud architecture',
    description: 'The useful decisions to make before moving an application into a new environment.', relatedService: 'cloud-architecture',
    sections: [
      { title: 'Map what the application depends on.', paragraphs: ['A migration rarely moves only one application. Databases, storage, DNS, scheduled tasks, third-party services and access policies are part of the same working system.', 'Document those dependencies and identify which components need to move together. Speak to the people who operate the application as well as the people who built it. Their day-to-day knowledge often reveals requirements that are missing from a diagram.'] },
      { title: 'Agree on recovery and validation.', paragraphs: ['Decide how much interruption the business can tolerate and what data recovery would look like. These decisions shape the migration method, the order of work and the resources needed for the transition.', 'Define the checks that tell you the move has succeeded. They should include real user journeys, integrations, data consistency and operational visibility. Write down a rollback path before the cutover, with clear responsibility for the decision.'] },
      { title: 'Make the new environment operable.', paragraphs: ['The destination should come with monitoring, access controls, backups and a clear deployment process. A successful cutover is the beginning of operating the new environment, not the end of the work.', 'Review capacity and cost after the workload has settled. The architecture should be understandable to the people maintaining it, and the handover should include the decisions that matter when something changes.'] },
    ],
  },
  {
    slug: 'business-email-authentication', title: 'Your business domain and trusted email', headline: ['Your domain.', 'Trusted email.'], category: 'Business email',
    description: 'What SPF, DKIM and DMARC do, and why they belong in a business email setup.', relatedService: 'security-engineering',
    sections: [
      { title: 'Your domain is part of your identity.', paragraphs: ['A business email address ties a conversation to your own domain. The setup also needs a way for receiving services to distinguish legitimate sending from a message that only claims to come from your organization.', 'Domain authentication is part of that foundation. It does not guarantee that every message reaches an inbox, but it gives receiving systems information they can use when evaluating your mail.'] },
      { title: 'Three records with different jobs.', paragraphs: ['SPF describes which sending systems are authorized for a domain. DKIM adds a cryptographic signature that can be checked using a public key published in DNS. DMARC builds on authentication and alignment to define a handling policy and reporting.', 'Configure these records for the services that actually send on behalf of your business. That may include your mail platform and, separately, transactional mail or approved business tools. Keep the inventory up to date as those services change.'] },
      { title: 'Treat email as an operating system.', paragraphs: ['Use appropriate mailbox permissions, secure access and a process for adding and removing team members. Make sure the people supporting the service know where domain settings and recovery procedures live.', 'Review changes carefully when moving email providers. Domain records, existing mail, user access and connected applications all need attention. A guided setup helps turn these pieces into a service your team can rely on.'] },
    ],
  },
];

export const INSIGHT_ALIASES: Record<string, string> = {
  'multi-cloud-resilience-failover': 'planning-a-cloud-migration',
  'pakistan-hosted-vps-low-latency': 'choosing-a-vps',
  'gxmail-spf-dkim-dmarc-deliverability': 'business-email-authentication',
  'iso-27001-soc-2-compliance': 'business-email-authentication',
  'finops-cloud-cost-reduction': 'planning-a-cloud-migration',
  'bare-metal-virtualization-proxmox': 'choosing-a-vps',
};
