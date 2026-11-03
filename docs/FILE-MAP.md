# File Map

Legend: **Live** = imported by a route or a live component. **Legacy** = retained for reference,
tests or compatibility but not reachable from the current UI. **Tooling** = build/agent support.

## Root

| File | Status | Notes |
| --- | --- | --- |
| `app/` | Live | Routes, layout, CSS, sitemap, OG image |
| `components/` | Live | See below |
| `data/` | Live/Legacy | Content models; only three files drive the current UI |
| `lib/` | Live | Pure helpers + tests |
| `public/` | Live | 33 MB of fonts, models, posters, illustrations, media |
| `scripts/preview.mjs` | Live | Standalone preview launcher |
| `types/mockup-player.d.ts` | Legacy | Types for the unused 3D mockup player |
| `next.config.ts` | Live | Standalone output, headers, image allowlist |
| `tsconfig.json` | Live | Strict TS, `@/*` path alias |
| `eslint.config.mjs` | Live | Flat config, ignores `.agents/.aistudio/.opencode` |
| `postcss.config.mjs` | Live | Tailwind 4 + autoprefixer |
| `instrumentation.ts` | Live | Dev-time route warmup (`localhost:3000`) |
| `metadata.json` | Tooling | AI Studio metadata |
| `.env.example` | Tooling | AI Studio leftover; not read by app code |
| `.gitignore` | Tooling | Excludes `.next`, `node_modules`, `.env*`, `.mcp.json`, `.aistudio` |
| `PROJECT_CONTEXT.md` | Docs | Deep refinement/history log |
| `LAXITECH_CUSTOM_INSTRUCTIONS.md` | Docs | Original brand brief (contains older claims — see CONTENT-RULES) |
| `AGENTS.md` | Tooling | Next.js agent rules auto-maintained by `next dev` |
| `HANDOVER.md`, `README.md`, `docs/` | Docs | This handover set |

## `app/`

| File | Purpose |
| --- | --- |
| `layout.tsx` | Fonts/CSS imports, metadata, theme bootstrap, providers, atmosphere, nav/footer |
| `page.tsx` | Home composition |
| `globals.css` | Fonts, reset, base tokens, shared utilities |
| `hero.css` | Hero/laptop/device styles, `--lx-*` palette, motion tokens |
| `site.css` | All site sections, nav, footer, forms, articles, policy |
| `illustrations.css` | 2.5D illustration system |
| `about/page.tsx` | About page |
| `services/page.tsx` | Services directory |
| `services/[slug]/page.tsx` | Service detail + alias redirects |
| `solutions/page.tsx` | Engagement tracks |
| `products/page.tsx` | Product switcher |
| `products/vps/page.tsx` | VPS product page |
| `products/gxmail/page.tsx` | GXMail product page |
| `insights/page.tsx` | Guide index |
| `insights/[slug]/page.tsx` | Guide detail |
| `contact/page.tsx` | Enquiry form + FAQ |
| `contact/thank-you/page.tsx` | Brief handoff (`noindex`) |
| `privacy-policy/page.tsx` | `PolicyPage` |
| `terms-and-conditions/page.tsx` | `PolicyPage` |
| `refund-policy/page.tsx` | `PolicyPage` |
| `not-found.tsx` | 404 |
| `design-preview/page.tsx` | Hero study (`noindex`) |
| `opengraph-image.tsx` | 1200×630 OG image |
| `sitemap.ts` | 21 canonical URLs |
| `about-us/page.tsx` | Redirect → `/about` |
| `blog/page.tsx`, `blogs/page.tsx` | Redirect → `/insights` |
| `blog/[slug]`, `blogs/[slug]` | Redirect → `/insights/[slug]` |
| `blog/category/[category]`, `blogs/category/[category]` | Redirect → `/insights` |
| `cloud-vps/page.tsx` | Redirect → `/products/vps` |
| `gxmail/page.tsx` | Redirect → `/products/gxmail` |
| `security/page.tsx` | Redirect → `/services/security-engineering` |
| `templates/page.tsx` | Redirect → `/products` |
| `works/page.tsx`, `works/[slug]` | Redirect → `/solutions` |

## `components/layout/`

| File | Status | Notes |
| --- | --- | --- |
| `Navbar.tsx` | Live | Desktop + mobile drawer, `aria-current`, inert isolation, theme toggle |
| `Footer.tsx` | Live | Oversized wordmark, directory, copy-email, legal links |
| `RoutePreloader.tsx` | Live | GSAP curtain transition; warms core routes on idle |

## `components/motion/`

| File | Status | Notes |
| --- | --- | --- |
| `MotionProvider.tsx` | Live | Lenis + MotionConfig + scroll-lock sync |
| `LiveAtmosphereField.tsx` | Live | Global WebGL atmosphere, 6 scenes |
| `Magnetic.tsx` | Live | Pointer magnetic wrapper (5px/4px cap) |
| `TextEffect.tsx` | Live | Headline word/line reveal |
| `TransitionPanel.tsx` | Live | Crossfade between panels |
| `AmbientParticleField.tsx` | Legacy | Canvas 2D particle field; retained, not imported |
| `MOTION-PRIMITIVES.LICENSE` | Tooling | Licence for adapted motion primitives |

## `components/site/` (live shared UI)

| File | Notes |
| --- | --- |
| `Primitives.tsx` | `Reveal`, `SiteButton`, `PageIntro`, `SectionHeading`, `PageClose` |
| `SelectionControl.tsx` | Accessible radiogroup with sliding indicator |
| `ServicesShowcase.tsx` | Home services disclosure + art |
| `ServiceDiagram.tsx` | Diagram wrapper around `EngineeringIllustration` |
| `ProductPreviews.tsx` | Product switcher, Cloud/Mail previews, `VpsPricing`, `MailPricing` |
| `DeliveryProcess.tsx` | 4-step process |
| `Faq.tsx` | Disclosure FAQ |
| `PolicyPage.tsx` | Shared legal layout |
| `ContactForm.tsx` | Client validation + brief builder |
| `ContactConfirmation.tsx` | Brief review + email/WhatsApp/copy |

## `components/illustrations/`

| File | Status | Notes |
| --- | --- | --- |
| `EngineeringIllustration.tsx` | Live | 8 scenes, themed, hover/tilt/reduced-motion |
| `ProcessIllustration.tsx` | Live | 4 CC0 clay renders by kind/theme |

## `components/sections/`

| File | Status | Notes |
| --- | --- | --- |
| `hero/HeroHeader.tsx` | Live | Editorial hero |
| `hero/MacBookStage.tsx` | Live | 3D canvas + poster fallback |
| `hero/MacBookCanvas.tsx` | Live | GLB loader, lid/camera clips, datasets |
| `hero/HeroServiceDemo.tsx` | Live | Per-service screen + preview dialog |
| `hero/HeroPreview.tsx` | Live (noindex page) | Hero art-direction study |
| `hero/translations.ts` | Legacy | Unused hero copy constants |
| `proof/ImpactScrollStage.tsx` | Live | Capability chapters |
| `proof/KexsioThreads.tsx` | Live | Licensed threads background |
| `works/WorksSection.tsx` | Legacy | Old portfolio wall |
| `works/FluidGradientCanvas.tsx` | Legacy | Used by WorksSection |
| `works/WorksCoilCanvas.tsx` | Legacy | Used by WorksSection |
| `hero/StudioEditor.tsx` | Legacy | AI Studio code-editor hero |
| `approach/OurApproachBento.tsx` | Legacy | Old bento |
| `blog/BlogIndexView.tsx` | Legacy | Old blog index |
| `faq/FaqSection.tsx` | Legacy | Replaced by `components/site/Faq` |
| `intro/IntroSection.tsx` | Legacy | Old intro |
| `platforms/PlatformFlexibility.tsx` | Legacy | Old platform section |
| `pricing/PricingSection.tsx` | Legacy | Replaced by product pricing |
| `services/ServicesGrid.tsx` | Legacy | Replaced by `ServicesShowcase` |
| `tech/TechStack.tsx` | Legacy | Replaced by `LogoCloud` |
| `testimonials/TestimonialsSection.tsx` | Legacy | No testimonials on the live site |
| `ticker/CapabilitiesTicker.tsx` | Legacy | Old ticker |

## `components/ui/`

| File | Status | Notes |
| --- | --- | --- |
| `ActionArrow.tsx` | Live | CSS twin-arrow CTA cue |
| `SplitRollText.tsx` | Live | Character roll hover |
| `logo-cloud-2.tsx` | Live | Technology logo field on home |
| `ReactiveAuroraField.tsx` | Legacy | Only used by legacy `PagePrimitives` |
| `PagePrimitives.tsx` | Legacy | Old page primitives |
| `ShimmerCanvas.tsx` | Legacy | Only legacy sections |
| `LightPillar.tsx` | Legacy | Only legacy sections |
| `LightningBackground.tsx` | Legacy | Only `PlatformFlexibility` |
| `BeamsBackground.tsx` | Legacy | Unused |
| `ShineBorder.tsx` | Legacy | Only legacy cards |
| `SnapshotScrollPreview.tsx` | Legacy | Only `WorksSection` |
| `mosaic-shader-background.tsx` | Legacy | Unused (exports `retileEase`) |

## `components/services/`, `components/works/`, `components/brand/`, `components/theme/`

| File | Status | Notes |
| --- | --- | --- |
| `services/ServiceMotionVisual.tsx` | Legacy | Unused |
| `works/MockupPlayer3D.tsx` | Legacy | Unused 3D player |
| `works/WorkGalleryCarousel.tsx` | Legacy | Unused |
| `brand/LaxitechWordmark.tsx` | Live | Navbar/footer/preloader wordmark |
| `brand/CynexEmblem.tsx` | Live | Preloader/wordmark emblem |
| `theme/ThemeProvider.tsx` | Live | Theme state, view transition, `useTheme` |

## `data/`

| File | Status | Notes |
| --- | --- | --- |
| `laxitechSite.ts` | **Live** | `SITE`, 6 services, VPS plans, process, FAQs, solution tracks |
| `insights.ts` | **Live** | 3 guides + aliases |
| `heroExperience.ts` | **Live** | Hero copy, service tabs, demo steps |
| `assetRegistry.ts` | Legacy | Cloudinary/media maps for old components |
| `aboutPageData.ts` | Legacy | Old about content |
| `blogsData.ts` | Legacy | Old blog model |
| `featuredWorks.ts` | Legacy | Old works cards |
| `projectsData.ts` | Legacy | Case studies |
| `servicesPageData.ts` | Legacy | Old services grid |
| `studioBioSnippets.ts` | Legacy | Code-editor snippets |
| `templatesData.ts` | Legacy | Templates page data |
| `worksData.ts` | Legacy | Works index data |
| `*.test.ts` | Tests | Data-shape/content assertions |

## `lib/`

| File | Status | Notes |
| --- | --- | --- |
| `heroScene.ts` | Live | Pure hero timing API; unit-tested |
| `siteMetadata.ts` | Live | Canonical + OG helper |
| `browserState.ts` | Live | `useStoredValue`, `useBrowserMedia`, `useHydrated` |
| `hardwareTier.ts` | Legacy/compat | Device capability tiers; imported only by legacy UI |
| `mockupPlayerConfig.ts` | Live | 3D mockup configuration used by `MacBookCanvas` |
| `portfolioMotion.ts` | Live | Navigation/curtain helpers + motion math |
| `utils.ts` | Live | `cn()` class merge |
| `*.test.ts` | Tests | 34 tests total |

## `public/`

| Path | Contents |
| --- | --- |
| `brand/` | Wordmark, icon, OG assets |
| `fonts/` | GT Walsheim, Geist, Fraunces (self-hosted) |
| `hero/` | 16 WebP laptop posters (open/closed, desktop/mobile, dark/light) |
| `models/` | `studio-macbook-scene.glb` |
| `draco/` | Draco decoder for the GLB |
| `illustrations/process/` | 8 tinted WebP + `sources.json` provenance |
| `media/`, `snapshots/`, `approach/`, `intro/`, `platforms/`, `services/`, `team/`, `about/`, `tech/`, `tech-stack/`, `clients/`, `assets/` | Imagery used by legacy pages/components |
| `social-card.jpg` | Static social image |
| `.well-known/` | Host verification files |

## Safely removing legacy code

Only after user confirmation and with a fresh `npm run build` + `npm test`:

1. Remove the unused component tree from the leaves upward (e.g. `WorksCoilCanvas` →
   `WorksSection`).
2. Remove the data files only if no test imports them.
3. Re-run `grep -rn "<Name>" app components` to confirm zero imports.
4. Update `tsconfig` excludes only if needed.
5. Never delete `public/media` or `public/snapshots` until you have confirmed no live route or
   data file references them — several legacy paths are still in `assetRegistry.ts`.
