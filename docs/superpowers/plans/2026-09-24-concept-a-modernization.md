# Concept A Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `docs/superpowers/specs/2026-09-24-concept-a-modernization-design.md`.

**Architecture:** New client components (`VideoPlayer`, `Reveal`, `Counter`, `StickyBar`) and new sections (`Timeline`, `Stats`, `Faq`) added to `homeSections`. No new dependencies; motion is CSS transitions driven by IntersectionObserver.

**Tech Stack:** unchanged.

## Global Constraints

- All constraints from the two earlier plans still apply. No parallax; nothing auto-plays or auto-rotates; nothing between `#top` and `#video`.
- New copy is placeholder, derived from the specs, marked with `PlaceholderNote`. No address, hours, showroom location or outbound links.
- Every existing unit and e2e test must keep passing except where a task explicitly updates it.
- TDD per task; commit per task.

---

### Task 1: Reveal, Counter and motion primitives
- Files: `components/motion/Reveal.tsx`, `components/motion/Counter.tsx`, tests for each; `vitest.setup.tsx` gets an IntersectionObserver mock.
- `Reveal({ children, delay?: number, className?, as?: 'div'|'li' })`: renders with `data-revealed` toggled by IO (threshold 0.15, once). Classes: `transition-all duration-700 ease-out` + (`opacity-0 translate-y-4` until revealed). Under reduced motion (`matchMedia('(prefers-reduced-motion: reduce)').matches`) start revealed.
- `Counter({ to: number, duration?: number })`: renders `to` immediately under reduced motion; otherwise counts from 0 via rAF on first intersection.
- Tests: Reveal starts hidden, becomes visible when the mocked observer fires; visible immediately under reduced motion. Counter shows final value after the mocked observer fires + timers.

### Task 2: VideoPlayer and Meet David
- Files: `components/blocks/VideoPlayer.tsx` (+test), `components/sections/IntroVideo.tsx` (+test update), `content/copy.ts` (`introVideo.chapters`, `duration`, `label`).
- `VideoPlayer({ src, poster, title, subtitle, duration, chapters })`. State `playing`. Overlay: gradient, frosted card, orange play button (`aria-label="Play video: {title}"`). On play: `video.play()` (ignore rejection). Chapter chips: `button` each; click → `playing=true`, set `currentTime`, play.
- Tests: play button reveals `<video controls preload="none" poster>`; chapter click sets `currentTime` and calls `play` (mock `HTMLMediaElement.prototype.play`).

### Task 3: Sections — Timeline, Stats, Faq, StickyBar; Reviews upgrade
- Files: `components/sections/Timeline.tsx`, `Stats.tsx`, `Faq.tsx`, `components/StickyBar.tsx`, `components/blocks/ReviewCard.tsx`, `content/copy.ts` additions, tests.
- Timeline: `ol` with 3 `li`, numbered, connector line on md.
- Stats: bento grid: large tile (Counter of years + "years in flooring"), three small tiles from `stats.items`.
- Faq: `details/summary` list from `faq.items`, chevron rotates when open.
- StickyBar: `md:hidden fixed bottom-0`, two links (Call tel:, Book), hidden (`translate-y-full`) when `#contact` intersects (IO). Rendered from `layout.tsx`.
- ReviewCard: five `Star` icons (`text-syracuse`, `fill-current`, h-4), initials avatar circle, platform pill.
- Tests: Timeline 3 steps; Stats shows years; Faq toggles `open`; StickyBar hides when observer reports intersecting; ReviewCard has 5 stars and initials.

### Task 4: Hero, header glass, typography, gallery bento, numbered labels
- Hero: `md:text-7xl`, watermark span `aria-hidden` with `text-white/5 select-none`, photo frame `rounded-xl ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,.6)]`.
- Nav: frosted classes.
- `SectionHeading` gains `number?: string` rendered as "02 · Title-label" eyebrow.
- Gallery: `max-w-7xl` container variant (`Container size="wide"`), first item `md:col-span-2` (aspect 16/9 there), all tiles in `Reveal` with stagger; hover scale.
- Cards: hover lift classes.
- Tests: SectionHeading renders number; Gallery first tile has `md:col-span-2`.

### Task 5: Assemble, e2e, verify
- `content/home.ts` order: hero, video, two-ways, timeline, gallery, stats, see-it, brands, about, reviews, faq, contact; update `home.test.ts`.
- e2e additions: sticky bar visible at top / hidden at contact (mobile project only via `test.skip` on desktop); play button reveals video.
- Run: unit, lint, build, e2e (msedge), screenshots.
