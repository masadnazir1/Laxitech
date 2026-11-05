# Roadmap, Risks & Technical Debt

## 1. Where the project stands

The agreed localhost scope is complete and locally deployed:

- Home, services (index + 6 details), solutions, products (index + VPS + GXMail + GXNotify), about, insights
  (index + 3 guides), contact + thank-you, three policy pages, 404.
- Hero 3D laptop with a lid-opening entrance and poster fallbacks.
- One 2.5D illustration system reused across the site.
- One global WebGL atmosphere with six section-aware scenes, plus the Kexsio threads background.
- Accessible selection controls, disclosures, dialogs, theme toggle and mobile navigation.
- Local production preview on port 3001 with security headers and cache separation.
- Quality gates: 38/38 unit tests, typecheck clean, ESLint zero warnings, production build
  verified (66 HTML artifacts).

This is a completion statement for the agreed scope, not a public-launch claim. External release
work remains (cross-browser, real devices, HTTPS/CDN).

## 2. Priority order for the next developer

| Priority | Work | Why |
| --- | --- | --- |
| P0 | Get a git repository + CI baseline | There is no history; every change is unrecoverable |
| P0 | Verify `SITE` values, prices and legal copy with the business | Content is the product |
| P1 | Cross-browser + real-device pass | Chromium-only automation is not launch proof |
| P1 | HTTPS/CDN + header verification | Headers can be stripped or rewritten at the edge |
| P2 | Development-tool dependency update | 32 moderate dev-only advisories |
| P2 | Legacy code removal (with approval) | ~10 unused section components + data files |
| P3 | Typography consolidation | Inspector sees 16 computed sizes; visually coherent but worth a dedicated pass |
| P3 | Real backend for enquiries (only if the business wants it) | Current flow is intentionally client-side |
| P3 | Real company footage/work imagery | The site has no honest footage; stock would reduce credibility |

## 3. Known issues

### 3.1 No source control

The delivered working tree has **no git repository**. There is no commit history, no stash, no
restore point. Before any risky change:

```bash
cp -a . ../laxitech-backup-$(date +%F-%H%M)
```

Then initialize git locally (do not push without the owner's approval):

```bash
git init
git add .
git commit -m "chore: baseline handover"
```

Keep `.env*`, `.mcp.json`, `.opencode/`, `node_modules/`, `.next/` out of the commit (already in
`.gitignore`).

### 3.2 Development-tool advisories

At handover: production audit clean; full audit showed **32 moderate** affected packages, zero
high/critical, rooted in:

- `@opentelemetry/core` (via Firebase CLI)
- `glob` / `minimatch` (via ESLint/TypeScript ESLint and tooling)
- `postcss-selector-parser`
- `uuid`

Advisory links:

- https://github.com/advisories/GHSA-8988-4f7v-96qf
- https://github.com/advisories/GHSA-3g3m-2fjr-6pw4
- https://github.com/advisories/GHSA-g3hv-75wg-m249
- https://github.com/advisories/GHSA-rj75-hqrm-r3gf
- https://github.com/advisories/GHSA-w5hq-g745-h8pq

Do **not** run `npm audit fix --force`. It proposes obsolete major downgrades. Update one tooling
family at a time and rerun `npm test`, `typecheck`, `lint` and `build`.

### 3.3 Browser/platform coverage

Automated verification used Chromium at 1440, 768, 390 and 320px. Before public launch:

- Firefox and Safari (including iOS Safari).
- Real Android/iPhone devices (touch hover behavior, Lenis, safe areas).
- Reduced-motion at OS level.
- Slow network / low-end GPU (WebGL fallback, GLB load, poster transition).
- 200% zoom and keyboard-only navigation.

### 3.4 Preview build assumptions

- `npm run preview` assumes `.next/standalone/server.js` exists and that `public/` and
  `.next/static/` are reachable. It creates the two symlinks if missing.
- Rebuilding while a preview is running can leave the process pointing at a replaced directory.
  Stop the preview before `npm run build`.
- `instrumentation.ts` warms `localhost:3000` routes. It is dev-oriented; if the production host
  is not on 3000, the warmup silently fails (caught), which is harmless but useless. Consider
  removing or making it runtime-aware for production.

### 3.5 Content risks

- `LAXITECH_CUSTOM_INSTRUCTIONS.md` still contains older, unapproved claims (Tier III, 99.99%
  SLA, 100% deliverability). A new developer or AI model could copy them. The live copy is the
  approved state; see `docs/CONTENT-RULES.md`.
- Legal pages are neutral templates, not legal advice.
- The contact page promises a review/response process in the aside ("We review your
  requirements…"). Confirm the business can honor the stated process.

### 3.6 Performance and motion

- The global atmosphere is one WebGL context; `KexsioThreads` is a second. Both have frame and
  buffer caps. Adding a third WebGL surface without measurement risks low-end devices.
- The hero GLB is ~1.8 MB. Posters cover the gap, but slow connections still see the poster for a
  while. Do not remove the poster path.
- `LiveAtmosphereField` is fixed and full-screen; it must stay pointer-transparent (`pointer-events:
  none`) or it will block interaction.
- `AmbientParticleField` is dead code kept intentionally. Deleting it changes nothing visually but
  was deferred pending user confirmation.

### 3.7 Legacy code

Unused but still compiled/typechecked:

- Sections: `WorksSection`, `StudioEditor`, `OurApproachBento`, `BlogIndexView`, `FaqSection`,
  `IntroSection`, `PlatformFlexibility`, `PricingSection`, `ServicesGrid`, `TechStack`,
  `TestimonialsSection`, `CapabilitiesTicker`.
- UI: `BeamsBackground`, `ReactiveAuroraField`, `PagePrimitives`, `ShimmerCanvas`, `LightPillar`,
  `LightningBackground`, `ShineBorder`, `SnapshotScrollPreview`, `mosaic-shader-background`.
- Services/works: `ServiceMotionVisual`, `MockupPlayer3D`, `WorkGalleryCarousel`.
- Data: `aboutPageData`, `blogsData`, `featuredWorks`, `projectsData`, `servicesPageData`,
  `studioBioSnippets`, `templatesData`, `worksData`, `assetRegistry`.
- Lib: `hardwareTier` (imported only by legacy UI).
- Types: `mockup-player.d.ts`.

Why they remain: they are reference material from the AI Studio build and some are covered by
tests. Remove only with explicit approval, in a separate commit, and after a full build.

### 3.8 Design-tool caveats

- The design-taste inspector's eyebrow/geometry heuristic can misread the service CTA as a label
  for the next accordion row. Confirm with screenshots before editing copy to satisfy it.
- An earlier agent modified the inspector's probe logic (`.agents/.../probe.mjs`). That is review
  tooling, not production UI. Do not "fix" the site to satisfy a known false positive.
- The inspector only frames the home viewport; check other routes manually.

## 4. Recommended improvements (not required)

1. **Analytics with consent** — only if the business adds a privacy policy update and a cookie
   strategy. Do not add trackers silently.
2. **Real enquiry backend** — a small form endpoint with spam protection, plus updated copy and
   privacy policy. Keep the current email/WhatsApp path as a fallback.
3. **CMS for insights** — currently `data/insights.ts`; a CMS is only worth it if publishing
   cadence justifies it.
4. **Case studies with real evidence** — the biggest credibility gap. Needs real clients,
   measurable outcomes and permission.
5. **Real work/process footage** — would replace the "no footage" warning in design reviews.
6. **Strict CSP with nonces** — requires a server-rendering/deployment decision and testing of
   inline theme/bootstrap scripts.
7. **Visual regression CI** — screenshots at 1440/768/390 for both themes on key routes.
8. **Accessibility audit** — axe + manual screen-reader pass. The baseline is good, not certified.

## 5. Release checklist

**Content**

- [ ] `SITE` email/phone/portals/URL confirmed.
- [ ] VPS prices confirmed.
- [x] GXMail plans confirmed against the administration frontend and public plans endpoint on
  2026-11-05.
- [x] GXNotify plans and production URLs confirmed against `gxnotify` source and its production
  site on 2026-11-05.
- [ ] No banned claim from `docs/CONTENT-RULES.md`.
- [ ] Legal pages reviewed.
- [ ] Contact copy matches the actual handoff behavior.

**Engineering**

- [ ] `npm ci` from a clean checkout.
- [ ] `npm test` / `typecheck` / `lint --max-warnings 0` / `build` all pass.
- [ ] Preview build verified on `:3001`.
- [ ] No secrets in the tree (`git grep -i "token\|secret\|api_key"` on tracked files).
- [ ] Security headers present on the deployed host.
- [ ] Sitemap and canonicals use the production domain.
- [ ] 404 and legacy redirects verified.

**Devices**

- [ ] Chrome, Firefox, Safari, iOS Safari.
- [ ] 1440 / 768 / 390 / 320 widths.
- [ ] Keyboard-only, reduced motion, 200% zoom.
- [ ] Slow network + low-end GPU.

**Operations**

- [ ] Backups and rollback build stored.
- [ ] Domain/DNS/hosting owners documented (`docs/RUNBOOK.md` §10).
- [ ] Monitoring/uptime (if the business wants it) configured.
- [ ] Post-launch check of console errors and 404s.

## 6. Do-not-do list

- Do not add fake clients, logos, dashboards, certifications, SLAs or guarantees.
- Do not replace the live background with a static texture; motion is a requirement.
- Do not remove the reduced-motion still mode.
- Do not add a second illustration family or a new font without art direction.
- Do not hardcode a price outside the existing sources of truth.
- Do not run `rm -rf`, `git clean`, or `npm audit fix --force`.
- Do not deploy externally or change DNS without the owner's approval.
- Do not commit `.env*`, `.mcp.json`, `.opencode/` or any credential-bearing file.
