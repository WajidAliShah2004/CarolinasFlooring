# Concept A Homepage — Visual Refinement

**Date:** 2026-09-24
**Extends:** `2026-09-23-concept-a-homepage-design.md`. Everything there still holds unless it is changed below.
**Goal:** Make the homepage bolder and more premium ("more navy"), give it a stronger hero, and improve the phone experience. The palette, section order and all functional behaviour stay the same.

## 1. Decisions

| Topic | Decision |
|---|---|
| Direction | Bolder, more navy: alternating navy / white / pale bands, larger type |
| Hero photo | Refinished staircase (`refinished-stairs-0001.jpg`) |
| Orange on navy | Allowed for **large text and UI elements only**. Measured: `#F76900` on `#152A46` = 4.8:1, on `#1F3A5F` = 3.8:1, both ≥ 3:1 (WCAG large text / non-text). Orange text at body size is never placed on navy. A unit test guards this against future palette changes (C1). |
| Video band | Stays navy; separated from the hero by a 4px orange rule (the hero's bottom border) |
| Header | White at the top of the page; solid navy once scrolled past 80px |

## 2. Hero (S1)

- Section background `navy-deep`, with a 4px `syracuse` bottom border as the rule separating it from the video band.
- **Desktop (≥768px):**
  - Two columns: text on the left, the staircase photo on the right in a 4:5 rounded frame.
  - Headline in white at the `md:text-6xl` size, with "one person" in orange.
- **Mobile (<768px):**
  - The staircase photo is a full-bleed background (decorative, `alt=""`) under an 85% `navy-deep` overlay.
  - Headline at 34px.
  - Both CTAs are full width and stacked.
- Eyebrow at 75% white; lede at 80% white.
- CTAs: the primary stays orange fill with white text. The secondary becomes a **white outline** on dark backgrounds (`DualCta tone="dark"`).
- **Trust strip** below the CTAs, derived from data (no invented claims):
  - "{years} years in flooring"
  - "Owner-led consultations"
  - "1-year workmanship warranty"

  Each item has a small orange dot marker.
- Nothing is inserted between the hero and the video. The rule is a border, not an element.

## 3. Visual system

- **Bands (top to bottom):**

  | Band | Section | Background |
  |---|---|---|
  | Hero | S1 | navy-deep |
  | Video | S2 | navy |
  | Two Ways | S3 | white |
  | Gallery | S4 | white, top rule |
  | See-It | S5 | pale |
  | Brands | S6 | white |
  | About | S7 | **navy** |
  | Reviews | S8 | pale |
  | Contact | S9 | white |
  | Footer | — | navy |

- **Section headings:**
  - Default size becomes `text-3xl md:text-5xl`; the feature size becomes `text-4xl md:text-6xl`.
  - A short orange accent bar (40×4px) sits above every h2.
- **Cards:** thin borders are replaced by a soft shadow (`shadow-soft` utility). This applies to the Two Ways cards, brand tiles, review cards and consultation option cards.
- **About (navy):** white heading and quote, 80% white body, fact cells on `navy-deep`, dark-tone placeholder note.

## 4. Header

- Height 56px on mobile, 72px from `md`.
- At the top of the page the header is white with a navy wordmark (unchanged). After 80px of scroll it is solid navy with a white wordmark and white links.
- The mobile menu panel is always navy with white links.
- The orange "Book" CTA stays in both states. Orange on navy passes at UI size, as measured above.

## 5. Mobile refinements

- **Video band:** padding `py-10 md:py-24`. The player goes edge to edge on phones (`-mx-4 sm:mx-0`, no radius).
- **See-It shelf:** cards are `w-[70%]` on phones, so the next card peeks into view.
- **Gallery:** captions `text-xs sm:text-sm`.
- **About:** the portrait is 1:1 on phones and keeps `md:aspect-[4/5]` on desktop.
- **Contact:** inputs stay at least 48px tall.

## 6. Testing

- `lib/contrast.ts`, with a unit test that reads the colour tokens from `app/globals.css` and asserts:
  - orange vs navy-deep ≥ 3;
  - orange vs navy ≥ 3;
  - white vs navy ≥ 4.5;
  - white vs navy-deep ≥ 4.5;
  - orange-text vs white ≥ 4.5;
  - white vs orange ≥ 3.
- Nav unit test: the header gains `bg-navy` after a scroll past 80px.
- Updated unit tests:
  - Hero: secondary CTA uses `border-white`.
  - About: portrait has `md:aspect-[4/5]`.
- New browser test: after scrolling, the header background is navy.
- All existing browser tests stay unchanged and must pass: fold, links, form, slider, no horizontal scroll.
