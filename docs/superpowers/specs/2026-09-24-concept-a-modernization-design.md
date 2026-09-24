# Concept A Homepage — Modernization

**Date:** 2026-09-24
**Extends:** `2026-09-23-concept-a-homepage-design.md` and `2026-09-24-concept-a-visual-refinement-design.md`.
**Goal:** Make the site feel current: a cinematic Meet David block with chapters, subtle motion, richer components (timeline, stats, FAQ, sticky mobile CTA), depth (glass, gradients) and stronger typography — without breaking the client's constraints (no parallax, no auto-motion, orange as accent only, no address/hours/showroom, no outbound links).

## 1. Meet David (S2)

- Numbered label "01 · Meet the owner" above a larger title.
- `VideoPlayer` client component (reusable, K3):
  - 16:9 frame, `rounded-xl`, deep shadow, poster with a navy gradient overlay.
  - Frosted overlay card (bottom-left): owner name, "Owner · in flooring since {startYear}", duration badge (placeholder "~2 min").
  - Centre orange play button (the section's only orange element). Click → overlay hidden, `<video controls preload="none" poster>` plays.
  - Never autoplays. Poster always present.
- Chapter chips under the player from `content/copy.ts` (`introVideo.chapters: {label, seconds}[]`, placeholder times). Click → start playback and seek to `seconds`. Without a video file this fails silently (poster stays).

## 2. Motion

- `Reveal` client component: IntersectionObserver, once; starts `opacity-0 translate-y-4`, ends in place, 600ms ease; optional stagger index (60ms). Under `prefers-reduced-motion` children render visible immediately.
- Counter: the years figure in About counts up over ~1s on first view. Fixed values ("2007", "1 yr") do not animate.
- Hover lift on cards/tiles (`-translate-y-0.5`, deeper shadow); images scale 1.03 in frames.
- Header: frosted glass (`bg-white/70 backdrop-blur-md` at top; `bg-navy/85 backdrop-blur-md` when scrolled).
- No parallax, no auto-rotation, nothing looping.

## 3. Components and layout

| # | Change | Placement |
|---|---|---|
| 1 | Hero: `md:text-7xl` headline, numbered eyebrow, "CF" watermark (`text-white/5`), photo glow | S1 |
| 2 | **Process timeline** (new): Measure & consult → Choose with samples → Install by David's technicians | after Two Ways, white |
| 3 | **Bento stats** (new): large tile with the years counter; small tiles "Owner on every job", "Samples to your home", "1-year workmanship warranty" | after Gallery, white |
| 4 | Gallery: wider container (`max-w-7xl`), first tile spans 2 columns on desktop | S4 |
| 5 | Reviews: five orange star icons, initials avatar, platform pill | S8 |
| 6 | **FAQ accordion** (new): native `<details>`: showroom? / product only? / warranty? / where do you work? (service area marked to confirm) | before Contact, pale |
| 7 | **Sticky mobile CTA bar** (K19): Call + Book, phones only, hidden while `#contact` is in view | global |
| 8 | Numbered section labels ("02 · Services" …) via `SectionHeading number` prop | all sections |

Section order becomes: hero, video, two-ways, **timeline**, gallery, **stats**, see-it, brands, about, reviews, **faq**, contact. Video still directly follows hero.

Depth: navy bands use `bg-gradient-to-b from-navy-deep to-navy`; media `rounded-xl`.

## 4. Copy

All new copy is placeholder and marked with `PlaceholderNote`. FAQ answers derive from the specs only (no showroom → samples at home / meet by appointment; product-only vs product+install; 1-year workmanship warranty + manufacturer warranties; service area "to be confirmed"). Nothing mentions an address, hours, a showroom location, or links out.

## 5. Testing

- Unit: `VideoPlayer` (play reveals video; chapter click seeks + plays, mocked), `Reveal` (observer → visible; reduced motion → visible immediately), `Timeline`, `Stats`, `Faq` (details toggles), `StickyBar` (hidden when contact intersecting), `homeSections` order updated.
- e2e (both projects): existing suite unchanged; add: sticky bar visible at top on mobile and hidden at `#contact`; the Meet David play button reveals a `<video>`.

## 6. Samples carousel (S5) — added 2026-09-24

**Client override, to be flagged to David:** the base spec (§6.1) forbids carousels that move on their own. The client asked for autoplay; the agreed compromise is *gentle autoplay with safeguards*.

- `Carousel` client component (no library): scroll-snap track with the native scrollbar hidden, previous/next arrow buttons, dot indicators, drag/swipe.
- Slides: `rounded-xl`, soft shadow, image zooms 1.05 on hover, gradient caption overlay showing the sample name.
- Autoplay: advances every 4 s and loops. It **pauses** on hover, focus within, touch, while off-screen, and via a visible Pause/Play button; it **never runs** when `prefers-reduced-motion` is set.
- Tests: slides render with captions; next/prev scroll the track; the pause button toggles; autoplay advances after 4 s (fake timers) and does not under reduced motion; hover pauses.

## 7. Reversion to the Concept A mockup look — 2026-09-24

**Client override, to be signed off by David:** the site is restyled to match `01-warm-minimal.html` in full — bone/ink/tan palette, Fraunces serif display type, parquet hero panel, editorial service rows, calm grids. This overrides the base spec's locked white/blue/Syracuse Orange palette (§5). Structural decisions from the docx still apply: no showroom/hours/address/region band, no outbound manufacturer links, consultation options and social links retained, video directly below the hero.

Removed (not in the mockup): timeline, stats grid, FAQ, both autoplay carousels, sticky mobile bar, glass header, watermark, navy gradient bands. Kept: gentle fade/rise reveals (the mockup's `.rise`), cinematic video player with chapters.
