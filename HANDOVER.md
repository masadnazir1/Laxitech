# Laxitech — Developer Handover

**Last updated:** 2026-11-03
**Status:** feature-complete for the agreed localhost scope; production build and browser
acceptance were verified before handover. This document is the practical onboarding guide.
For the full design/refinement history and measured results, read
[`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).

---

## 1. What this project is

A Next.js 16 (App Router) marketing and product site for **Laxitech**, an engineering company
offering custom software, cloud architecture, IT infrastructure, DevOps, AI automation and
security engineering. It also sells two products:

- **NVMe Cloud VPS** — Pakistan-hosted plans at PKR 999 / 1,799 / 3,299 per month.
- **GXMail** — business email on the customer's domain at PKR 250/month or 2,999/year.

The site's job is credibility and enquiry generation. The contact flow does **not** submit to a
backend; it builds a project brief, stores it in `sessionStorage`, and hands off to email or
WhatsApp. Keep that honest.

**Primary conversion:** `/contact` (and `?service=` deep links from every service page).
**Secondary:** external cloud portal and GXMail signup links in `data/laxitechSite.ts`.

## 2. First 30 minutes

```bash
# 1. Install (Node >= 20.9)
npm install

# 2. Run the dev server
npm run dev            # http://localhost:3000

# 3. Open the site, switch theme (navbar), resize to 390px, toggle reduced motion
```

Then read, in this order:

1. `app/layout.tsx` — providers, global CSS, metadata, ambient field.
2. `app/page.tsx` — how the home page composes sections.
3. `data/laxitechSite.ts` — the content model (services, plans, FAQs, solution tracks).
4. `components/site/ServicesShowcase.tsx` and `components/site/ProductPreviews.tsx` — the main
   interactive patterns.
5. `components/motion/LiveAtmosphereField.tsx` — the global WebGL background.
6. `components/sections/hero/MacBookCanvas.tsx` + `lib/heroScene.ts` — the hero entrance.
7. `app/site.css`, `app/hero.css`, `app/illustrations.css` — the visual system.

## 3. Mental model

```
app/layout.tsx
├── ThemeProvider        localStorage['vv-theme'] → html[data-theme]
├── MotionProvider       Lenis smooth scroll + MotionConfig(reducedMotion: 'user')
│   ├── LiveAtmosphereField   fixed WebGL canvas, scene chosen by [data-atmosphere]
│   ├── RoutePreloader        page-transition curtain
│   ├── Navbar / <main> / Footer
└── pages render section components
```

- **Server components by default.** Only interactive pieces are `'use client'` (55 files).
- **Content lives in `data/`.** Pages and sections import typed constants; avoid hardcoding copy
  in JSX unless it is structural (headings, labels).
- **Styling lives in four CSS files**, not Tailwind utility soup. Tailwind 4 is imported in
  `app/globals.css`; the design system itself is semantic classes plus `--lx-*` / `--vv-*`
  custom properties.
- **Themes are CSS-variable swaps** on `html[data-theme='dark'|'light']`. No JS style objects for
  color, and no flash: an inline script in `layout.tsx` sets the theme before paint.
- **One global WebGL context** (`LiveAtmosphereField`) plus one section WebGL canvas
  (`KexsioThreads`). Do not add more unexplained contexts; mobile GPUs are the constraint.
- **Every section that needs a specific atmosphere** declares `data-atmosphere="aurora|beams|silk|
  threads|mesh|rays"`. The field picks the region closest to the viewport centre and crossfades.

## 4. Where to change things

| I want to change… | Edit |
| --- | --- |
| Company name, email, phone, portal URLs | `data/laxitechSite.ts` → `SITE` |
| Services (copy, stack, deliverables, nodes) | `data/laxitechSite.ts` → `ENGINEERING_SERVICES` |
| VPS plans / prices | `data/laxitechSite.ts` → `VPS_PLANS` (used by `VpsPricing`) |
| GXMail price | `components/site/ProductPreviews.tsx` → `MailPricing` (`250` / `2,999`) |
| Delivery process steps + art mapping | `data/laxitechSite.ts` → `DELIVERY_STEPS` |
| FAQs | `data/laxitechSite.ts` → `GENERAL_FAQS`, `CLOUD_FAQS`, `MAIL_FAQS` |
| Insights / guides | `data/insights.ts` → `INSIGHTS` (+ aliases) |
| Home hero copy / service tabs | `data/heroExperience.ts` → `HERO_COPY`, `HERO_SERVICES` |
| Nav / footer links | `components/layout/Navbar.tsx`, `components/layout/Footer.tsx` |
| Policy pages | `app/*-policy/page.tsx` → shared `components/site/PolicyPage.tsx` |
| Metadata / canonical URL | `lib/siteMetadata.ts`, `app/layout.tsx`, `data/laxitechSite.ts` |
| Sitemap | `app/sitemap.ts` |
| Social/OG image | `app/opengraph-image.tsx` |
| Global colors / type tokens | `app/globals.css`, `app/hero.css` |
| Section layout | `app/site.css` |
| Illustration scenes | `components/illustrations/EngineeringIllustration.tsx` + `app/illustrations.css` |
| Background scenes | `components/motion/LiveAtmosphereField.tsx` |

### Adding a service

1. Append an entry to `ENGINEERING_SERVICES` in `data/laxitechSite.ts` with a unique `slug` and a
   `kind` from `ServiceKind`.
2. Add an alias only if an old URL must redirect (`SERVICE_ALIASES`).
3. `app/services/[slug]/page.tsx` generates the page automatically; no new file needed.
4. If the new `kind` needs a new illustration scene, extend `EngineeringIllustration` and the
   `kind` union; otherwise reuse an existing scene.
5. Run `npm test` (data tests may assert counts/slugs) and `npm run typecheck`.

### Adding an insight

1. Append to `INSIGHTS` in `data/insights.ts` (`slug`, `headline`, `sections`, `relatedService`).
2. `app/insights/[slug]/page.tsx` and `app/sitemap.ts` pick it up automatically.
3. If you need a legacy URL, add it to `INSIGHT_ALIASES`.

### Changing prices

Prices appear in two places by design: `VPS_PLANS` (home + VPS page) and `MailPricing` (home +
GXMail page). Update both and check `data/*.test.ts` expectations. Do not invent "starting at"
figures elsewhere.

## 5. Non-negotiable content rules

These were deliberately enforced during the refinement pass. Reintroducing them makes the site
dishonest.

**Banned claims and patterns**

- ISO 27001 / SOC 2 certification claims, "Silicon Valley HQ", "Tier III" data-centre claims,
  "99.99% SLA/target", "150+", "24/7" stat tiles.
- Refund guarantees ("7-day", "14-day", "100% refundable"), "zero-spam".
- "Most popular" pricing badges.
- Fake dashboards, fake console/mail screenshots, fake playback states, or any copy implying a
  live backend is running in the browser.
- Invented clients, testimonials, logos, case studies or performance numbers.

**Allowed**

- Real product facts (plan resources, prices, included features) sourced from the business.
- Clearly interactive-but-honest previews (visitor types their own domain; plan selector changes
  numbers).
- Animation as a design choice — motion may look alive, copy must not claim live monitoring.

**Tone:** direct, calm, specific. Short headlines (≤ 2 lines), one idea per paragraph, no hype
adjectives. British spelling is used in body copy ("organisation", "modernise") — stay consistent.

**Forms:** the enquiry form collects name, email, company, service, budget and message, stores the
brief in `sessionStorage['laxitech_project_brief']`, then routes to `/contact/thank-you` where the
visitor sends it by email or WhatsApp. Never claim the message was submitted automatically.

## 6. Design system in one page

- **Type:** GT Walsheim (`--font-walsheim`, display), Geist (`--font-geist`, body/UI), Fraunces
  (editorial accents). Self-hosted in `public/fonts`, declared in `app/globals.css`.
- **Color:** dark obsidian ground + electric blue accent (`--lx-accent`, `--lx-action`); secondary
  violet `--vv-cynex-purple`. All colors are theme-scoped CSS variables.
- **Surfaces:** hairline borders, generous whitespace, selective glass (`--lx-glass`,
  `--lx-glass-border`) only where the brief asks for depth (nav, hero copy plate, service art,
  product interface, selectors, open FAQ).
- **Section rhythm:** `.site-section` + `.site-container`; seamless backgrounds (no boundary
  lines). Do not wrap sections in opaque cards.
- **Shared primitives:** `Reveal`, `SectionHeading`, `PageIntro`, `PageClose`, `SiteButton`,
  `SelectionControl`, `TransitionPanel`, `SplitRollText`, `ActionArrow`, `Magnetic`, `TextEffect`.
- **Illustrations:** one `EngineeringIllustration` component with 8 scenes
  (`software, cloud, vps, infrastructure, automation, devops, security, mail`) and one
  `ProcessIllustration` for the 4 CC0 clay renders. Reuse them; don't draw new one-offs.
- **Motion timings:** `--lx-motion-fast: 160ms`, `--lx-motion-main: 380ms`,
  `--lx-motion-ease: cubic-bezier(0.22, 1, 0.36, 1)`. Character rolls ~340ms, stagger capped at
  80ms. Magnetic travel capped at 5px/4px.
- **Reduced motion:** `MotionConfig reducedMotion="user"`, `useReducedMotion()` guards,
  media-query CSS fallbacks, WebGL fields render a still frame. Test with DevTools → Rendering →
  Emulate `prefers-reduced-motion`.

Full details: [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md).

## 7. Runtime budgets and performance

| Surface | Budget / behavior |
| --- | --- |
| `LiveAtmosphereField` | 1 WebGL context; 24 fps desktop, 18 coarse pointer, 12 software; buffer capped 1180/900/620px; pauses on hidden tab, route transition; still under reduced motion |
| `KexsioThreads` | 1 section-level WebGL context; 30/20/18 fps caps; 24 lines; buffer capped 1100/560px; paused offscreen/hidden/route transition |
| Hero GLB | `public/models/studio-macbook-scene.glb` (~1.8 MB); loaded client-side; posters cover the loading gap |
| Particles (legacy) | `AmbientParticleField` is retained but **not imported**; it is superseded by `LiveAtmosphereField` |
| Scroll | Lenis lerp `0.12`, anchor offset `-104`, `stopInertiaOnNavigate`; scroll lock synced via `MutationObserver` |
| Images | `next/image` where practical; hero posters and process art are pre-sized WebP |

When adding motion: cap the frame rate, pause when offscreen/hidden, stop under reduced motion,
and avoid creating a new renderer per section.

## 8. Verify before you hand anything back

```bash
npm test                          # 34 unit tests (data + lib)
npm run typecheck                 # strict TS, no emit
npm run lint -- --max-warnings 0  # zero warnings
npm run build                     # production build
npm run preview                   # serve standalone build on :3001
```

Manual checklist (desktop + 390px):

- Hero: laptop lid opens, screen content is readable, replay works, no layout shift.
- Theme toggle: dark ↔ light, all sections remain legible, no flash on reload.
- Navbar: mobile menu opens/closes, focus returns, `aria-current` on active route.
- Services rows and FAQ: one panel open at a time, keyboard operable.
- Product switcher, VPS plan view, GXMail billing toggle: numbers match `data/`.
- Contact: submit → thank-you → email/WhatsApp links contain the encoded brief.
- Reduced motion: no continuous animation, content visible immediately.
- 320px: no horizontal scroll; text does not overlap.
- No console errors, no React hydration warnings.

## 9. Deployment notes

- `next.config.ts` uses `output: 'standalone'`. Deploy `.next/standalone` plus `public/` and
  `.next/static` (or use the standard `next start` path if your host prefers it).
- `SITE.url` is `https://laxitech.com`; metadata, canonical URLs and the sitemap depend on it.
  Change it in one place (`data/laxitechSite.ts`) before deploying to a different domain.
- Security headers are set in `next.config.ts`: `X-Frame-Options: SAMEORIGIN`, `nosniff`,
  referrer policy, permissions policy and a baseline CSP (`base-uri`, `object-src`,
  `frame-ancestors`, `form-action`). It is **not** a strict script-src/nonce CSP; adding one
  requires a deliberate rendering/deployment decision.
- Public assets get `max-age=86400, stale-while-revalidate=604800`; HTML keeps Next's cache
  semantics. The contact page is dynamic.
- Only the local preview has been approved so far. Validate HTTPS/CDN behavior, Firefox/Safari
  and real devices before a public launch claim.

## 10. On-disk state and source control

- **There is no git repository in this working tree.** There is no history to restore from.
  Do not run `rm -rf`, `git clean`, or bulk move/delete operations without an explicit backup.
- `node_modules/` and `.next/` are build artifacts and are excluded from the handover ZIP.
- `.mcp.json`, `.env*` and `.opencode/` may contain credentials or local integration state; they
  are intentionally excluded from the ZIP. Never paste their contents into docs, logs or chat.
- `.aistudio/legacy-pages/` contains pre-refinement page sources for comparison. It is gitignored
  but useful; keep it.

## 11. Known issues and next steps

See [`docs/ROADMAP-AND-RISKS.md`](./docs/ROADMAP-AND-RISKS.md). The short list:

1. 32 moderate advisories in **development-only** tooling (Firebase CLI, ESLint/TS tooling,
   typography). Production dependencies audit clean; do not blanket `npm audit fix --force`.
2. Cross-browser/device validation (Firefox, Safari, real phones) and HTTPS/CDN checks are still
   external-release work.
3. `AmbientParticleField`, `WorksSection`, `ServiceMotionVisual`, `StudioEditor`, `TechStack`,
   `PricingSection`, `TestimonialsSection` and other AI Studio-era components are unused legacy
   code. Remove only with user confirmation and after checking imports/tests.
4. The contact form is client-side only by design. If a real backend is added, update the copy,
   the confirmation screen and the privacy policy together.
5. The design-taste inspector's geometric eyebrow heuristic can flag the service CTA; verify with
   screenshots before "fixing" copy.

## 12. Handover checklist

- [ ] `npm install` completes on Node >= 20.9.
- [ ] `npm run dev` serves the home page without console errors.
- [ ] `npm test`, `npm run typecheck`, `npm run lint -- --max-warnings 0` pass.
- [ ] `npm run build` succeeds and `npm run preview` serves port 3001 with assets.
- [ ] Prices and product copy match the business's current offer.
- [ ] `SITE` values (email, phone, portals, URL) are correct.
- [ ] No secret files (`.env*`, `.mcp.json`, `.opencode/`) are committed or shared.
- [ ] Legal pages reviewed by the business (they are neutral templates, not legal advice).
- [ ] Real device/browser pass completed before public launch.
