# Carolinas Flooring — website design proposal

Four design concepts for David A. Gwilt (carolinasflooring.com), plus a landing
page that links to all four.

Open `index.html` to start. Everything works with no internet connection and no
third-party services — fonts are embedded in each file, all images are local.

## Deploying to Vercel

Drag this folder into Vercel, or run `vercel` from here. No build step and no
configuration needed: it is plain static HTML. `index.html` becomes the root
URL, and the four concepts sit at `/01-warm-minimal.html` and so on.

## The four concepts

| File | Concept | Character |
|---|---|---|
| `01-warm-minimal.html` | **A · Warm Minimal** | Editorial and premium. Bone/ink/tan, serif display, basketweave-parquet motif. |
| `02-carolina-dark.html` | **B · Carolina Dark** | Cinematic and video-first. Near-black with a single amber accent. |
| `03-clean-slate.html` | **C · Clean Slate** | Swiss grid, precise, contractor-professional. Spec table, ruler rule, numbered install process. |
| `04-natural-craft.html` | **D · Natural Craft** | Warm and residential. Floor plan showing which floor suits which room. |

All four share the same content: hero, David's video, four products, ten
finished-job photos, the showroom, about David, reviews and warranty, contact.

## Dropping in the video

Save the finished David Gwilt cut as:

    assets/david-intro.mp4

All four pages already contain a real `<video>` element pointing at that path.
Nothing else needs changing. Until then each page shows a poster frame.

## Photographs

19 of David's own photos, pulled from the About page of the current site:

- `assets/photos/` — 10 finished jobs, 9 showroom displays
- `assets/david.jpg` — portrait, also used to build the video poster frames
- `assets/logo.jpg` — the existing logo, shown in every footer
- `assets/floor-1.jpg` — his Carolinas lake photo, used behind the region band

Three of the job photos (`lvp-1-2`, `lvt`, `after-repair-and-new-lvp-install`)
are only ~320px on the original site — that is the largest version that exists.
They are placed in smaller tiles. Replacing them with full-size originals would
help.

## What still needs to come from David

Marked in the pages as `[TO CONFIRM]`:

- Showroom address
- Opening hours
- Service area — which towns and counties
- Confirmation the brand list is current (Shaw, Mohawk, COREtec, Somerset,
  DreamWeaver, Chesapeake, Amorim — read off the display photos)
- Review counts, and whether to embed live Google/Facebook/Yelp feeds

Everything else is taken verbatim from the existing site: founded 2007, 17+
years, David's Syracuse background, the one-year workmanship warranty,
manufacturer product warranties, the 5-star review claim, phone and email.

## Notes

- Contact forms and phone buttons are **inert** — visual mockups, not a working site.
- The dark strip at the top of each concept labels it for review. It is not part
  of the design and comes out of the final build.
- Verified: no horizontal scrolling from 360px to 1920px, no broken images,
  pages render correctly with JavaScript disabled, `prefers-reduced-motion`
  respected.
