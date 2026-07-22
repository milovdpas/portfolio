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

## Phase D — Physics skills refactor + social skills section ✅

Architecture: drop the Web Worker (freeze was main-thread SVG decomposition, not simulation); matter-js on main thread; primitive collision shapes (chamfered rects/circles/triangles); SVGs only drawn, never decomposed; lazy init via IntersectionObserver; pause when off-screen.

- [x] `src/config/skills.js` — single source of truth (`programSkills` incl. the missing php; `socialSkills` as colored primitives, draft descriptions to refine)
- [x] `src/utils/physics/SkillsPhysics.js` — engine, walls, spawn queue, drag constraint, resize, destroy
- [x] `src/utils/physics/SkillsCanvasRenderer.js` — canvas 2D renderer (icons + labeled primitives)
- [x] `src/components/skills/SkillTooltip.vue` — extracted speech-bubble tooltip
- [x] `src/components/skills/PhysicsSkillsSection.vue` — reusable section: lazy init, pause/resume, drag & throw (mouse + touch), hover/tap tooltips, page scroll preserved over empty canvas
- [x] ExperienceView: swap `#program` to the new component (+ i18n strings, full-height mixin, CTA safe-area)
- [x] ExperienceView: swap `#social` UnderConstruction → social skills section
- [x] Delete `PhysicsWorker.js`, `PhysicsRenderer.js`, `PhysicsHelper.js`; drop `pathseg` + `poly-decomp` deps
- [x] `UnderConstruction.vue` KEPT by request (modernized: i18n, shared isMobile, full-height mixin) — reusable placeholder for any section being worked on: `<UnderConstruction id="section-anchor"/>`
- [x] Router hash-scroll works for `#program`/`#social` (done in Phase A guard)
- [x] Verified headless-browser smoke test: all 6 program icons spawn, hover tooltip shows, drag/throw flings bodies, social shapes render with labels, zero console errors
- [x] Title-letters feature (Milo's idea): section titles ("Program Skills" / "Social Skills") spelled as static physics letters below the spawn button; shapes that hit a letter knock it loose (chain reactions free neighbours); loose letters are grabbable/throwable; buttons simplified to "Click me"/"Klik mij"; title re-layouts on locale switch/resize while still intact
- [x] Triangle labels centered (removed off-center nudge, constrained label width to triangle cross-section)
- [x] Loyalty social skill added (pink circle, Friethuys/LiveWall story)
- [x] Bigger title letters (115px desktop / 52px mobile, auto-shrinks for narrow screens); title anchored below the button's real bottom edge (no overlap on wide screens)
- [x] Shape-accurate hitboxes: F# = diamond, Vue = down-triangle, Node.js = pointy-top hexagon (generic drawOffset keeps icons aligned with asymmetric bodies); `hitboxScale` config option for padded icons
- [x] Triangle labels constrained to the incircle (stays clear of all three edges at any rotation)
- [x] Icon-less shapes shrink less on mobile (0.65 vs 0.5) so labels stay readable
- [x] Grab/grabbing cursor feedback on hover/drag

## Phase E — Projects: single data source + 8 draft projects ✅

- [x] `src/data/slugs.js` (imported by `vite.config.js` for the sitemap — fixes missing `player0.0`)
- [x] `src/data/projects.js` — cards + detail blocks, per-locale `{en, nl}` text fields (ALL 10 existing projects fully translated to Dutch, drafts to refine), `publishedProjects`/`featuredProjects`/`getProject`
- [x] Rewire ProjectsView (clone array!), ProjectView (unknown slug → 404), HomeView (featured), vite.config.js; ImageCard resolves per-locale fields itself so cards re-translate live
- [x] 8 new projects as `draft: true` with draft EN+NL copy: jet-cache, rituals-launches, proximus-monopoly, heineken-fhmf, wehkamp (LiveWall/black) · espressions, drinking-games, marathon-planner (hobby/blue)
- [x] Verified in browser: 10 cards + load-more + counter, list resets after navigating away/back, detail pages EN+NL, unknown slug → 404, home shows 3 featured, zero console errors
- [ ] Per project later: banner image (~1200×800) + approved copy → flip `draft: false` and add slug to `data/slugs.js`

## Phase F — Hobbies: Running + three mini-games

- [x] F1: extract `FootballField.vue`/`WaterpoloField.vue`; hobbies config array; running visual = `RunningRoute.vue` (switchback road through nature — Milo runs long distance, not track; changed from stadium track per Milo)
- [x] F2: scaffolding — `GameOverlay.vue` (close ✕ + ESC, hides menu while playing), `GameLoop.js` (fixed timestep), `Input.js` (pointer events, multi-pointer, captures Space/arrows/WASD so the page doesn't scroll), `HighScores.js` (localStorage); lazy-loaded games; Play button per field
- [x] F3: `RunnerGame.vue` — pixel-art marathon runner (design evolved with Milo): 42.195 km finish with time as high score, energy bar + water stations (grab only while grounded), The Wall at 30 km (world dims, double drain), stumble instead of instant death, environments by distance: city → farmer fields (maize!) → forest → mountains, beer friends at the roadside (golden mug pixel sprite; sprint boost ×1.6 speed / ×2.5 drain for 4s, yellow energy bar + speed streaks), finish confetti, controls: tap/click/Space/W/↑. Debug hook: `window.__RUNNER_START_KM`. Verified end-to-end in browser incl. finish panel + boost.
- [x] Route visual U-turn alignment fixed (ring height off by half a road width); mountains moved clear of the right turn
- [x] Route seams perfected: turn edge lines drawn inside the ring via pseudo-elements to match the straights' borders + 3px overlap against hairlines (verified with close-up screenshots)
- [x] Themed pixel obstacles per environment (Milo's picks): dixi toilet box (city), sheep (fields), chopped tree stump + felled piece (forest), 'ye' album-cover homage with green scrawl (mountains)
- [x] Play button pulse + radar-ping animation
- [x] Obstacle spawns keep ≥300px clearance from water stations and beer friends (checked against the full pickup schedule; conflicting spawns retry shortly after)
- [x] Game intro/result panels widened on mobile
- [x] F4: `PenaltyGame.vue` — waterpolo penalty (redesigned with Milo): HALF pool top-down with white/red/yellow lines + goal net, pixel-art players (white cap shooter, black cap defenders, red cap keeper), 3 fixed defenders blocking lanes, keeper sliding left↔right (speeds up after every conceded goal), 5 shots with dot tally, outcomes goal/saved/blocked/missed, best score saved. Verified full playthrough in browser.
- [x] F4 shooting = SWIPE, model finalized against Milo's real logged gestures (he curls shots — "right/left" meant right-curve/left-curve): DIRECTION = overall swipe chord (start→end); CURVE = the side the swipe path BULGES toward = the side the ball curves (max signed perpendicular deviation from the chord, dead zone 0.1 of length, gain 6, cap 0.75 rad/s); SPEED = fastest 60-140ms window (handles decel before lift). All 5 of Milo's replayed curve gestures now curve the correct way (right→+omega, left→−omega). Swipe telemetry still on (TODO remove after Milo confirms feel): on-screen debug line + `[penalty swipe]` console logs + `window.__PENALTY_SWIPES`.
- [x] F4 variety (per Milo): 4 defender formations + 5 shooter start positions on the 5m line, a fresh combo picked each shot (no immediate repeat).
- [x] F4 curve model — iterated with Milo's real logs; final model = AIM-ASSISTED CURL (his "curve to where my finger stops"): ball LAUNCHES along the swipe's initial heading (go wide around a defender) and curves exactly enough to ARRIVE at where the whole swipe points (start→lift extended to the goal line), via a constant-turn arc solved through the target (R = -|d|²/(2 n·d), omega = speed/R). Auto-scales the curl so it never under/overshoots — replaced the proportional-bend model that under-curved gentle hooks and wildly over-curved decisive ones. Defender hitbox trimmed 22→17 so a curl grazing past gets through. Verified via replay: straight 0px off aim; left-launch→aim-right 2px off (goal); right-launch→aim-left 4px off (goal). Confirmed by Milo, then ALL swipe telemetry stripped (on-screen debug line, `[penalty swipe]`/`[penalty result]` console logs, `window.__PENALTY_SWIPES`/`__PENALTY_RESULTS`, shotContext/trajectory capture). Verified post-strip: no debug element, no penalty console logs, no errors, build clean.
- [x] Em-dashes removed from all user-visible copy (i18n catalogs, skills descriptions, project texts) per Milo
- [x] F5: `AirHockeyGame.vue` — air-hockey-style football on the football field: 1P vs AI or 2P local, hand-rolled 120Hz physics with 4 substeps, first to 5. Simulation runs in logical goal-to-goal coordinates; one canvas transform renders it horizontal on desktop, vertical on mobile (P1 defends the bottom goal). Controls: drag (pointer starting in your half grabs your striker; 1P any touch), P1 arrows (+WASD in 1P), P2 WASD in 2P, multi-touch on mobile. Pixel-art top-down footballers on team-colored mallet bases (red vs blue), goal nets in wall pockets, mow stripes. Striker impulses use a ~50ms smoothed velocity (raw substep velocity is quantized by 60Hz pointer events; hits would randomly whiff). High score: 1P win streak (current + best, localStorage); 2P untouched. Verified end-to-end headless (both orientations, both modes, goal lines, serve-to-conceder, rematch, streak persistence, zero console errors).
- [x] F5 AI tuning per Milo (defense was near-impossible to beat): slower base (250) + 60% speed while defending, 0.12s reaction delay, defensive tracking undershoots (0.32 gain) so corner shots fit, and the AI only attacks a slow ball instead of suicide-blocking fast shots. Difficulty ramps within a match (+50 px/s per player goal) AND with the 1P win streak (up to +240 px/s, faster reactions, wider coverage at 8+ streak) so the first match stays friendly and a streak gets progressively harder.

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
