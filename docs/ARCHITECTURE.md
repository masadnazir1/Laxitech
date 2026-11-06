# Architecture

## 1. Rendering model

- **Next.js 16 App Router**, React Server Components by default. 55 files are client components
  (`'use client'`) — only things that need state, effects, browser APIs or Motion.
- **Static generation** for marketing pages and content pages. Dynamic/param routes generate
  static params from `data/` (`app/services/[slug]`, `app/insights/[slug]`, aliases).
- **No API routes and no server actions.** The contact flow is entirely client-side.
- **`output: 'standalone'`** so the production build can run without `node_modules`.
- **`reactStrictMode: false`** is intentional (AI Studio-era setting). Do not flip it casually;
  double-invoked effects can restart the WebGL/GLB lifecycle.

## 2. Provider and layout tree

`app/layout.tsx`:

```
<html lang="en" data-theme="dark" data-currency="usd">
  <head> inline theme bootstrap script </head>
  <body class="bg-bg text-fg font-sans antialiased">
    skip link
    Organization JSON-LD
    <ThemeProvider>
      <MotionProvider>            // ReactLenis root + MotionConfig
        <LiveAtmosphereField />   // fixed full-screen WebGL canvas
        <RoutePreloader />        // route curtain
        <Navbar />
        <main id="vv-main">{children}</main>
        <Footer />
      </MotionProvider>
    </ThemeProvider>
  </body>
</html>
```

### Theme bootstrap

The inline script reads `localStorage['vv-theme']` (`dark`, `light`, `system`), resolves `system`
against `prefers-color-scheme`, sets `html[data-theme]` and `colorScheme` before paint, and
restores `localStorage['vv-currency']` (`pkr`/`usd`). `ThemeProvider` then owns runtime changes.
The theme toggle uses the View Transitions API with a circular reveal from the button, falling
back to an instant switch when unsupported or under reduced motion.

### Smooth scroll

`MotionProvider` mounts `ReactLenis` with:

```ts
{ autoRaf: true, lerp: 0.12, smoothWheel: true, syncTouch: false,
  anchors: { offset: -104 }, stopInertiaOnNavigate: true,
  respectReducedMotion: true, prevent: node => node.hasAttribute('data-lenis-prevent') }
```

`ScrollLifecycle` watches `body.style.overflow` and stops/starts Lenis when dialogs or the mobile
menu lock the page. `MotionConfig reducedMotion="user"` makes Motion respect the OS preference.

## 3. Route map

### Canonical (indexable)

| Route                   | File                                | Notes                             |
| ----------------------- | ----------------------------------- | --------------------------------- |
| `/`                     | `app/page.tsx`                      | Home composition                  |
| `/services`             | `app/services/page.tsx`             | Directory of 6 services           |
| `/services/[slug]`      | `app/services/[slug]/page.tsx`      | 6 static pages + alias redirects  |
| `/solutions`            | `app/solutions/page.tsx`            | 3 engagement tracks               |
| `/products`             | `app/products/page.tsx`             | Product switcher                  |
| `/products/vps`         | `app/products/vps/page.tsx`         | Plans + FAQ                       |
| `/products/gxmail`      | `app/products/gxmail/page.tsx`      | Pricing + onboarding + FAQ        |
| `/products/gxnotify`    | `app/products/gxnotify/page.tsx`    | Pricing + onboarding + FAQ        |
| `/about`                | `app/about/page.tsx`                | Values, process                   |
| `/insights`             | `app/insights/page.tsx`             | 3 guides                          |
| `/insights/[slug]`      | `app/insights/[slug]/page.tsx`      | Static guide pages                |
| `/contact`              | `app/contact/page.tsx`              | `searchParams.service` prefill    |
| `/contact/thank-you`    | `app/contact/thank-you/page.tsx`    | `noindex`, reads `sessionStorage` |
| `/privacy-policy`       | `app/privacy-policy/page.tsx`       | Shared `PolicyPage`               |
| `/terms-and-conditions` | `app/terms-and-conditions/page.tsx` | Shared `PolicyPage`               |
| `/refund-policy`        | `app/refund-policy/page.tsx`        | Shared `PolicyPage`               |

Sitemap (`scripts/generate-sitemap.mjs` → `public/sitemap.xml`) lists 13 static routes + 6 services

- 3 insights = **22 canonical URLs**.

### Redirects / aliases

| From                                                      | To                               | Mechanism                       |
| --------------------------------------------------------- | -------------------------------- | ------------------------------- |
| `/about-us`                                               | `/about`                         | `permanentRedirect`             |
| `/blog`, `/blogs`                                         | `/insights`                      | `permanentRedirect` / re-export |
| `/blog/[slug]`, `/blogs/[slug]`                           | `/insights/[slug]`               | `INSIGHT_ALIASES` + redirect    |
| `/blog/category/[category]`, `/blogs/category/[category]` | `/insights`                      | `permanentRedirect`             |
| `/cloud-vps`                                              | `/products/vps`                  | `permanentRedirect`             |
| `/gxmail`                                                 | `/products/gxmail`               | `permanentRedirect`             |
| `/gxnotify`                                               | `/products/gxnotify`             | `permanentRedirect`             |
| `/templates`                                              | `/products`                      | `permanentRedirect`             |
| `/works`, `/works/[slug]`                                 | `/solutions`                     | `permanentRedirect`             |
| `/security`                                               | `/services/security-engineering` | `permanentRedirect`             |
| `/services/crafted-websites` etc.                         | mapped canonical service/product | `SERVICE_ALIASES`               |

`/design-preview` is `noindex, nofollow` and is only a hero design study.

## 4. Content model (`data/`)

| File                                                                                                                                                         | Exports                                                                                                                                                                                         | Used by                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `laxitechSite.ts`                                                                                                                                            | `SITE`, `ENGINEERING_SERVICES`, `SERVICE_ALIASES`, `VPS_PLANS`, `GXMAIL_PLANS`, `GXNOTIFY_PLANS`, `DELIVERY_STEPS`, `GENERAL_FAQS`, `CLOUD_FAQS`, `MAIL_FAQS`, `NOTIFY_FAQS`, `SOLUTION_TRACKS` | Home, services, solutions, products, footer, contact, sitemap |
| `heroExperience.ts`                                                                                                                                          | `HERO_COPY`, `HERO_SERVICES`, demo request/workflow/deployment steps                                                                                                                            | Hero tabs and screen content                                  |
| `insights.ts`                                                                                                                                                | `INSIGHTS`, `INSIGHT_ALIASES`                                                                                                                                                                   | Insights index/detail, sitemap, blog aliases                  |
| `assetRegistry.ts`                                                                                                                                           | team avatars, Cloudinary maps, snapshot sequences, placeholders                                                                                                                                 | Legacy works/studio components                                |
| `blogsData.ts`, `worksData.ts`, `projectsData.ts`, `templatesData.ts`, `featuredWorks.ts`, `servicesPageData.ts`, `aboutPageData.ts`, `studioBioSnippets.ts` | AI Studio-era content models                                                                                                                                                                    | Mostly legacy routes/components; kept for compatibility       |

**Rule:** new copy belongs in the narrowest data file that a page already imports. Do not create a
second source of truth for a price or a service name.

### Product facts (single source of truth)

- VPS: `Starter` 999 / 1 vCPU / 2 GB / 30 GB / 1 TB; `Business` 1,799 / 2 / 4 GB / 60 GB / 2 TB;
  `Pro` 3,299 / 4 / 8 GB / 120 GB / 4 TB.
- GXMail: `GXMAIL_PLANS` contains Starter (250/month or 3,000/year), Business (333/month or
  3,999/year) and Business Pro (500/month or 5,999/year), plus each tier's published limits.
- GXNotify: `GXNOTIFY_PLANS` contains Starter (500/month), Business (1,999/month) and Business Pro
  (3,999/month), plus each tier's project, email, push, SMS, API-key and template limits.
- `SITE.cloudPortal` → `https://cloud.laxitech.com/#pricing`
- `SITE.mailSignup` → `https://manage.laxitech.com/auth/register`
- `SITE.mailPortal` → `https://manage.laxitech.com/auth/login`
- `SITE.webmail` → `https://webmail.laxitech.com`
- `SITE.notifySignIn` → `https://gxnotify.laxitech.com/sign-in`
- `SITE.notifySignUp` → `https://gxnotify.laxitech.com/sign-up`
- `SITE.notifyDashboard` → `https://gxnotify.laxitech.com/dashboard`

## 5. Shared UI layer

| Component                                      | Responsibility                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `components/site/Primitives.tsx`               | `Reveal`, `SiteButton`, `PageIntro`, `SectionHeading`, `PageClose`             |
| `components/site/SelectionControl.tsx`         | Accessible radiogroup with sliding `layoutId` indicator                        |
| `components/site/ServicesShowcase.tsx`         | Home services disclosure + art plate                                           |
| `components/site/ProductPreviews.tsx`          | Product switcher, cloud/mail/notify previews, VPS, GXMail and GXNotify pricing |
| `components/site/DeliveryProcess.tsx`          | 4-step process with CC0 illustrations                                          |
| `components/site/Faq.tsx`                      | Accessible single-open disclosure list                                         |
| `components/site/PolicyPage.tsx`               | One layout for all three policy pages                                          |
| `components/site/ContactForm.tsx`              | Validation + honeypot + sessionStorage brief                                   |
| `components/site/ContactConfirmation.tsx`      | Brief review, copy, email/WhatsApp handoff                                     |
| `components/site/ServiceDiagram.tsx`           | 2.5D service diagram wrapper                                                   |
| `components/ui/ActionArrow.tsx`                | CSS-only twin arrow CTA cue                                                    |
| `components/ui/SplitRollText.tsx`              | Character roll hover (nav, buttons)                                            |
| `components/motion/TransitionPanel.tsx`        | AnimatePresence crossfade/slide between panels                                 |
| `components/motion/Reveal` (inside Primitives) | In-view stagger with reduced-motion guard                                      |

`SelectionControl` uses `button[role="radio"]` + `aria-checked` + arrow keys. Hero service tabs use
`role="tab"` semantics instead — keep the distinction.

## 6. Hero 3D system

Files:

- `lib/heroScene.ts` — pure timing API: `HERO_CAMERA_TIME = 13.333333`, `HERO_LID_START = 3`,
  `HERO_LID_END = 9.983333`, `HERO_SHOT_DURATION = 2.6`, `getHeroFrame()`, `screenQuadMatrix()`.
- `components/sections/hero/MacBookCanvas.tsx` — loads the GLB, evaluates lid + camera clips at
  independent times, exposes diagnostic datasets:
  `.lx-macbook-canvas[data-lid-time, data-camera-time, data-opening-progress, data-playing]`,
  `.lx-device-stage[data-settled|data-failed]`.
- `components/sections/hero/MacBookStage.tsx` — posters and no-3D fallback.
- `components/sections/hero/HeroServiceDemo.tsx` — per-service screen content and preview dialog.
- `components/sections/hero/HeroHeader.tsx` — editorial layout, CTA, atmosphere anchor.

GLB facts: `public/models/studio-macbook-scene.glb`; lid clips are named `top.*`; the projected
screen material is named `Change This`; backdrop/pedestal nodes are hidden by name
(`BACKDROP_NODES`, including the baked `Shadow` plane). The CSS `.lx-device-shadow` replaces the
baked contact shadow.

Fallback posters: `public/hero/{desktop|mobile}-{table|solo|…}-{dark|light}[-closed].webp`.
Reduced motion uses the fully open poster; initialization uses the `-closed` variant so the
fallback matches the opening start.

## 7. Backgrounds

- `LiveAtmosphereField` — one fixed Three.js `RawShaderMaterial` fullscreen triangle. Six scenes:
  `aurora`, `beams`, `silk`, `threads`, `mesh`, `rays`. Reads `[data-atmosphere]`, theme colors
  (`--lx-accent`, `--vv-cynex-purple`), `--lx-atmosphere-opacity`, scroll and pointer. Crossfades
  scenes; pauses on hidden tab and `html[data-route-transition]`; still under reduced motion.
  Diagnostics: `data-state`, `data-scene`, `data-frames`, `data-fps`, `data-buffer`, `data-color`.
- `KexsioThreads` — licensed `bg-threads` re-authored inside the capability section. One
  fullscreen triangle, 24 lines, 30/20/18 fps caps, buffer caps, theme uniforms via
  `MutationObserver`, diagnostics `data-source="kexsio:bg-threads"`, `data-state`, `data-frames`,
  `data-fps`, `data-color`.
- `AmbientParticleField` — Canvas 2D Kexsio-inspired particle field, retained in the tree but not
  imported. Do not delete without confirmation.

## 8. Security and caching

`next.config.ts`:

- `poweredByHeader: false`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Asset cache rule only matches asset folders + known extensions; `public, max-age=86400,
stale-while-revalidate=604800`.
- Remote images allowed only for `picsum.photos`, `res.cloudinary.com`, `images.unsplash.com`.

Contact data is escaped by React; recipients come from `SITE`; email/message values are
`encodeURIComponent`-encoded. There is no server-side mail delivery.

## 9. SEO

- `lib/siteMetadata.ts` builds canonical + OpenGraph per page.
- `scripts/generate-sitemap.mjs` writes `public/sitemap.xml` (22 URLs) from `data/`; it runs on
  `postinstall`, `predev` and `prebuild`. `app/opengraph-image.tsx` (1200×630) and
  `app/not-found.tsx` cover the remaining SEO surface.
- JSON-LD Organization block in `layout.tsx`.
- `metadataBase` uses `SITE.url`; change it in `data/laxitechSite.ts` only.
- Aliases use permanent redirects so legacy URLs do not create duplicate content.

## 10. Build output

- `next build` → `.next/`, `.next/standalone/`.
- `scripts/preview.mjs` links `standalone/public` and `standalone/.next/static`, then runs
  `server.js` with `PORT=3001`.
- 66 HTML artifacts were present in the last build (22 sitemap URLs plus aliases, static params and
  fallbacks). The exact count changes as content is added; do not treat it as a contract.
