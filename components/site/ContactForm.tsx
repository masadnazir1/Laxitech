'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ActionArrow } from '@/components/ui/ActionArrow';
import { ENGINEERING_SERVICES } from '@/data/laxitechSite';
import { SplitRollText } from '@/components/ui/SplitRollText';

const OPTIONS = [...ENGINEERING_SERVICES.map((service) => ({ value: service.slug, label: service.name })), { value: 'VPS hosting', label: 'VPS & dedicated hosting' }, { value: 'GXMail', label: 'GXMail business email' }, { value: 'GXNotify', label: 'GXNotify notification API' }, { value: 'Not sure yet', label: 'Help me find the right approach' }];

export function ContactForm({ initialService = '' }: { initialService?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const customOption = initialService && !OPTIONS.some((item) => item.value === initialService);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('website')) return;
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message) { setError('Please add your name, email and a little about your project.'); return; }
    const service = String(data.get('service') || 'Not sure yet');
    const payload = {
      name,
      email,
      company: String(data.get('company') || '').trim(),
      service: OPTIONS.find((item) => item.value === service)?.label || service,
      budget: String(data.get('budget') || '').trim(),
      message,
    };
    try {
      sessionStorage.setItem('laxitech_project_brief', JSON.stringify(payload));
      setSubmitting(true);
      router.push('/contact/thank-you');
    } catch { setError('Your browser could not save the brief. Please email contact@laxitech.com directly.'); }
  };

  return <form className="site-contact-form" onSubmit={submit}><div className="site-form-heading"><h2>Tell us what you have in mind.</h2><p>A few details are enough to begin.</p></div><input name="website" type="text" tabIndex={-1} autoComplete="off" className="site-honeypot" aria-hidden="true" /><div className="site-form-two"><label>Your name<input name="name" autoComplete="name" placeholder="How should we address you?" required maxLength={100} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={200} /></label></div><label>What can we help with?<select name="service" defaultValue={initialService || 'Not sure yet'}>{customOption && <option value={initialService}>{initialService}</option>}{OPTIONS.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label><div className="site-form-two"><label>Company <span>Optional</span><input name="company" autoComplete="organization" placeholder="Your business or team" maxLength={120} /></label><label>Budget <span>Optional</span><input name="budget" placeholder="An estimate, if you have one" maxLength={80} /></label></div><label>A little about the project<textarea name="message" rows={5} placeholder="What are you looking to build or improve?" required maxLength={1600} /></label>{error && <p className="site-form-error" role="alert">{error}</p>}<div className="site-form-submit"><button type="submit" className="lx-primary-button" disabled={submitting}><SplitRollText text={submitting ? 'Preparing…' : 'Prepare enquiry'} /><ActionArrow /></button><p>Review your brief, then send it<br />by email or WhatsApp.</p></div></form>;
}
