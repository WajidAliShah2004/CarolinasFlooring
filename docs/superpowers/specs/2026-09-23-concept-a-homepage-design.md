# Concept A Production Homepage — Design

**Date:** 2026-09-23
**Sources:** `Gwilt Flooring - Concept A Design and Template Specification.docx` (v1.0), `Gwilt Flooring - Concept A Website Build Specification.docx` (v1.0), mockup `01-warm-minimal.html`.
**Goal:** Build the Concept A homepage as a production Next.js app, restructured and recolored per the specs, with placeholder content and stubbed conversion (form + booking).

## 1. Decisions taken in brainstorming

| Topic | Decision |
|---|---|
| Deliverable | Production homepage only (interior pages later) |
| Stack | Next.js (App Router, TypeScript) + Tailwind + shadcn/ui (Radix), deployed on Vercel |
| Blue (C1) | Provisional navy `#1F3A5F` in the token layer, labelled `C1 PLACEHOLDER`; swap when the card is scanned |
| Orange (C2) | `#F76900` (Syracuse Orange, Pantone 165 C); text-safe variant `#C74A00` |
| Form / booking | UI only. Form validates and shows a mocked success/failure. Booking CTAs link to `site.bookingUrl` (stub) |
| Branding | All business facts in `site.config.ts`; default "Carolinas Flooring" / "David A Gwilt LLC" |
| S9 deletion | The mockup has no "highest standards" heading. The block in the S9 slot, "Floors that have to live in the Carolinas." (region band), is the one deleted |
| S11/S12 | Showroom row and Hours row removed from the contact panel |
| Recommended extras | Before/after slider (K6) only. Sticky call bar, video facade, per-path CTAs are excluded |

## 2. Architecture

The app lives in `web/`. The mockups and `index.html` at the repo root are untouched (Concept B is the donor; 3 and 4 are archived, not deleted).

```
web/
  site.config.ts        # businessName, legalName, phone, email, domain, startYear: 2007,
                        # bookingUrl, social: {google, facebook, yelp, apple}
  app/
    layout.tsx          # next/font (Inter), <Nav/>, <Footer/>
    page.tsx            # renders homeSections in order
    brands/[slug]/page.tsx  # stub: brand name, "product range coming soon", Book a Consultation CTA
    globals.css         # Tailwind layers + CSS-variable tokens
  content/
    home.ts             # homeSections: ordered array of section components + placeholder copy
    gallery.ts          # GalleryItem = photo | video | pair
    brands.ts           # {name, slug}[]
    reviews.ts          # {quote, author, platform}[]
    leadForm.ts         # field definitions array
  components/
    ui/                 # shadcn: button, input, textarea, label, slider
    sections/           # Hero, IntroVideo, TwoWays, Gallery, SeeItFirst, Brands, About, Reviews, Contact
    blocks/             # DualCta, BeforeAfter, ReviewCard, LeadForm, SocialRow, ConsultOptions, BrandGrid
    Nav.tsx, Footer.tsx
  lib/years.ts          # yearsOfExperience(now = new Date()) => now.getFullYear() - site.startYear
  lib/validateLead.ts   # pure validation used by LeadForm
  public/assets/        # copied from repo /assets
```

**Hybrid rule (modularity).** The homepage section order is defined only by the `homeSections` array. Each section is self-contained and takes no dependency on its neighbours' markup. Adding a Concept B section means adding one component and one array entry.

**Tokens.** shadcn CSS variables are mapped to the palette and exposed to Tailwind:

| Token | Value | Use |
|---|---|---|
| `--primary` | `#1F3A5F` (C1 PLACEHOLDER) | Nav, footer, headings, secondary button outlines |
| `--primary-deep` | derived darker shade of primary | Section backgrounds, hover |
| `--background` / `--card` | `#FFFFFF` | Page, cards, inputs |
| `--accent` | `#F76900` | Primary CTA fill, highlighted headline words, focus ring, icons |
| `--accent-text` | `#C74A00` | Any orange at body size on white |
| `--foreground` | `#2B2B2B` | Body copy |
| `--border` | `#D8DEE5` | Rules, borders, input outlines |

No fourth hue. Type: Inter only, body ≥ 17px desktop, no light weights for body. Style: generous section spacing, strict shared content width, minimal ornamentation (no gradients or heavy shadows), shadcn defaults restyled to match.

## 3. Homepage sections (in order)

1. **Hero (K1, K2).**
   - Text headline built from `yearsOfExperience()`, with one phrase highlighted in orange at large size.
   - Primary CTA "Book a Consultation": orange fill, white text, links to `bookingUrl`.
   - Secondary CTA "Watch My Story": blue outline, links to `#video`.
   - Right-hand panel is a real flooring photo.
   - Headline and both CTAs are above the fold at 1440×900 and at 375×812. On mobile the image drops below the CTAs.
2. **Intro video (K3).**
   - Placed directly after the hero; nothing may be inserted between them.
   - Native `<video controls preload="none" poster=…>`, never autoplays.
   - Fixed 16:9 frame. Renders the poster alone if the video file is absent.
3. **Floors, Two Ways (K4).**
   - Two equal-weight cards: "Just the product" / "Product + installation".
   - Stacks on mobile. Copy is marked placeholder (the client is writing it).
4. **Gallery (K5, K6).**
   - One grid with enforced aspect ratios for all items.
   - `photo` items use `next/image`. `video` items show a poster with a play button that swaps in a `<video>`.
   - `pair` items render `BeforeAfter`: a Radix Slider controlling a clip-path reveal, keyboard- and touch-operable, with an ARIA label. With one image missing it degrades to a single image.
   - Two columns on mobile. The seed data includes one placeholder pair.
5. **See It Before You Buy It (K7).**
   - Full-width feature block with the display-photo shelf.
   - Copy rewritten to avoid any showroom or location reference.
6. **Brands (K8).**
   - Styled-text grid from `brands.ts` (Shaw, Mohawk, COREtec, Somerset, DreamWeaver, Chesapeake, Amorim) that reflows at any count.
   - Each brand links to `/brands/[slug]`. Zero outbound manufacturer links.
7. **About (K10).**
   - Portrait slot fixed at 4:5 (required supply: ≥ 1600×2000), currently showing the existing photo with a "to be replaced" note in content.
   - Years fact is computed. Bio is placeholder.
8. **Reviews (K11).**
   - Three static cards with platform attribution. No auto-rotation.
   - Placeholder quotes are labelled as placeholders.
9. **Start the Conversation (K12, K13, K14, K16).**
   - Lead form beside the business panel; the form comes first on mobile.
   - Form fields are defined in `leadForm.ts`:
     - Name, required.
     - Email, required, format-validated.
     - Phone, required, `type="tel"`, `inputMode="tel"`.
     - "What you're looking for", required textarea with placeholder "Which rooms, roughly how much space, what kind of flooring, and when you'd like it done."
   - Hidden honeypot field.
   - The panel shows phone, email and business name, plus `ConsultOptions`: samples brought to your home, or meet by appointment. A savings line sits beside them: no brick-and-mortar overhead, and the savings are passed on.
   - `SocialRow` holds Google, Facebook, Yelp and Apple links: ≥ 44px tap targets, `target="_blank" rel="noopener"`, and an item is hidden if its URL is unset.
   - No address, hours, map, directions or address structured data.

**Nav (K17).** Logo/name · Work · Services · About · Reviews · Contact (homepage anchors) · persistent orange "Book a Consultation". Mobile menu uses a burger.
**Footer (K18).** Name, phone, email, SocialRow, © legal name. No address, no outbound manufacturer links.

**Removed from the mockup:** region band (S9), Showroom and Hours rows (S11/S12), "Showroom" nav link, proposal bar, parquet motif, brown palette, serif display font.

## 4. Rules

- Orange ≤ ~5% of any viewport. Only the primary CTA in a section is orange. Never orange on blue. Orange buttons always carry white text.
- Focus: orange ring plus offset outline, so colour is not the only indicator.
- Motion: optional gentle fade/rise on scroll only, disabled under `prefers-reduced-motion`.
- Images: `next/image` with explicit sizes; lazy-load below the fold; aspect-ratio boxes on every media slot to avoid layout shift.

## 5. Error handling

- **LeadForm.**
  - `validateLead()` returns per-field errors, shown inline (`aria-invalid`, `aria-describedby`).
  - Submit disables the button, waits ~800 ms (mock), then shows a success panel.
  - A mock failure path (triggered when the honeypot is filled, or a `?formError=1` query in dev) shows a retry message.
- **Missing assets.** Video missing → poster only. Gallery image missing → neutral tile. Social URL missing → icon hidden.

## 6. Testing

- **Vitest.**
  - `yearsOfExperience` at 2026 returns 19, and increments in 2027.
  - `validateLead` covers required fields and email/phone formats.
  - `homeSections[1]` is the IntroVideo, directly after the Hero.
- **Playwright** at 375×812 and 1440×900:
  - both hero CTAs are within the initial viewport;
  - every `<a href>` is internal or one of the four configured social URLs;
  - the page contains no "Hours" or "Showroom address" text;
  - the form shows inline errors when empty and the success state when valid;
  - the before/after slider moves with the arrow keys;
  - no horizontal scroll.
- `next build` passes (types + lint).

## 7. Out of scope

- Real email delivery and the `/api/lead` route.
- The Google booking embed.
- Brand and product page content, and the swatch grid (K9).
- Other interior pages.
- Sticky call bar (K19), video click-to-load facade, per-path CTAs, analytics.
- Final copy, the real C1 blue, the new portrait and the intro video.
