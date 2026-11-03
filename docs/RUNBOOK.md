# Runbook

## 1. Prerequisites

| Requirement | Value |
| --- | --- |
| Node.js | `>= 20.9.0` (Next.js 16 engine requirement) |
| Package manager | npm 10+ (verified). `bun.lock` exists but npm is the supported path |
| Python | only needed for optional asset/tooling scripts; not required to run the site |
| Browser | Chromium for the documented checks; Firefox/Safari still need validation |

No environment variables are needed. `.env.example` is an AI Studio leftover and is not read by
application code.

## 2. Local development

```bash
npm install
npm run dev
```

- URL: `http://localhost:3000`
- Next.js 16 uses Turbopack for dev by default.
- HMR is disabled only when `DISABLE_HMR=true` (AI Studio behavior). Do not set it locally.

## 3. Production build + local preview

```bash
# stop any running preview on :3001 first
npm run build
npm run preview
```

- URL: `http://localhost:3001`
- `scripts/preview.mjs` checks/creates the two relative symlinks the standalone server needs:
  - `.next/standalone/public` → `public/`
  - `.next/standalone/.next/static` → `.next/static/`
- It then sets `PORT=3001`, `HOSTNAME=0.0.0.0` and imports `.next/standalone/server.js`.
- **Rebuild after every code change.** A running preview keeps serving the old build; a rebuild
  replaces `.next/standalone` and can leave the old process pointing at a deleted directory.

If the preview shows unstyled HTML or image 404s:

1. Stop the preview.
2. `npm run build`.
3. `npm run preview` (it repairs the symlinks).
4. Hard-reload the browser.

## 4. Quality gates

```bash
npm test                          # 34 tests: data/*.test.ts + lib/*.test.ts
npm run typecheck                 # tsc --noEmit, strict
npm run lint -- --max-warnings 0  # ESLint flat config, Next core-web-vitals + TS
npm run build                     # production build
```

Current baseline at handover (2026-11-03):

| Gate | Result |
| --- | --- |
| `npm test` | 34 pass, 0 fail |
| `npm run typecheck` | clean |
| `npm run lint -- --max-warnings 0` | clean, 0 warnings |
| `npm run build` | verified before handover (66 HTML artifacts) |
| Production dependency audit | 0 known vulnerabilities |
| Full audit | 32 moderate, dev-tooling only; 0 high/critical |

`node --test` prints a harmless `MODULE_TYPELESS_PACKAGE_JSON` warning because
`package.json` has no `"type": "module"`. The TypeScript test files are re-parsed by Node; this is
expected.

## 5. Manual QA checklist

Run against the production preview, not only dev.

**Desktop 1440 / tablet 768 / mobile 390 / small 320**

- [ ] Hero renders, laptop lid opens, no horizontal overflow.
- [ ] Navbar links, active state, mobile menu open/close, focus return.
- [ ] Services disclosure: one panel at a time; art updates.
- [ ] Products switcher and VPS/GXMail price values.
- [ ] FAQ disclosure; long answers wrap within measure.
- [ ] Contact: validation, honeypot, brief on thank-you, email/WhatsApp encoding.
- [ ] Footer links, copy-email button, external links have `rel="noopener noreferrer"`.
- [ ] 404 route and a legacy alias redirect.
- [ ] Policy pages render through the shared layout.

**Themes / motion**

- [ ] Toggle dark ↔ light on every page; text, art, glass and backgrounds stay legible.
- [ ] Reload: no theme flash, no hydration warning.
- [ ] Reduced motion: page settles, background is still, content visible.
- [ ] Background scenes change as sections enter the viewport.
- [ ] No console errors or unhandled promise rejections.

**Network**

- [ ] All fonts, images, the GLB and hero posters return 200.
- [ ] No request to a credential-bearing endpoint.
- [ ] HTML is not cached as immutable; public assets are.

## 6. Browser automation (optional)

The original verification scripts lived in `/tmp/opencode` and are **not** part of this package.
If they are gone, rebuild them or use your own Playwright/CDP harness. When recreating:

- Launch Chrome with `--no-sandbox` in containerized environments.
- Use the production preview (`:3001`) for acceptance checks.
- Keep routine checks headless.
- Read diagnostics from the existing dataset attributes instead of adding test-only code:
  - `.lx-macbook-canvas[data-lid-time, data-camera-time, data-opening-progress, data-playing]`
  - `.lx-device-stage[data-settled|data-failed]`
  - atmosphere canvas `[data-state, data-scene, data-frames, data-fps, data-buffer]`
  - KexsioThreads `[data-source, data-state, data-frames, data-fps, data-color]`

The design-taste inspector, when present, lives in `.agents/skills/design-taste-frontend/`.
It is agent tooling, not production code, and is excluded from this handover.

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Preview serves old UI | stale `.next/standalone` process | stop preview, rebuild, `npm run preview` |
| CSS/images 404 on `:3001` | missing standalone symlinks | rerun `npm run preview` (repairs them) |
| Theme flashes on load | inline bootstrap script removed/reordered | restore it in `app/layout.tsx` `<head>` |
| Hydration mismatch on `html` | theme attribute mismatch | keep `suppressHydrationWarning` and the bootstrap script |
| `Invalid value used as weak map key` after navigation | Motion controls replayed after unmount | ensure `Reveal`/`TextEffect` cleanup calls `controls.stop()` |
| Background not animating | `prefers-reduced-motion`, hidden tab, or `html[data-route-transition]` | check the canvas `data-state`; test without reduced motion |
| WebGL unavailable | software renderer/blocked context | canvas sets `data-state="unavailable"`; posters still render |
| Hero stuck on poster | GLB failed or slow load | check the GLB request and `.lx-device-stage[data-failed]` |
| `next build` fails after config change | strict TS or invalid route export | run `npm run typecheck`, read the first error only |
| `npm test` "Unknown file extension .ts" on old Node | Node < 22 without type stripping | upgrade Node (>= 20.9, ideally 22) |
| Port 3000/3001 already in use | another dev/preview server | use the existing server or stop it first |

## 8. Deployment

### Standalone (recommended, matches local preview)

```bash
npm ci
npm run build
# upload:
#   .next/standalone/  (server.js + minimal node_modules)
#   .next/static/      -> .next/standalone/.next/static
#   public/            -> .next/standalone/public
# run:
PORT=3000 node .next/standalone/server.js
```

Use a process manager (systemd, PM2, container entrypoint) and put a reverse proxy in front for
TLS. The app itself has no database, no API routes and no server-side secrets.

### Standard Next host

If the platform runs `next build` + `next start` itself, `output: 'standalone'` is still fine; the
platform can ignore the standalone folder.

### Before pointing DNS

1. Change `SITE.url` in `data/laxitechSite.ts` if the domain is not `https://laxitech.com`.
2. Rebuild so canonical URLs, sitemap and OG metadata match.
3. Confirm the host forwards the security headers from `next.config.ts` (some CDNs strip them).
4. Validate HTTPS, HSTS (if added at the edge), redirects and cache behavior.
5. Run the manual QA checklist on Firefox, Safari and a real phone.
6. Confirm the legal pages and contact copy with the business.

### Rollback

There is no git history in the delivered tree. Keep a copy of the last known-good build and a
snapshot of the source before deploying. The preview build on `:3001` is the reference build.

## 9. Dependency maintenance

- Production audit is clean. The 32 moderate advisories come from dev tooling: Firebase CLI,
  ESLint/TypeScript ESLint and typography tooling (`@opentelemetry/core`, `glob`, `minimatch`,
  `postcss-selector-parser`, `uuid`).
- Do **not** run `npm audit fix --force`; its suggested fixes include obsolete major downgrades.
- Plan a compatibility-tested update with its own branch/copy, then rerun all gates and the manual
  checklist.

## 10. Emergency contacts / ownership

Fill these in for the client before handover:

| Area | Owner |
| --- | --- |
| Domain / DNS | _TBD_ |
| Hosting / deployment | _TBD_ |
| Cloud portal / VPS billing | _TBD_ |
| GXMail administration | _TBD_ |
| Content sign-off | _TBD_ |
| Design / frontend | _TBD_ |
