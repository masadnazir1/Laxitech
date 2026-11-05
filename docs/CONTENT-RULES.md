# Content Rules & Editorial Guide

> This site's credibility is its main design asset. The content rules below are not stylistic
> preferences; they were enforced deliberately during a full refinement pass.

## 1. The honesty rule

Everything shown must be one of:

1. A **true product fact** the business owns (plan resources, prices, included features).
2. A **clearly interactive preview** (the visitor changes it; it is not a recording).
3. **Design motion** that does not claim operational reality.

If a visual implies a live backend, a real customer, a certification or a measured guarantee that
the business cannot stand behind, it does not ship.

## 2. Banned claims and patterns

Do **not** reintroduce these (they were removed for being unverifiable or misleading):

- ISO 27001, SOC 2, or any unheld certification/compliance claim.
- "Silicon Valley HQ", "Tier III data centre", "99.99% SLA/target", "150+", "24/7".
- "7-day refund", "14-day refund", "100% refundable", "zero-spam".
- A "Most popular" pricing badge.
- Fake dashboards, fake console/mail screenshots, fake playback states.
- Copy implying the browser is running real infrastructure or live monitoring.
- Invented clients, testimonials, logos, case studies, awards or performance metrics.
- "Technologies Inc." or other invented legal entities.

> **Careful:** `LAXITECH_CUSTOM_INSTRUCTIONS.md` is the original art-direction brief and still
> contains some of these older claims (dual Tier III, 100% deliverability, 99.99% SLA). Treat it as
> historical context, **not** as approved copy. The live site's copy is the approved state.

## 3. Approved product facts

### NVMe Cloud VPS

| Plan     | Price (PKR/mo) | vCPU    | RAM  | NVMe   | Bandwidth |
| -------- | -------------- | ------- | ---- | ------ | --------- |
| Starter  | 999            | 1 core  | 2 GB | 30 GB  | 1 TB      |
| Business | 1,799          | 2 cores | 4 GB | 60 GB  | 2 TB      |
| Pro      | 3,299          | 4 cores | 8 GB | 120 GB | 4 TB      |

Positioning: Pakistan-hosted, local-currency billing, NVMe storage, workload-fit sizing, custom
configurations and dedicated servers on request. Do not add latency, uptime or customer numbers.

### GXMail

| Plan         | Monthly | Yearly | Domains | Mailboxes | Shared storage | Mailbox storage         | SMTP credentials | GNotify | Support                   |
| ------------ | ------- | ------ | ------- | --------- | -------------- | ----------------------- | ---------------- | ------- | ------------------------- |
| Starter      | 250     | 3,000  | 1       | 15        | 30 GB          | 2 GB per mailbox        | 5                | None    | Email                     |
| Business     | 333     | 3,999  | 3       | 20        | 60 GB          | 3 GB per mailbox        | 15               | 10%     | Email + WhatsApp          |
| Business Pro | 500     | 5,999  | 5       | Unlimited | 200 GB         | 5 GB default, flexible  | 20               | 20%     | Priority email + WhatsApp |

- Own domains, professional mailboxes, secure SMTP/IMAP, SPF/DKIM/DMARC, webmail and an
  administration portal.
- Storage is shared across a workspace. Business Pro's "Unlimited" value applies to mailbox count,
  not storage; its 200 GB shared-storage limit still applies.
- Do not claim "100% inbox deliverability" or "unlimited storage".
- Source: `gxmail-admin-frontend/src/app/core/services/mock-fixtures.ts` and the GXMail public plans
  endpoint, verified 2026-11-05.

### GXNotify

| Plan         | Monthly (PKR) | Projects | Email notifications | FCM push | SMS credits | API keys | Templates | Support                          |
| ------------ | ------------- | -------- | ------------------- | -------- | ----------- | -------- | --------- | -------------------------------- |
| Starter      | 500           | 1        | 200                 | 100      | 50          | 10       | 5         | Standard                         |
| Business     | 1,999         | 10       | 100,000             | 10,000   | 500         | 20       | 50        | Dedicated email                  |
| Business Pro | 3,999         | 50       | 300,000             | 30,000   | 1,000       | 30       | 200       | Priority dedicated email         |

- Channels: transactional email over the customer's SMTP, SMS through their gateway, and FCM push
  through their Firebase project. One notification model, API keys, templates, subscribers,
  opt-out state, bounded retries, dead-letter handling, signed webhooks and delivery history.
- Quotas apply per monthly billing period. Channel availability depends on the providers the
  customer configures for each project; record those limits honestly rather than promising
  universal delivery.
- Source: `gxnotify/src/config/billing-plans.ts`, its billing-plans test and the GXNotify
  production marketing page, verified 2026-11-05.

### Company

- Email: `contact@laxitech.com`
- Phone: `+92 334 151369`
- WhatsApp: `https://wa.me/923408882796`
- Cloud portal: `https://cloud.galaxydev.pk/#pricing`
- Mail signup/login: `https://manage.galaxydev.pk`
- Webmail: `https://webmail.galaxydev.pk`
- GXNotify sign-in: `https://gxnotify.galaxydev.pk/sign-in`
- GXNotify sign-up: `https://gxnotify.galaxydev.pk/sign-up`
- GXNotify dashboard: `https://gxnotify.galaxydev.pk/dashboard`

Source of truth: `data/laxitechSite.ts` → `SITE`.

## 4. Tone and style

- Direct, calm, specific. Write like an engineer explaining a decision, not a sales page.
- Short headlines: at most two lines. One idea per paragraph.
- Prefer concrete nouns and verbs over hype ("we scope the migration", not "we unlock synergy").
- British spelling in body copy: _organisation, modernise, prioritise, centre, behaviour_.
  Product names and technical terms keep their own spelling.
- Do not use em-dash-heavy marketing cadence; commas and full stops are fine.
- Sentence case for headings, except the large display lines which are written as short phrases.

Examples of approved voice:

> "Your processes should shape your software."
> "A sensible first configuration should leave room for normal variation without paying for
> capacity you do not yet need."
> "Your enquiry is sent when you complete the message in your email or WhatsApp app."

## 5. Contact flow wording

The form is a **brief builder**, not a submission:

1. Visitor fills the form on `/contact`.
2. Values are validated client-side (name, email, message required; honeypot field ignored).
3. The brief is stored in `sessionStorage['laxitech_project_brief']`.
4. `/contact/thank-you` shows the brief and offers **Send by email**, **Send by WhatsApp**, and
   **Copy the brief**.
5. The message is only sent when the visitor completes the action in their mail/WhatsApp app.

Never write "we received your message", "your enquiry has been submitted", or "our team will
reply shortly" — the site cannot know that. The current note is correct:
_"Your enquiry is sent when you complete the message in your email or WhatsApp app."_

## 6. Services copy model

Each `ENGINEERING_SERVICES` entry has:

- `headline` — two short display lines.
- `summary` — one sentence for cards/index.
- `introduction` — a short paragraph for the detail page.
- `deliverables` — four concrete capabilities with one-sentence descriptions.
- `stack` — technologies actually used in that practice (no logo stuffing).
- `outcome` — one sentence describing what the client ends up with.
- `nodes` — three labels for the 2.5D diagram.

Keep new services in the same shape. Do not add "starting at" prices to service pages.

## 7. Insights

`INSIGHTS` entries are long-form, practical guides:

- 3 sections, 2 paragraphs each (current pattern).
- No listicles, no unsupported statistics, no product pitch inside the body.
- `relatedService` must match a real service `kind` so `PageClose` deep-links correctly.
- Legacy URLs go in `INSIGHT_ALIASES`, never as duplicate content.

## 8. SEO metadata

- Every page uses `siteMetadata(title, description, path)` from `lib/siteMetadata.ts`.
- Titles are specific and under ~60 characters where possible; descriptions are one honest
  sentence (~150–160 characters).
- Canonicals are absolute and derived from `SITE.url`.
- `noindex` pages: `/contact/thank-you`, `/design-preview`.
- The sitemap is generated from `data/` by `scripts/generate-sitemap.mjs` into
  `public/sitemap.xml`; adding content adds URLs on the next install, dev or build run.
- OG image: `app/opengraph-image.tsx` at 1200×630. If the brand changes, update it there.

## 9. Legal pages

`/privacy-policy`, `/terms-and-conditions`, `/refund-policy` share
`components/site/PolicyPage.tsx`. The copy is neutral and agreement-based; it is **not legal
advice** and should be reviewed by the business before launch. If a real backend, analytics or
payment flow is added, update the privacy policy and the contact copy at the same time.

## 10. Content review checklist

- [ ] No banned claim from §2.
- [ ] Every number matches `data/laxitechSite.ts` or `ProductPreviews.tsx`.
- [ ] No invented person, client or logo.
- [ ] Contact copy describes a brief handoff, not a server submission.
- [ ] Headline fits on two lines at 1440px and 390px.
- [ ] Both themes have readable contrast.
- [ ] Spelling matches the British-English convention.
