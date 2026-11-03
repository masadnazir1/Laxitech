'use client';

import React, { useState } from 'react';
import {
  SplitHeadingReveal,
  RevealGroup,
} from '@/components/ui/PagePrimitives';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: 'How quickly can a Laxitech engineering team onboard to our project?',
    answer:
      'Typically within 1–2 weeks following discovery and contract execution. For urgent infrastructure stabilization, security audits, or critical cloud migrations, we can mobilize senior solution architects within 48 hours.',
  },
  {
    id: 2,
    question: 'Do you sign NDAs before initial discovery discussions?',
    answer:
      'Yes, absolutely. We execute mutual non-disclosure agreements before reviewing proprietary codebases, system architecture diagrams, or confidential business specifications.',
  },
  {
    id: 3,
    question: 'Which cloud platforms and infrastructure stacks do you support?',
    answer:
      'We are certified multi-cloud architects specializing in Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure, as well as private virtualization environments (Proxmox, VMware, Linux KVM) and bare-metal dedicated servers.',
  },
  {
    id: 4,
    question: 'How do you handle pricing and contract structures?',
    answer:
      'We offer three transparent engagement models: Time & Materials (sprint-based), Fixed-Price Milestone Contracts for clearly defined scopes, and Dedicated Engineering Teams on predictable monthly retainers.',
  },
  {
    id: 5,
    question: 'What are the key advantages of Pakistan Hosted VPS with NVMe?',
    answer:
      'Our Pakistan-hosted VPS infrastructure delivers sub-5ms local latency, satisfies domestic data sovereignty requirements, allows billing directly in PKR without foreign transaction fees, and runs on high-throughput Enterprise NVMe SSD storage with a 99.9% network uptime guarantee.',
  },
  {
    id: 6,
    question: 'How does GXMail ensure email deliverability and security?',
    answer:
      'GXMail provides dedicated SPF, DKIM, and DMARC DNS authentication for your custom domain (@yourcompany.com), automated anti-spam and phishing protection, TLS encryption on all SMTP/IMAP connections, and 99.9% SLA uptime.',
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="bg-bg py-[clamp(80px,9vw,120px)]">
      <div className="mx-auto max-w-[1380px] px-6 md:px-8">
        
        {/* Centered Heading with Editorial Accent */}
        <SplitHeadingReveal triggerOnScroll={true}>
          <h2 className="text-center font-display text-[clamp(38px,5vw,72px)] leading-[1] font-medium tracking-[-0.05em] text-fg">
            Common <span className="vv-accent">Questions</span>
          </h2>
        </SplitHeadingReveal>

        {/* Accordion Container */}
        <RevealGroup className="mx-auto mt-[70px] flex max-w-[880px] flex-col gap-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                data-reveal="true"
                data-faq-row="true"
                className="rounded-[12px] border border-line px-4"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    onClick={() => toggleItem(item.id)}
                    className="group flex w-full cursor-pointer items-center gap-6 py-[13px] text-left"
                  >
                    <span className="flex-1 font-text text-[16px] leading-[1.8] font-normal text-fg-strong transition-colors group-hover:text-fg">
                      {item.id}. {item.question}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`size-[10px] shrink-0 text-fg-muted transition-transform duration-500 ease-brand ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m2 7 10 10L22 7" />
                    </svg>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${idx}`}
                  role="region"
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-brand ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pr-10 pb-[18px] text-[16px] leading-[1.6] text-fg-muted">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </RevealGroup>

      </div>
    </section>
  );
}
