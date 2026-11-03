'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GENERAL_FAQS } from '@/data/laxitechSite';
import { SectionHeading } from './Primitives';

export function Faq({ items = GENERAL_FAQS, title = 'A few good questions.' }: { items?: readonly { question: string; answer: string }[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const reduced = useReducedMotion();
  return <section className="site-section site-container site-faq" id="faqs" data-atmosphere="rays"><SectionHeading title={title} description="A little clarity before the first conversation." /><div className="site-faq-list">{items.map((item, index) => <div className="site-faq-item" key={item.question}><h3><button type="button" aria-expanded={open === index} aria-controls={`${id}-${index}`} onClick={() => setOpen(open === index ? null : index)}>{item.question}<span className="site-disclosure-icon" aria-hidden="true"><span /><span /></span></button></h3><AnimatePresence initial={false}>{open === index && <motion.div id={`${id}-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }} className="site-faq-answer"><p>{item.answer}</p></motion.div>}</AnimatePresence></div>)}</div></section>;
}
