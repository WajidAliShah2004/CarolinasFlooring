# Concept A Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply `docs/superpowers/specs/2026-09-24-concept-a-visual-refinement-design.md`: a navy hero with the staircase photo, alternating bands, bigger headings with orange accent bars, soft-shadow cards, a navy-on-scroll header, and mobile refinements.

**Architecture:** Styling changes inside the existing section and block components, with no new sections. A new `lib/contrast.ts` guards the orange-on-navy pairing against future palette changes. `DualCta` gains `tone` and `fullWidthMobile` props.

**Tech Stack:** Same as the base plan (Next 16, Tailwind 4, Vitest, Playwright).

## Global Constraints

- Every Global Constraint in `2026-09-23-concept-a-homepage.md` still applies, except: orange **large text / UI elements** may sit on navy (measured ≥ 3:1). Orange **body-size text** on navy is still forbidden.
- Nothing may be inserted between `#top` and `#video`. The orange rule is `border-b-4 border-syracuse` on the hero.
- All existing unit and browser tests must still pass. Only the Hero and About unit tests change, and only as listed.
- Commands run from `web/`; commits from the repo root.

---

### Task 1: Contrast guard and soft-shadow utility

**Files:**
- Create: `web/lib/contrast.ts`, `web/lib/contrast.test.ts`
- Modify: `web/app/globals.css` (append a `@utility`)

**Interfaces:**
- Produces: `luminance(hex: string): number`, `contrastRatio(a: string, b: string): number`, and the Tailwind class `shadow-soft`.

- [ ] **Step 1: Failing test** — `web/lib/contrast.test.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

const css = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
const token = (name: string) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1];
};
const WHITE = '#FFFFFF';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', WHITE)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, WHITE)).toBeCloseTo(1, 5);
  });
});

describe('palette pairings (spec 2026-09-24 §1) — re-check whenever C1 blue changes', () => {
  const navy = token('brand-navy');
  const navyDeep = token('brand-navy-deep');
  const orange = token('brand-orange');
  const orangeText = token('brand-orange-text');

  it('orange large text / UI on navy is at least 3:1', () => {
    expect(contrastRatio(orange, navyDeep)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(orange, navy)).toBeGreaterThanOrEqual(3);
  });
  it('white text on navy is at least 4.5:1', () => {
    expect(contrastRatio(WHITE, navyDeep)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(WHITE, navy)).toBeGreaterThanOrEqual(4.5);
  });
  it('text-safe orange on white is at least 4.5:1', () => {
    expect(contrastRatio(orangeText, WHITE)).toBeGreaterThanOrEqual(4.5);
  });
  it('white button text on orange is at least 3:1 (large text)', () => {
    expect(contrastRatio(WHITE, orange)).toBeGreaterThanOrEqual(3);
  });
});
```
- [ ] **Step 2:** Run `npx vitest run lib/contrast.test.ts`. Expected: FAIL, "Failed to resolve import './contrast'".
- [ ] **Step 3: Implement** `web/lib/contrast.ts`:
```ts
// WCAG 2.x relative luminance and contrast ratio.
function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
```
Append to `web/app/globals.css`:
```css
@utility shadow-soft {
  box-shadow: 0 1px 3px rgb(21 42 70 / 0.08), 0 10px 28px -14px rgb(21 42 70 / 0.22);
}
```
- [ ] **Step 4:** Run `npx vitest run lib/contrast.test.ts`. Expected: PASS (5 tests).
- [ ] **Step 5:** Commit: `feat(web): contrast guard for palette pairings and soft-shadow utility`.

---

### Task 2: DualCta tone, heading accent bars, soft cards

**Files:**
- Modify: `web/lib/cta.ts`, `web/components/blocks/DualCta.tsx`, `web/components/layout/SectionHeading.tsx`, `web/components/sections/TwoWays.tsx`, `web/components/sections/Brands.tsx`, `web/components/blocks/ReviewCard.tsx`, `web/components/blocks/ConsultOptions.tsx`
- Test: `web/components/blocks/DualCta.test.tsx` (new)

**Interfaces:**
- Produces:
  - `ctaSecondaryDark: string`
  - `DualCta({ primary, secondary?, className?, tone?: 'light' | 'dark', fullWidthMobile?: boolean })`

- [ ] **Step 1: Failing test** — `web/components/blocks/DualCta.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DualCta } from './DualCta';

const primary = { label: 'Book', href: '/#contact' };
const secondary = { label: 'Story', href: '#video' };

describe('DualCta', () => {
  it('uses a navy outline secondary on light backgrounds', () => {
    render(<DualCta primary={primary} secondary={secondary} />);
    expect(screen.getByRole('link', { name: 'Story' }).className).toContain('border-navy');
  });
  it('uses a white outline secondary on dark backgrounds', () => {
    render(<DualCta primary={primary} secondary={secondary} tone="dark" />);
    expect(screen.getByRole('link', { name: 'Story' }).className).toContain('border-white');
  });
  it('can stretch both buttons full width on phones', () => {
    render(<DualCta primary={primary} secondary={secondary} fullWidthMobile />);
    for (const name of ['Book', 'Story']) {
      expect(screen.getByRole('link', { name }).className).toContain('w-full');
    }
  });
});
```
- [ ] **Step 2:** Run `npx vitest run DualCta`. Expected: FAIL (two assertions fail: no `border-white`, no `w-full`).
- [ ] **Step 3: Implement.** Append to `web/lib/cta.ts`:
```ts
export const ctaSecondaryDark =
  'inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white px-7 text-[1.1875rem] font-semibold text-white transition-colors hover:bg-white hover:text-navy';
```
Replace `web/components/blocks/DualCta.tsx`:
```tsx
import Link from 'next/link';
import { ctaPrimary, ctaSecondary, ctaSecondaryDark } from '@/lib/cta';
import { cn } from '@/lib/utils';

type Cta = { label: string; href: string };
type Props = {
  primary: Cta;
  secondary?: Cta;
  className?: string;
  /** 'dark' = on a navy background: the secondary becomes a white outline. */
  tone?: 'light' | 'dark';
  fullWidthMobile?: boolean;
};

/** K2 — primary = orange fill, secondary = outline. Only one orange CTA per section. */
export function DualCta({ primary, secondary, className, tone = 'light', fullWidthMobile = false }: Props) {
  const width = fullWidthMobile ? 'w-full sm:w-auto' : '';
  return (
    <div className={cn('flex flex-wrap gap-3', fullWidthMobile && 'flex-col sm:flex-row', className)}>
      <Link href={primary.href} className={cn(ctaPrimary, width)}>{primary.label}</Link>
      {secondary && (
        <Link href={secondary.href} className={cn(tone === 'dark' ? ctaSecondaryDark : ctaSecondary, width)}>
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
```
In `SectionHeading.tsx`, change the size classes to `size === 'feature' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl'` and insert `<span aria-hidden className="mb-4 block h-1 w-10 rounded-full bg-syracuse" />` as the first child of the wrapper `div`.

Soft cards, replacing `border border-border` with `shadow-soft`:
- `TwoWays.tsx` `li`: `rounded-md bg-white p-8 shadow-soft`
- `Brands.tsx` link: `flex min-h-20 items-center justify-center rounded-md bg-white px-4 text-center text-lg font-semibold text-navy shadow-soft transition-shadow hover:ring-2 hover:ring-navy`
- `ReviewCard.tsx` `figure`: `h-full rounded-md bg-white p-6 shadow-soft`
- `ConsultOptions.tsx` `li`: `rounded-md bg-white p-5 shadow-soft`
- [ ] **Step 4:** Run `npx vitest run`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat(web): dark-tone CTAs, heading accent bars and soft-shadow cards`.

---

### Task 3: Navy hero with staircase photo and trust strip

**Files:**
- Modify: `web/content/copy.ts` (`hero.image`, add `hero.trust`), `web/components/sections/Hero.tsx`, `web/components/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `DualCta` (`tone`, `fullWidthMobile`)
- Produces: `hero.trust(years: number): string[]`

- [ ] **Step 1: Update tests** in `Hero.test.tsx`:
  - In "renders both CTAs…", change `expect(links[1].className).toContain('border-navy')` to `toContain('border-white')`.
  - Add:
```tsx
  it('shows a data-derived trust strip', () => {
    render(<Hero />);
    expect(screen.getByRole('list', { name: 'Why David' })).toHaveTextContent(`${yearsOfExperience()} years in flooring`);
  });

  it('uses the staircase photo and an orange rule under the band', () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole('img', { name: /staircase/i })).toHaveAttribute('src', '/assets/photos/refinished-stairs-0001.jpg');
    expect(container.querySelector('section')!.className).toContain('border-syracuse');
  });
```
- [ ] **Step 2:** Run `npx vitest run components/sections/Hero.test.tsx`. Expected: FAIL (3 tests).
- [ ] **Step 3: Implement.** In `copy.ts`, set `hero.image` to `{ src: '/assets/photos/refinished-stairs-0001.jpg', alt: 'Refinished staircase with dark stained treads and white risers' }` and add:
```ts
  trust: (years: number) => [`${years} years in flooring`, 'Owner-led consultations', '1-year workmanship warranty'],
```
Replace `Hero.tsx`:
```tsx
import Image from 'next/image';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { hero } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S1 (refined). Navy band; staircase photo right on desktop, behind the text on phones.
// The orange bottom border is the rule between hero and video — nothing may sit between them.
export function Hero() {
  const years = yearsOfExperience();
  const h = hero.headline(years);
  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden border-b-4 border-syracuse bg-navy-deep text-white">
      <Image src={hero.image.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover md:hidden" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy-deep/85 md:hidden" />
      <Container className="grid items-center gap-10 py-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">{hero.eyebrow}</p>
          <h1 className="mt-4 text-[2.125rem] font-semibold leading-[1.08] tracking-tight md:text-6xl">
            {h.before}
            <span className="text-syracuse">{h.highlight}</span>
            {h.after}
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-white/80">{hero.lede}</p>
          <DualCta
            className="mt-7"
            tone="dark"
            fullWidthMobile
            primary={{ label: hero.primaryCta, href: site.bookingUrl }}
            secondary={{ label: hero.secondaryCta, href: '#video' }}
          />
          <ul aria-label="Why David" className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/85">
            {hero.trust(years).map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-syracuse" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-md shadow-2xl md:block">
          <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="45vw" className="object-cover" />
        </div>
      </Container>
    </section>
  );
}
```
- [ ] **Step 4:** Run `npx vitest run`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat(web): navy hero with staircase photo and trust strip`.

---

### Task 4: Header, navy on scroll

**Files:**
- Modify: `web/components/Nav.tsx`, `web/components/Nav.test.tsx`

- [ ] **Step 1: Failing test.** Add to `Nav.test.tsx` (add `fireEvent` to the Testing Library import):
```tsx
  it('turns navy after scrolling past 80px', () => {
    render(<Nav />);
    const header = screen.getByRole('banner');
    expect(header.className).toContain('bg-white');
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
    fireEvent.scroll(window);
    expect(header.className).toContain('bg-navy');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });
```
- [ ] **Step 2:** Run `npx vitest run components/Nav.test.tsx`. Expected: FAIL, "expected … to contain 'bg-navy'".
- [ ] **Step 3: Implement.** In `Nav.tsx`:
  - Import `useEffect`.
  - Add a `scrolled` state, set by a passive scroll listener (`window.scrollY > 80`), run once on mount.
  - Header class: `cn('sticky top-0 z-50 border-b transition-colors', scrolled ? 'border-navy bg-navy' : 'border-border bg-white/95 backdrop-blur')`.
  - Container height: `h-14 md:h-18`.
  - Wordmark: `scrolled ? 'text-white' : 'text-navy'`. Subline: `scrolled ? 'text-white/70' : 'text-muted-foreground'`.
  - Desktop links: `scrolled ? 'text-white/85 hover:text-white' : 'text-foreground hover:text-navy'`.
  - Burger: `scrolled ? 'text-white' : 'text-navy'`.
  - Mobile panel: `border-t border-white/15 bg-navy md:hidden`, with links `text-white`.
```tsx
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
```
- [ ] **Step 4:** Run `npx vitest run`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat(web): header turns navy on scroll; slimmer mobile header`.

---

### Task 5: Section bands and mobile refinements, plus acceptance

**Files:**
- Modify: `web/components/sections/IntroVideo.tsx`, `Gallery.tsx`, `SeeItFirst.tsx`, `About.tsx`, `web/components/sections/simpleSections.test.tsx`, `web/e2e/homepage.spec.ts`

- [ ] **Step 1: Update tests.**
  - In `simpleSections.test.tsx`, replace the About aspect assertion with:
    ```tsx
    expect(container.querySelector('[class*="md:aspect-[4/5]"]')).not.toBeNull();
    ```
    and add:
    ```tsx
    expect(container.querySelector('section')!.className).toContain('bg-navy');
    ```
  - In `e2e/homepage.spec.ts`, add inside `test.describe('homepage')`:
```ts
  test('header turns navy after scrolling', async ({ page }) => {
    const header = page.getByRole('banner');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toHaveCSS('background-color', 'rgb(31, 58, 95)');
  });
```
- [ ] **Step 2:** Run `npx vitest run components/sections/simpleSections.test.tsx`. Expected: FAIL (About assertions).
- [ ] **Step 3: Implement.**
  - **IntroVideo:**
    - Section `bg-navy py-10 md:py-24`.
    - Player wrapper `relative -mx-4 aspect-video overflow-hidden bg-navy-deep sm:mx-0 sm:rounded-md`.
  - **Gallery:** section gets `border-t border-border`; figcaption `mt-2 text-xs text-foreground/80 sm:text-sm`.
  - **SeeItFirst:** shelf `li` width `w-[70%] sm:w-56 md:w-64`.
  - **About:**
    - Section `bg-navy py-16 text-white md:py-24`.
    - Portrait wrapper `relative aspect-square overflow-hidden rounded-md bg-navy-deep md:aspect-[4/5]`.
    - Add the accent bar `<span aria-hidden className="mb-4 block h-1 w-10 rounded-full bg-syracuse" />` above the h2.
    - h2 `text-3xl font-semibold tracking-tight text-white md:text-5xl`; blockquote `text-white`.
    - Body paragraphs `text-white/80`.
    - `dl` `bg-white/15`, no border; cells `bg-navy-deep p-5`; dt `text-white/70`; dd `text-white`.
    - `PlaceholderNote tone="dark"`.
- [ ] **Step 4: Verify everything.**
  - `npm test` → all pass.
  - `npm run lint` → clean.
  - `npm run build` → success.
  - `PW_CHANNEL=msedge npm run test:e2e` → 20 passed.
  - Capture full-page screenshots (desktop and mobile) and review them visually.
- [ ] **Step 5:** Commit: `feat(web): alternating navy bands and mobile refinements`.
