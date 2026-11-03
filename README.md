# Laxitech — marketing & product site

Production-style marketing site for **Laxitech** (enterprise software, cloud architecture and
Pakistan-hosted infrastructure), plus the product pages for **NVMe Cloud VPS** and **GXMail**
business email.

Built with **Next.js 16.4.3 (App Router)**, **React 19**, **TypeScript (strict)**, **Tailwind CSS 4**,
**Motion**, **GSAP**, **Lenis** and **Three.js**.

> **Starting on this project? Read [`HANDOVER.md`](./HANDOVER.md) first.**
> It is the onboarding guide: setup, architecture, rules, where to edit, and how to verify.
> [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) is the deeper historical log of the design
> refinement work and the decisions behind it.

---

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | **>= 20.9** (Next.js 16 requirement; tested on 22.23) |
| npm | 10+ (a `package-lock.json` is committed) |
| Bun | optional — `bun.lock` is also present, but npm is the verified path |

No environment variables are required to run the marketing site. `.env.example` is a leftover
AI Studio template (`GEMINI_API_KEY`, `APP_URL`) and is not read by any code in `app/`,
`components/`, `lib/` or `data/`. Do not add secrets to the repository.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Production-style local preview (standalone server, port 3001):

```bash
npm run build
npm run preview      # http://localhost:3001
```

`npm run preview` runs `scripts/preview.mjs`, which recreates the relative symlinks
`standalone/public` and `standalone/.next/static` when missing, then starts the standalone
server. Rebuild before previewing after code changes.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server on port 3000 |
| `npm run build` | Production build (Turbopack, `output: 'standalone'`) |
| `npm run start` | Start the standard production server |
| `npm run preview` | Build output → standalone server on port 3001 |
| `npm run lint` | ESLint (zero warnings is the project standard) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | `node --test` over `data/*.test.ts` and `lib/*.test.ts` (34 tests) |
| `npm run clean` | `next clean` |

Quality gates used by the project:

```bash
npm test
npm run typecheck
npm run lint -- --max-warnings 0
npm run build
```

## Routes

Canonical pages (all in `app/`):

| Route | Purpose |
| --- | --- |
| `/` | Home: hero laptop, technology logos, services, products/pricing, capability chapters, process, FAQ |
| `/services` | Engineering practice directory |
| `/services/[slug]` | Six service detail pages (`software-engineering`, `cloud-architecture`, `infrastructure`, `devops-automation`, `ai-automation`, `security-engineering`) |
| `/solutions` | Three engagement tracks |
| `/products` | Product switcher (cloud / GXMail) |
| `/products/vps` | VPS plans, features, FAQ |
| `/products/gxmail` | GXMail pricing, features, onboarding, FAQ |
| `/about` | Team position, values, process |
| `/insights` | Three long-form engineering guides |
| `/insights/[slug]` | Guide detail |
| `/contact` | Enquiry form (prepares a brief, then email/WhatsApp handoff) |
| `/contact/thank-you` | Brief review + send actions (`noindex`) |
| `/privacy-policy`, `/terms-and-conditions`, `/refund-policy` | Shared `PolicyPage` layout |

Legacy aliases redirect permanently to canonical routes (see `docs/ARCHITECTURE.md`).
`/design-preview` is a `noindex` hero study and is not part of the public navigation.

## Repository map

```
app/                 routes, layout, global CSS, sitemap, OG image
components/
  layout/            Navbar, Footer, RoutePreloader
  motion/            MotionProvider (Lenis), LiveAtmosphereField (WebGL), primitives
  sections/          home sections (hero laptop, capability stage, legacy works)
  site/              shared site UI (services, products, FAQ, process, policy, forms)
  illustrations/     EngineeringIllustration + ProcessIllustration
  theme/             ThemeProvider (dark/light/system, localStorage)
  ui/                shared buttons, text effects, legacy shader components
data/                all editorial and product content (single source of truth)
lib/                 pure helpers (hero timing, hardware tier, metadata, motion math)
public/              fonts, models, hero posters, illustrations, media
scripts/preview.mjs  standalone preview launcher
docs/                onboarding documentation (this handover)
```

See [`docs/FILE-MAP.md`](./docs/FILE-MAP.md) for a file-by-file guide and which components are
legacy/unused.

## Documentation index

| Document | Contents |
| --- | --- |
| [`HANDOVER.md`](./HANDOVER.md) | **Start here.** Setup, mental model, editing rules, verification, handover checklist |
| [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) | Deep history of the design/refinement work, measured results, open items |
| [`LAXITECH_CUSTOM_INSTRUCTIONS.md`](./LAXITECH_CUSTOM_INSTRUCTIONS.md) | Brand/art-direction brief and original six-phase roadmap |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Routes, aliases, providers, rendering model, data flow |
| [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md) | Tokens, typography, themes, motion budgets, illustration system |
| [`docs/CONTENT-RULES.md`](./docs/CONTENT-RULES.md) | Honesty rules, banned claims, tone, product facts, SEO |
| [`docs/RUNBOOK.md`](./docs/RUNBOOK.md) | Local dev, preview, gates, deployment, troubleshooting |
| [`docs/FILE-MAP.md`](./docs/FILE-MAP.md) | Every important file, plus legacy/dead code |
| [`docs/ROADMAP-AND-RISKS.md`](./docs/ROADMAP-AND-RISKS.md) | Known issues, technical debt, next steps |

## House rules (short version)

- **Truth over polish.** No invented clients, dashboards, certifications, SLAs, guarantees or
  "live" backend activity. Every number on the site must be a real, owned product fact.
- **One system per pattern.** Reuse `EngineeringIllustration`, `SelectionControl`, `PolicyPage`,
  `SiteButton`, `Reveal` — do not fork one-off variants.
- **Reduced motion is a real mode.** Every animation must stop or settle under
  `prefers-reduced-motion: reduce`, and must not block content.
- **No git repository is present** in the delivered working tree. Treat it as the single source
  of truth; do not run destructive cleanup commands.
- The contact form is a **frontend brief builder**: it prepares a `mailto:`/WhatsApp message.
  There is no server-side mail API.

## License

See [`LICENSE`](./LICENSE). Fonts and third-party artwork have their own terms; provenance for the
process illustrations is recorded in `public/illustrations/process/sources.json`.
