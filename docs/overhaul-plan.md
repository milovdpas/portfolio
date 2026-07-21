# Portfolio overhaul — plan & progress

Tracking document for the 2026-07 overhaul round: performance, mobile layout, i18n, social skills physics, hobby mini-games, and projects.

Legend: `[ ]` todo · `[x]` done

---

## Context (why)

1. **/experience freezes on load** — `startPhysics()` synchronously decomposes skill SVGs to vertices on the main thread (`getPointAtLength()` in 0.5-unit steps → thousands of forced layout calls per icon). The Web Worker never protected against this. Ongoing jank: one `update_body` message per body per frame + a never-pausing rAF draw loop.
2. **Bottom content hidden behind mobile browser/OS bars** — `#app` is a `100vh` scroll-snap container; 26 `height:100vh` declarations, no `dvh`/`env(safe-area-inset-*)`/`viewport-fit=cover` anywhere. Victims: last header CTAs, timeline date pagination, home MoreButtons.
3. **Menu ugly on mobile** (6 icons wrap to 2 rows) — insta + phone hidden on mobile.
4. **Projects cards off-center on mobile** — mobile branch misses centering classes; `.image-card` hard-coded `width:350px`.
5. **Missing content** — social skills physics section, running hobby + mini-games, 8 new projects.
6. **Dead weight/bugs** — unused deps, router bugs, a11y issues, vestigial i18n (to be implemented properly instead: user wants multi-language support).

Decisions: endless hurdles runner concept · all three games this round · new projects as hidden drafts · full low-risk cleanup · real i18n (EN + NL).

---

## Phase A — Cleanup ✅

- [x] Remove unused deps: `vite-plugin-ssr`, `pinia`, `yarn`, `dotenv`, `dotenv-expand`, `@popperjs/core`, `vuejs-form`, `vuejs-validators` (keep `vue-i18n`, `bootstrap`, `gsap`, `swiper`, `animejs`, `lodash`, `matter-js`)
- [x] Remove `createPinia()` from `main.js`; delete empty `src/stores/` and dead `src/assets/js/main.js`
- [x] Router: delete broken `beforeEach` (double `next()`); null-guard `scrollBehavior` with rAF retry for lazy-mounted hash targets
- [x] `utils/Axios.js`: remove undefined `Logger.info` (latent ReferenceError)
- [x] Menu a11y: `aria-describedby` free text → `aria-label`; hamburger div → `<button>` with `aria-expanded`
- [x] Centralize `isMobile()` into `src/utils/device.js` (replaces 10 duplicated copies; last 2 copies disappear with the Phase D rewrite/deletion of ExperienceView + UnderConstruction)
- [x] ProjectsView: remove dead `underConstruction` branch

Deferred (future round): bootstrap SCSS trim · gsap→CSS in SendButton · Menu CSS transitions · axios 1.x bump.

## Phase B — i18n foundation (EN + NL) ✅

- [x] vue-i18n v9 legacy mode; locale from `localStorage` → `navigator.language` (nl → nl, else en); `fallbackLocale: 'en'`
- [x] Real `en.json`/`nl.json` catalogs (menu, home, experience, about, projects, contact, footer, notFound, games)
- [x] Language switcher: round flag select (UK/NL) in the footer via `LocaleSelect.vue` (persists choice) — placement changed from menu per Milo
- [x] Migrate hardcoded UI strings to `$t()`; localized data arrays → computed props; delete 5 empty `$i18n.locale` watchers (ExperienceView's strings land with the Phase D rewrite)
- [x] `localized(field)` helper for per-locale objects `{ en, nl }` in JS data modules
- [x] NL translations drafted (user refines)

## Phase C — Mobile layout & safe-area ✅

- [x] `viewport-fit=cover` in viewport meta
- [x] `@mixin full-height` (100vh fallback + 100dvh) in `_mixins.scss`
- [x] Convert all `height:100vh` declarations to the mixin (remaining: ExperienceView — lands with Phase D rewrite; UnderConstruction — deleted in Phase D)
- [x] Safe-area paddings: timeline `.swiper-pagination`, about mobile `.ctas` (experience `.ctas` lands with Phase D rewrite)
- [x] Menu mobile: hide insta + phone, remaining 4 icons on one clean row
- [x] Projects mobile: flexbox centering (`.row > div` flex column center), `.image-card` fluid width (100%, max 500px), inline paddings → scoped CSS

## Phase D — Physics skills refactor + social skills section

Architecture: drop the Web Worker (freeze was main-thread SVG decomposition, not simulation); matter-js on main thread; primitive collision shapes (chamfered rects/circles/triangles); SVGs only drawn, never decomposed; lazy init via IntersectionObserver; pause when off-screen.

- [ ] `src/config/skills.js` — single source of truth (`programSkills` incl. the missing php; `socialSkills` as colored primitives)
- [ ] `src/utils/physics/SkillsPhysics.js` — engine, walls, spawn queue, drag constraint, resize, destroy
- [ ] `src/utils/physics/SkillsCanvasRenderer.js` — canvas 2D renderer (icons + labeled primitives)
- [ ] `src/components/skills/SkillTooltip.vue` — extracted speech-bubble tooltip
- [ ] `src/components/skills/PhysicsSkillsSection.vue` — reusable section: lazy init, pause/resume, drag & throw (mouse + touch), hover/tap tooltips, page scroll preserved over empty canvas
- [ ] ExperienceView: swap `#program` to the new component
- [ ] ExperienceView: swap `#social` UnderConstruction → social skills section
- [ ] Delete `PhysicsWorker.js`, `PhysicsRenderer.js`, `PhysicsHelper.js`, `UnderConstruction.vue`; drop `pathseg` + `poly-decomp` deps
- [ ] Router hash-scroll works for `#program`/`#social` (done in Phase A guard)

## Phase E — Projects: single data source + 8 draft projects

- [ ] `src/data/slugs.js` (also imported by `vite.config.js` sitemap — fixes missing `player0.0`)
- [ ] `src/data/projects.js` — cards + detail blocks, per-locale text fields, `publishedProjects`/`featuredProjects`/`getProject`
- [ ] Rewire ProjectsView (clone array!), ProjectView (unknown slug → 404), HomeView (featured), vite.config.js
- [ ] 8 new projects as `draft: true` with draft EN+NL copy: jet-cache, rituals-launches, proximus-monopoly, heineken-fhmf, wehkamp (LiveWall/black) · espressions, drinking-games, marathon-planner (hobby/blue)
- [ ] Per project later: banner image (~1200×800) + approved copy → flip `draft: false`

## Phase F — Hobbies: Running + three mini-games

- [ ] F1: extract `FootballField.vue`/`WaterpoloField.vue`; hobbies config array; new `RunningTrack.vue` CSS visual
- [ ] F2: scaffolding — `GameOverlay.vue`, `GameLoop.js` (fixed timestep), `Input.js` (pointer events, multi-pointer), `HighScores.js` (localStorage); lazy-loaded games; Play button per field
- [ ] F3: `RunnerGame.vue` — endless hurdles runner (tap/click/Space jump, speed ramp, distance high-score)
- [ ] F4: `PenaltyGame.vue` — waterpolo 5m shootout (drag-back aim + power, keeper zone AI, 5 shots)
- [ ] F5: `AirHockeyGame.vue` — air-hockey-style football: 1P vs AI or 2P local (multi-touch / mouse+WASD), hand-rolled 120Hz physics with substeps, first to 5

## Verification checkpoints

- [ ] After A: dev + build clean, all routes ok, contact form POSTs, keyboard-usable hamburger
- [ ] After B: live locale switching everywhere, persisted, no missing-key warnings
- [ ] After C: real-device check — CTAs/dates above OS bars, snap alignment, menu row, centered project cards 320–767px, desktop unchanged
- [ ] After D: /experience instantly interactive, lazy physics, all 6 skills correct, drag/throw + tooltips both locales, scroll preserved, build clean
- [ ] After E: 10 projects unchanged, navigate-away-and-back keeps list full, sitemap complete, drafts invisible
- [ ] After F: fields pixel-identical, games load lazily, close/ESC works, high scores persist, no rAF leaks, air hockey 1P/2P + no tunneling

## Open items

- Social skill descriptions, 8 project copy blocks, and NL translations are drafts — refine per item with Milo
- Milo supplies 8 project banner images to flip drafts live
- NL for the 10 existing project detail pages: incremental (EN fallback until then)
