# Design System

The site is an editorial, dimensional, dark-first system. It is intentionally **not** a utility-
class dashboard: layout and component styling live in semantic CSS classes across four files,
while Tailwind 4 supplies the reset/utility layer.

CSS ownership:

| File | Owns |
| --- | --- |
| `app/globals.css` | Fonts, reset, base tokens (`--vv-*`), theme blocks, shared primitives, Tailwind import |
| `app/hero.css` | Hero, laptop stage, device/demo UI, shared motion tokens, `--lx-*` palette, glass, buttons |
| `app/site.css` | All site sections, navigation, footer, forms, policy/article layouts |
| `app/illustrations.css` | 2.5D illustration system |

Do not add a fifth global stylesheet. If a new section needs styles, add a clearly prefixed block
to `site.css` (or `hero.css` if it is hero/device-only).

## 1. Tokens

### Brand / palette (`app/hero.css`)

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--lx-ink` | `#f4f5f7` | `#191c20` | Primary text |
| `--lx-muted` | `#b2b5bc` | `#5a6069` | Secondary text |
| `--lx-accent` | `#8cafff` | `#285ee5` | Accent, illustration, atmosphere |
| `--lx-action` | `#285ee5` | `#285ee5` | Primary action fill |
| `--lx-panel` | `#16181c` | `#f1f2f4` | Panels |
| `--lx-control` | `#24272d` | `#e7e9ed` | Controls |
| `--lx-rule` | `#30343c` | `#d8dbe1` | Hairlines |
| `--lx-success` | `#86d7b0` | `#176442` | Success |
| `--lx-glass` | `rgb(9 13 22 / .58)` | `rgb(255 255 255 / .62)` | Selective glass |
| `--lx-glass-border` | `rgb(140 175 255 / .2)` | `rgb(40 94 229 / .17)` | Glass edge |
| `--lx-thread-opacity` | `0.28` | `0.22` | KexsioThreads |
| `--lx-atmosphere-opacity` | `0.82` | `0.5` | LiveAtmosphereField |

The older `--vv-*` tokens in `globals.css` still power legacy components and the base ground:
`--vv-bg`, `--vv-surface*`, `--vv-border*`, `--vv-text-*`, `--vv-electric-blue`,
`--vv-cynex-purple`, `--vv-cynex-blue`. Reuse them instead of hardcoding hex values.

### Typography

| Role | Family | Token | Notes |
| --- | --- | --- | --- |
| Display | GT Walsheim | `--font-walsheim` / `--font-display` | Tight tracking (`-0.04` to `-0.065em`), line-height `0.95–1.05` |
| Body / UI | Geist | `--font-geist` / `--font-sans` | 15–16px body, line-height ~1.6 |
| Editorial accent | Fraunces | `--font-fraunces` | Italic highlights only |
| Mono | system mono | `--font-mono` | Numbers, code, data |

Fonts are self-hosted in `public/fonts` and declared with `@font-face` + fallback metrics to
avoid layout shift. Do not add Google Fonts at runtime.

### Spacing / layout

- Content width: `min(100%, 1440px)` inside `.site-container` (padding follows breakpoints).
- Section rhythm: `.site-section` (vertical padding) + `.site-container`.
- Breakpoints in use: `1100px`, `850px`, `600px`, plus `pointer: coarse` and
  `prefers-reduced-motion`.
- Radii are restrained (2–14px depending on control); shadows are soft and low-contrast.
- Section backgrounds are transparent over the global ground — **no visible boundary lines**
  between sections.

## 2. Themes

- `html[data-theme='dark'|'light']` drives every color token.
- Stored in `localStorage['vv-theme']`; `system` resolves via `prefers-color-scheme`.
- Inline bootstrap script prevents a flash of the wrong theme.
- Theme transitions use the View Transitions API (circular reveal from the toggle) and fall back
  to instant switching.
- Both themes must be checked for: body copy contrast, hairline visibility, illustration
  readability, glass contrast, atmosphere visibility, focus rings.

Measured worst-case primary-button contrast: **9.69:1 dark / 5.49:1 light**.

## 3. Motion system

### Tokens

```css
--lx-motion-fast: 160ms;
--lx-motion-main: 380ms;
--lx-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
```

Motion defaults come from `MotionConfig transition={{ ease: [0.22, 1, 0.36, 1] }}`. Character
rolls run ~340ms with stagger capped at 80ms.

### Patterns

| Pattern | Implementation | Notes |
| --- | --- | --- |
| Section reveal | `Reveal` (`useInView` once, child stagger 75ms) | Stops controls on cleanup; skips under reduced motion |
| Panel switch | `TransitionPanel` (`AnimatePresence` + `mode="wait"`) | Used by products, capability chapters, services art |
| Button cue | `ActionArrow` | CSS-only twin arrow exchange; no extra dependency |
| Text roll | `SplitRollText` | Nav/footer links + primary buttons |
| Magnetic hover | `Magnetic` | Max 5px horizontal / 4px vertical; disabled for coarse pointers |
| Headline reveal | `TextEffect` | Word/line mask; reduced-motion safe |
| Route transition | `RoutePreloader` curtain | 7/5/3 columns by breakpoint; 380ms minimum close; safety timeout 4.5s |
| Smooth scroll | Lenis | lerp 0.12; anchors offset −104; stops for scroll locks |

### Reduced motion contract

Every animation must satisfy at least one:

1. `useReducedMotion()` guard that skips or instantly settles the animation.
2. CSS `@media (prefers-reduced-motion: reduce)` that forces the resting state.
3. A runtime `matchMedia` check for non-Motion code (canvas/WebGL).

WebGL fields render a **still frame**; they do not disappear. Content must be visible without
scrolling or waiting. Test after toggling the OS preference with the page already loaded.

## 4. Components and interaction rules

- **Selection controls** are `role="radiogroup"` with `button[role="radio"]`, `aria-checked`,
  arrow-key navigation and a shared sliding indicator (`layoutId`). Hero service tabs use
  `role="tab"`/`aria-selected` instead.
- **Disclosure rows** (services, FAQ) use a real `button` with `aria-expanded` +
  `aria-controls`, one open item at a time. Answers have real copy, not placeholders.
- **Dialogs** use the native `<dialog>` element, restore focus to the invoker, and lock body
  scroll (Lenis is kept in sync).
- **Buttons/links** always use `SiteButton` or the shared `.lx-primary-button` /
  `.lx-text-link` classes so arrow, roll text, focus and disabled states stay consistent.
- **Focus** is always visible (`:focus-visible`), never removed.
- **Touch**: hover-only travel is disabled for `pointer: coarse`; tap targets ≥ 44px.

## 5. Illustration system

`components/illustrations/EngineeringIllustration.tsx`

- One component, scene selected by `kind`:
  `software`, `cloud`, `vps`, `infrastructure`, `automation`, `devops`, `security`, `mail`.
- Props: `kind`, `compact`, `caption` (and `label` via `ServiceDiagram`).
- Layered 2.5D composition built from CSS/SVG; dark/light variants come from `data-theme`.
- Hover separates physical layers (`.iso-separate-top`), the container tilts with the pointer,
  floating accents loop. All of it stops under reduced motion.
- Used on services index, service details, solutions, about, insights thumbnails, product
  interfaces, hero screen and mobile service rows.

`components/illustrations/ProcessIllustration.tsx`

- Four CC0 3dicons V1 clay renders (discovery, planning, engineering, launch), tinted into
  dark/light WebP at 320px.
- Source/licence/hashes: `public/illustrations/process/sources.json`.
- Rendered at 144px desktop / 124px tablet / 96px mobile, lazy-loaded, decorative alt text.

**Do not** introduce a second illustration family or a new 3D render style without art direction.

## 6. Backgrounds

| Scene | Where | Feel |
| --- | --- | --- |
| `aurora` | Hero | Soft folded light bands |
| `beams` | Technology + services | Angular shafts from a corner |
| `silk` | Products / pricing | Flowing translucent folds |
| `threads` | Capability section | Thin line field (KexsioThreads) |
| `mesh` | Process | Low wave mesh |
| `rays` | Page intros/closes, FAQ, footer | Vertical light rays |

Assign via `data-atmosphere="…"` on a section. A section without the attribute inherits the
nearest visible region (or `aurora`). The field crossfades over ~0.7s.

## 7. Accessibility baseline

- Skip link to `#vv-main`; `main` is focusable (`tabIndex={-1}`).
- Semantic landmarks: `header`, `nav`, `main`, `footer`, one `h1` per page.
- `aria-current` on the active nav link.
- Mobile menu uses `inert` isolation while closed and restores focus on close.
- All interactive previews are keyboard operable.
- Images: decorative art is `aria-hidden`/empty alt; meaningful images have descriptive alt.
- Color is never the only signal.
- Motion respects the OS preference; no autoplaying audio/video with sound.

## 8. Do / don't

**Do**

- Reuse the shared primitives and tokens.
- Keep one system per pattern; extend the existing component instead of forking.
- Test both themes, 1440/768/390/320px, keyboard and reduced motion.
- Keep copy specific and honest.

**Don't**

- Add a new global CSS file, a new font, or a new animation library.
- Add opaque section cards, gradient text, blobs, or decorative clutter.
- Use `!important` to override tokens (legacy exceptions exist; do not add more).
- Hardcode prices or product facts in JSX.
- Add a second WebGL context without a performance review.
