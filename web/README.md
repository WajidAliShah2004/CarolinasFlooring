# Carolinas Flooring — production homepage (Concept A)

Built from `docs/superpowers/specs/2026-09-23-concept-a-homepage-design.md`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (Vitest)
npm run test:e2e   # acceptance tests (Playwright, builds first)
```

If Playwright's Chromium isn't installed, run the acceptance tests on an installed browser instead:
`PW_CHANNEL=msedge npm run test:e2e` (or `chrome`).

Deploy: import the repo into Vercel with **Root Directory = `web`**.

## Where things live

| Change | File |
|---|---|
| Business name, phone, email, booking link, social profile URLs | `site.config.ts` |
| Colours (incl. the C1 placeholder blue) | `app/globals.css` `:root` |
| Section order / grafting a Concept B section | `content/home.ts` |
| All copy | `content/copy.ts` |
| Gallery items (photo, video, before/after pair) | `content/gallery.ts` |
| Brands | `content/brands.ts` |
| Reviews | `content/reviews.ts` |
| Lead form fields | `content/leadForm.ts` |

## Still to supply / known stubs

- **Business-card blue (C1):** replace `--brand-navy` / `--brand-navy-deep`, then run `npm run poster`.
- **Social profile URLs:** Google, Facebook, Yelp, Apple — hidden until set in `site.config.ts`.
- **Booking:** `bookingUrl` points to the contact form until the Google appointment schedule exists.
- **Lead form:** mocked (`lib/submitLead.ts`) — nothing is sent. Wire to an `/api/lead` route next.
- **Content:** all copy, reviews and the portrait are placeholders. For the intro video, drop the file at `public/assets/david-intro.mp4` **and** set `introVideo.src` in `content/copy.ts` to `'/assets/david-intro.mp4'` (it is empty until then so nothing 404s).
- **Brand pages:** `/brands/[slug]` is a stub until the product/colour swatch grid is built.
