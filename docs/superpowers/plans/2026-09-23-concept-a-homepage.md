# Concept A Production Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Concept A homepage for Carolinas Flooring (David A. Gwilt) as a production Next.js app in `web/`. It follows spec `docs/superpowers/specs/2026-09-23-concept-a-homepage-design.md`, with placeholder content and a stubbed form and booking.

**Architecture:** Next.js 16 App Router, TypeScript. The homepage renders an ordered `homeSections` array (`content/home.ts`), and each section is a self-contained component in `components/sections/`. All colours come from CSS-variable tokens in `app/globals.css`, exposed to Tailwind v4 via `@theme inline`. Copy and data live in `content/*.ts`; business facts live in `site.config.ts`.

**Tech Stack:** Node 24, Next.js 16, React 19, Tailwind CSS 4, shadcn/ui (input, textarea, label), lucide-react, Vitest + Testing Library (jsdom), Playwright (Chromium), sharp (poster generation).

## Global Constraints

- All commands run from `web/` unless stated. Git commits run from the repo root (`carolinas-flooring-proposal-main/`).
- Never modify root files `index.html`, `01-…04-*.html`, `assets/`, or the `.docx` files.
- Palette: navy `#1F3A5F` (labelled `C1 PLACEHOLDER`), navy-deep `#152A46`, white `#FFFFFF`, Syracuse Orange `#F76900`, text-safe orange `#C74A00`, ink `#2B2B2B`, rule `#D8DEE5`, pale surface `#F2F5F9`. No other hues.
- shadcn's `--accent` token is a pale hover surface, **not** orange. Orange is the Tailwind colour `syracuse` (`bg-syracuse`, `text-syracuse`), and text-safe orange is `syracuse-ink`.
- Orange only on: the primary CTA (one per section), highlighted headline words at large size, the focus outline, and error text (`syracuse-ink`). Never orange on navy. Orange buttons always have white text at 19px bold.
- Zero outbound links, except the four social profile URLs from `site.config.ts` (currently empty and therefore hidden). `tel:` and `mailto:` are allowed.
- No street address, map, directions, opening hours, or the word "showroom" in the rendered homepage.
- The intro video never autoplays. It uses `preload="none"` and always has a poster.
- The years figure is always `yearsOfExperience()` (current year − 2007), never hard-coded. The homepage revalidates daily.
- Body text is at least 17px (18px from 768px). Inter is the only font family.
- Use straight apostrophes (`'`) in any string a test matches on.

---

### Task 1: Scaffold the Next.js app, tokens, config and assets

**Files:**
- Create: `web/` (via create-next-app), `web/vitest.config.ts`, `web/vitest.setup.tsx`, `web/site.config.ts`, `web/lib/contact.ts`, `web/lib/contact.test.ts`, `web/scripts/make-poster.mjs`, `web/public/assets/**` (copied), `web/public/assets/video-poster.jpg` (generated)
- Modify: `web/app/globals.css`, `web/app/page.tsx`, `web/app/layout.tsx`, `web/package.json`

**Interfaces:**
- Produces:
  - `site` (from `@/site.config`): `{ businessName: string; legalName: string; ownerName: string; phone: string; email: string; domain: string; startYear: number; bookingUrl: string; social: Record<SocialPlatform, string> }`
  - `telHref(phone: string): string`
  - `mailtoHref(email: string): string`
  - `cn(...)` from `@/lib/utils` (created by shadcn)
  - shadcn components: `@/components/ui/input`, `@/components/ui/textarea`, `@/components/ui/label`
  - Tailwind colours: `navy`, `navy-deep`, `syracuse`, `syracuse-ink`, plus the shadcn tokens
  - Asset paths under `/assets/...`

- [ ] **Step 1: Create the app**

Run from the repo root:
```bash
npx create-next-app@latest web --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --yes
```
Expected: `web/` created with `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `package.json`.

- [ ] **Step 2: Add shadcn/ui and the primitives**

```bash
cd web
npx shadcn@latest init --defaults --yes
npx shadcn@latest add input textarea label --yes
```
Expected: `components.json`, `lib/utils.ts` (exports `cn`), `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/label.tsx`. `lucide-react` is in `package.json`.

- [ ] **Step 3: Install test and tooling dependencies, add scripts**

```bash
npm i -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test sharp
npx playwright install chromium
npm pkg set scripts.test="vitest run" scripts.test:e2e="playwright test" scripts.poster="node scripts/make-poster.mjs"
```

- [ ] **Step 4: Configure Vitest**

`web/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
  },
});
```

`web/vitest.setup.tsx`:
```tsx
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

// next/image needs the Next runtime; render a plain <img> in unit tests.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, sizes, ...rest } = props;
    void fill;
    void priority;
    void sizes;
    return React.createElement('img', rest);
  },
}));
```

- [ ] **Step 5: Write the failing test for contact helpers**

`web/lib/contact.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { mailtoHref, telHref } from './contact';

describe('contact helpers', () => {
  it('builds a tel: link with country code and digits only', () => {
    expect(telHref('704-614-1200')).toBe('tel:+17046141200');
  });
  it('builds a mailto: link', () => {
    expect(mailtoHref('david@carolinasflooring.com')).toBe('mailto:david@carolinasflooring.com');
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- lib/contact.test.ts`
Expected: FAIL, with "Failed to resolve import './contact'".

- [ ] **Step 7: Implement the helpers and site config**

`web/lib/contact.ts`:
```ts
export function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, '')}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}
```

`web/site.config.ts`:
```ts
import type { SocialPlatform } from '@/content/types';

export type SiteConfig = {
  businessName: string;
  legalName: string;
  ownerName: string;
  phone: string;
  email: string;
  domain: string;
  startYear: number;
  /** STUB until the Google appointment schedule exists (spec S14). */
  bookingUrl: string;
  /** Empty string = not yet supplied; the link is hidden. */
  social: Record<SocialPlatform, string>;
};

// Branding is open (O5/C7). Every business fact is swapped here, in one place.
export const site: SiteConfig = {
  businessName: 'Carolinas Flooring',
  legalName: 'David A Gwilt LLC',
  ownerName: 'David A. Gwilt',
  phone: '704-614-1200',
  email: 'david@carolinasflooring.com',
  domain: 'carolinasflooring.com',
  startYear: 2007,
  bookingUrl: '/#contact',
  social: { google: '', facebook: '', yelp: '', apple: '' },
};
```

Create `web/content/types.ts` now, because `site.config.ts` imports from it:
```ts
export type Img = { src: string; alt: string };

export type GalleryItem =
  | { type: 'photo'; id: string; image: Img; caption: string }
  | { type: 'video'; id: string; src: string; poster: string; alt: string; caption: string }
  | { type: 'pair'; id: string; before: Img | null; after: Img | null; caption: string };

export type Brand = { name: string; slug: string };

export type SocialPlatform = 'google' | 'facebook' | 'yelp' | 'apple';

export type Review = { id: string; quote: string; author: string; platform: SocialPlatform };

export type LeadField = {
  name: string;
  label: string;
  kind: 'text' | 'email' | 'tel' | 'textarea';
  required: boolean;
  requiredMessage: string;
  autoComplete?: string;
  placeholder?: string;
};
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- lib/contact.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 9: Replace `app/globals.css` with the token layer**

Keep the `@import` and `@custom-variant` lines at the top of the file that `shadcn init` generated, exactly as they are. Replace everything below them with:
```css
@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-navy: var(--brand-navy);
  --color-navy-deep: var(--brand-navy-deep);
  --color-syracuse: var(--brand-orange);
  --color-syracuse-ink: var(--brand-orange-text);
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.375rem;

  /* Brand palette — Design Spec §5.2. Blue + orange + white + neutral grey. No fourth hue. */
  --brand-navy: #1F3A5F;        /* C1 PLACEHOLDER — replace with the exact blue from the back of David's business card */
  --brand-navy-deep: #152A46;   /* derived from --brand-navy; update with it */
  --brand-orange: #F76900;      /* Syracuse Orange, Pantone 165 C (C2) */
  --brand-orange-text: #C74A00; /* orange at body size on white (WCAG) */

  --background: #FFFFFF;
  --foreground: #2B2B2B;
  --card: #FFFFFF;
  --card-foreground: #2B2B2B;
  --popover: #FFFFFF;
  --popover-foreground: #2B2B2B;
  --primary: var(--brand-navy);
  --primary-foreground: #FFFFFF;
  --secondary: #F2F5F9;
  --secondary-foreground: var(--brand-navy);
  --muted: #F2F5F9;
  --muted-foreground: #5A6472;
  --accent: #F2F5F9; /* shadcn hover surface — NOT the orange */
  --accent-foreground: var(--brand-navy);
  --destructive: var(--brand-orange-text);
  --border: #D8DEE5;
  --input: #D8DEE5;
  --ring: var(--brand-orange);
}

@layer base {
  * {
    @apply border-border;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-background text-foreground;
    font-size: 1.0625rem;
    line-height: 1.65;
  }
  @media (min-width: 768px) {
    body {
      font-size: 1.125rem;
    }
  }
  :focus-visible {
    outline: 3px solid var(--brand-orange);
    outline-offset: 3px;
  }
  [id] {
    scroll-margin-top: 5rem;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      transition: none !important;
      animation: none !important;
    }
  }
}
```
If shadcn generated a `.dark { … }` block, do not keep it (no dark theme is in scope).

- [ ] **Step 10: Minimal layout and page**

`web/app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { site } from '@/site.config';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: `${site.businessName} — Flooring sales and installation`,
  description: `Carpet, hardwood, luxury vinyl and tile, sold and installed by ${site.ownerName}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
```

`web/app/page.tsx`:
```tsx
export default function HomePage() {
  return null;
}
```
Delete the create-next-app boilerplate SVGs in `web/public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).

- [ ] **Step 11: Copy assets and generate the navy video poster**

From `web/`:
```bash
mkdir -p public/assets/photos
cp ../assets/photos/*.jpg public/assets/photos/
cp ../assets/david.jpg public/assets/
```

`web/scripts/make-poster.mjs`:
```js
// Builds the intro-video poster: David's portrait centred on the navy-deep token.
// Re-run (`npm run poster`) whenever --brand-navy-deep changes in app/globals.css.
import sharp from 'sharp';

const WIDTH = 1600;
const HEIGHT = 900;
const NAVY_DEEP = { r: 0x15, g: 0x2a, b: 0x46 }; // keep in sync with --brand-navy-deep
const PORTRAIT_W = 470;
const PORTRAIT_H = 610;

const portrait = await sharp('public/assets/david.jpg')
  .resize(PORTRAIT_W, PORTRAIT_H, { fit: 'cover', position: 'top' })
  .toBuffer();

await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: NAVY_DEEP } })
  .composite([{ input: portrait, left: (WIDTH - PORTRAIT_W) / 2, top: (HEIGHT - PORTRAIT_H) / 2 }])
  .jpeg({ quality: 85 })
  .toFile('public/assets/video-poster.jpg');

console.log('Wrote public/assets/video-poster.jpg');
```
Run: `npm run poster`
Expected: prints "Wrote public/assets/video-poster.jpg". Open the file and check that David's face is centred on navy.

- [ ] **Step 12: Verify the build**

Run: `npm run build`
Expected: "Compiled successfully", with no type errors.
Run: `npm run lint`
Expected: no errors.

- [ ] **Step 13: Commit**

```bash
cd ..
git add web docs
git commit -m "feat(web): scaffold Next.js app with brand tokens, site config and assets"
```

---

### Task 2: Years-of-experience calculation

**Files:**
- Create: `web/lib/years.ts`
- Test: `web/lib/years.test.ts`

**Interfaces:**
- Consumes: `site.startYear` from `@/site.config`
- Produces: `yearsOfExperience(now?: Date, startYear?: number): number`

- [ ] **Step 1: Write the failing test**

`web/lib/years.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from './years';

describe('yearsOfExperience', () => {
  it('is 19 during 2026 (flooring since 2007)', () => {
    expect(yearsOfExperience(new Date(2026, 8, 23))).toBe(19);
    expect(yearsOfExperience(new Date(2026, 0, 1))).toBe(19);
  });
  it('increments on 1 January', () => {
    expect(yearsOfExperience(new Date(2027, 0, 1))).toBe(20);
  });
  it('accepts an explicit start year', () => {
    expect(yearsOfExperience(new Date(2026, 5, 1), 2010)).toBe(16);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- lib/years.test.ts`
Expected: FAIL, "Failed to resolve import './years'".

- [ ] **Step 3: Implement**

`web/lib/years.ts`:
```ts
import { site } from '@/site.config';

/** Years in flooring, derived so it never goes stale (spec CH2 / N68). */
export function yearsOfExperience(now: Date = new Date(), startYear: number = site.startYear): number {
  return now.getFullYear() - startYear;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- lib/years.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd .. && git add web/lib/years.ts web/lib/years.test.ts && git commit -m "feat(web): derive years of experience from 2007"
```

---

### Task 3: Lead form fields, validation and mock submission

**Files:**
- Create: `web/content/leadForm.ts`, `web/lib/validateLead.ts`, `web/lib/submitLead.ts`
- Test: `web/lib/validateLead.test.ts`, `web/lib/submitLead.test.ts`

**Interfaces:**
- Consumes: `LeadField` from `@/content/types`
- Produces:
  - `leadFields: LeadField[]`, with names `name`, `email`, `phone`, `message`
  - `validateLead(values: Record<string, string>, fields: LeadField[]): LeadErrors`, where `LeadErrors = Record<string, string>`
  - `submitLead(values: Record<string, string>, opts?: { forceError?: boolean; delayMs?: number }): Promise<LeadResult>`, where `LeadResult = { ok: true } | { ok: false; error: string }`

- [ ] **Step 1: Write the field config**

`web/content/leadForm.ts`:
```ts
import type { LeadField } from './types';

// Spec §3.9 / N54. Add a field here and the form renders it with no layout changes.
export const leadFields: LeadField[] = [
  { name: 'name', label: 'Name', kind: 'text', required: true, requiredMessage: 'Please enter your name.', autoComplete: 'name' },
  { name: 'email', label: 'Email', kind: 'email', required: true, requiredMessage: 'Please enter your email address.', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', kind: 'tel', required: true, requiredMessage: 'Please enter your phone number.', autoComplete: 'tel' },
  {
    name: 'message',
    label: "What you're looking for",
    kind: 'textarea',
    required: true,
    requiredMessage: 'Please tell David a little about your project.',
    placeholder: "Which rooms, roughly how much space, what kind of flooring, and when you'd like it done.",
  },
];
```

- [ ] **Step 2: Write the failing validation tests**

`web/lib/validateLead.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { leadFields } from '@/content/leadForm';
import { validateLead } from './validateLead';

const valid = {
  name: 'Pat Smith',
  email: 'pat@example.com',
  phone: '704-555-0100',
  message: 'Two bedrooms, carpet, next month.',
};

describe('validateLead', () => {
  it('returns no errors for a complete, valid submission', () => {
    expect(validateLead(valid, leadFields)).toEqual({});
  });
  it('flags every missing required field with its own message', () => {
    expect(validateLead({}, leadFields)).toEqual({
      name: 'Please enter your name.',
      email: 'Please enter your email address.',
      phone: 'Please enter your phone number.',
      message: 'Please tell David a little about your project.',
    });
  });
  it('treats whitespace-only as missing', () => {
    expect(validateLead({ ...valid, name: '   ' }, leadFields)).toEqual({ name: 'Please enter your name.' });
  });
  it('rejects a malformed email', () => {
    expect(validateLead({ ...valid, email: 'pat@example' }, leadFields)).toEqual({
      email: 'Please enter a valid email address.',
    });
  });
  it('rejects phone numbers with fewer than 10 digits', () => {
    expect(validateLead({ ...valid, phone: '555-0100' }, leadFields)).toEqual({
      phone: 'Please enter a valid phone number.',
    });
  });
  it('accepts formatted 10-digit and +1 numbers', () => {
    expect(validateLead({ ...valid, phone: '(704) 555-0100' }, leadFields)).toEqual({});
    expect(validateLead({ ...valid, phone: '+1 704 555 0100' }, leadFields)).toEqual({});
  });
  it('skips optional empty fields', () => {
    const fields = [...leadFields, { name: 'extra', label: 'Extra', kind: 'text' as const, required: false, requiredMessage: '' }];
    expect(validateLead(valid, fields)).toEqual({});
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- lib/validateLead.test.ts`
Expected: FAIL, "Failed to resolve import './validateLead'".

- [ ] **Step 4: Implement validation**

`web/lib/validateLead.ts`:
```ts
import type { LeadField } from '@/content/types';

export type LeadErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(values: Record<string, string>, fields: LeadField[]): LeadErrors {
  const errors: LeadErrors = {};
  for (const field of fields) {
    const value = (values[field.name] ?? '').trim();
    if (!value) {
      if (field.required) errors[field.name] = field.requiredMessage;
      continue;
    }
    if (field.kind === 'email' && !EMAIL.test(value)) {
      errors[field.name] = 'Please enter a valid email address.';
    }
    if (field.kind === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) errors[field.name] = 'Please enter a valid phone number.';
    }
  }
  return errors;
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- lib/validateLead.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 6: Write the failing submit tests**

`web/lib/submitLead.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { submitLead } from './submitLead';

describe('submitLead (mock)', () => {
  it('succeeds for a normal submission', async () => {
    await expect(submitLead({ name: 'Pat' }, { delayMs: 0 })).resolves.toEqual({ ok: true });
  });
  it('fails when forced', async () => {
    await expect(submitLead({ name: 'Pat' }, { delayMs: 0, forceError: true })).resolves.toEqual({
      ok: false,
      error: 'mock-failure',
    });
  });
  it('fails when the honeypot is filled', async () => {
    await expect(submitLead({ name: 'Bot', company: 'Spam Inc' }, { delayMs: 0 })).resolves.toEqual({
      ok: false,
      error: 'mock-failure',
    });
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `npm test -- lib/submitLead.test.ts`
Expected: FAIL, "Failed to resolve import './submitLead'".

- [ ] **Step 8: Implement the mock**

`web/lib/submitLead.ts`:
```ts
export type LeadResult = { ok: true } | { ok: false; error: string };

/**
 * MOCK — no email is sent. Replace with a POST to /api/lead when delivery is built
 * (spec §7: email to David with reply-to = visitor).
 * `company` is the honeypot field.
 */
export async function submitLead(
  values: Record<string, string>,
  opts: { forceError?: boolean; delayMs?: number } = {},
): Promise<LeadResult> {
  const { forceError = false, delayMs = 800 } = opts;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  if (forceError || (values.company ?? '').trim() !== '') return { ok: false, error: 'mock-failure' };
  return { ok: true };
}
```

- [ ] **Step 9: Run to verify it passes**

Run: `npm test -- lib/`
Expected: PASS (all lib tests).

- [ ] **Step 10: Commit**

```bash
cd .. && git add web/content/leadForm.ts web/lib && git commit -m "feat(web): lead form field config, validation and mock submit"
```

---

### Task 4: Content data (copy, gallery, brands, reviews, platforms)

**Files:**
- Create: `web/content/copy.ts`, `web/content/gallery.ts`, `web/content/brands.ts`, `web/content/reviews.ts`, `web/lib/platforms.ts`
- Test: `web/content/content.test.ts`

**Interfaces:**
- Consumes: the types from `@/content/types`
- Produces:
  - Copy exports: `hero`, `introVideo`, `twoWays`, `seeItFirst`, `brandsCopy`, `about`, `reviewsCopy`, `contactCopy`, `consultOptions`, `navLinks` (shapes below)
  - `galleryItems: GalleryItem[]`, `brands: Brand[]`, `reviews: Review[]`
  - `socialPlatforms: SocialPlatform[]`, `platformLabels: Record<SocialPlatform, string>`

- [ ] **Step 1: Write the failing integrity test**

`web/content/content.test.ts`:
```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { platformLabels } from '@/lib/platforms';
import { brands } from './brands';
import { about, hero, introVideo, seeItFirst } from './copy';
import { galleryItems } from './gallery';
import { reviews } from './reviews';
import type { GalleryItem } from './types';

const publicFile = (src: string) => path.join(process.cwd(), 'public', src);

function gallerySrcs(item: GalleryItem): string[] {
  if (item.type === 'photo') return [item.image.src];
  if (item.type === 'video') return [item.poster];
  return [item.before?.src, item.after?.src].filter((s): s is string => Boolean(s));
}

describe('content integrity', () => {
  it('brand slugs are unique and URL-safe', () => {
    const slugs = brands.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('gallery ids are unique and there is at least one before/after pair', () => {
    const ids = galleryItems.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(galleryItems.some((g) => g.type === 'pair')).toBe(true);
  });

  it('every referenced image exists in public/', () => {
    const srcs = [
      hero.image.src,
      introVideo.poster,
      about.portrait.src,
      ...seeItFirst.shelf.map((s) => s.src),
      ...galleryItems.flatMap(gallerySrcs),
    ];
    for (const src of srcs) {
      expect(src.startsWith('/assets/'), src).toBe(true);
      expect(fs.existsSync(publicFile(src)), src).toBe(true);
    }
  });

  it('every review names a known platform', () => {
    for (const r of reviews) expect(platformLabels[r.platform]).toBeTruthy();
  });

  it('copy never mentions a showroom, hours or an address', () => {
    const all = JSON.stringify({ hero, introVideo, seeItFirst, about });
    expect(all).not.toMatch(/showroom|\bhours\b|directions/i);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- content/content.test.ts`
Expected: FAIL, "Failed to resolve import '@/lib/platforms'".

- [ ] **Step 3: Implement platforms**

`web/lib/platforms.ts`:
```ts
import type { SocialPlatform } from '@/content/types';

export const socialPlatforms: SocialPlatform[] = ['google', 'facebook', 'yelp', 'apple'];

export const platformLabels: Record<SocialPlatform, string> = {
  google: 'Google',
  facebook: 'Facebook',
  yelp: 'Yelp',
  apple: 'Apple',
};
```

- [ ] **Step 4: Implement the copy**

`web/content/copy.ts`:
```ts
// PLACEHOLDER COPY — every word here is replaced by David's copy (spec CH4).
import type { Img } from './types';

export const navLinks = [
  { label: 'Work', href: '/#gallery' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/#contact' },
];

export const hero = {
  eyebrow: 'Carpet · Hardwood · Luxury vinyl · Tile',
  headline: (years: number) => ({
    before: `${years} years of floors, and `,
    highlight: 'one person',
    after: ' answering for every one.',
  }),
  lede: "Buy the flooring on its own, or have it installed by David's own technicians. Either way, you deal with the owner.",
  primaryCta: 'Book a Consultation',
  secondaryCta: 'Watch My Story',
  image: { src: '/assets/photos/engineered-hardwood.jpg', alt: 'Engineered hardwood floor in an entry and stair hall' } as Img,
};

export const introVideo = {
  title: 'Meet David',
  lede: 'A short introduction from the owner: how he works, and why you deal with him from the first visit to the last.',
  src: '/assets/david-intro.mp4',
  poster: '/assets/video-poster.jpg',
};

export const twoWays = {
  title: 'Floors, two ways',
  note: 'Placeholder copy. David is writing this section.',
  paths: [
    {
      title: 'Just the product',
      body: 'Choose your flooring with David and buy it on its own. Ideal if you already have an installer.',
    },
    {
      title: 'Product + installation',
      body: "David supplies the floor and his own technicians install it, so one person is answerable from start to finish.",
    },
  ],
};

export const seeItFirst = {
  title: 'See it before you buy it',
  lede: 'Handle full-size samples of the real product, brought to your home or at a meeting by appointment.',
  cta: 'Book a Consultation',
  shelf: [
    { src: '/assets/photos/shaw-hardwood-0001.jpg', alt: 'Shaw hardwood samples' },
    { src: '/assets/photos/shaw-carpet.jpg', alt: 'Shaw carpet samples' },
    { src: '/assets/photos/mohawk-carpet-image-0001.jpg', alt: 'Mohawk carpet samples' },
    { src: '/assets/photos/coretec-display-0001.jpg', alt: 'COREtec luxury vinyl samples' },
    { src: '/assets/photos/dreamweaver-carpet-0001.jpg', alt: 'DreamWeaver carpet samples' },
    { src: '/assets/photos/floorte.jpg', alt: 'Shaw Floorté vinyl samples' },
    { src: '/assets/photos/somerset-hardwood-0001.jpg', alt: 'Hardwood sample boards' },
    { src: '/assets/photos/hardwood-photo-for-web-site-1.jpg', alt: 'Hardwood sample boards' },
    { src: '/assets/photos/tile-display-0001.jpg', alt: 'Chesapeake tile samples' },
  ] as Img[],
};

export const brandsCopy = {
  title: 'Brands we carry',
  lede: "Explore each brand's range right here, and ask David about anything you like.",
};

export const about = {
  title: 'About David',
  quote: '"There is a reason I get nothing but 5-star reviews."',
  body: [
    'David A. Gwilt has worked in flooring since 2007, after moving down from Syracuse, New York.',
    'Consultation, selection and follow-up all go through him. His technicians handle the install.',
  ],
  note: 'Placeholder bio. Portrait to be replaced: supply a 4:5 photo, at least 1600 × 2000 px.',
  portrait: { src: '/assets/david.jpg', alt: 'David A. Gwilt, owner' } as Img,
};

export const reviewsCopy = {
  title: 'What customers say',
  note: 'Placeholder reviews, to be replaced with real quotes from each profile.',
};

export const contactCopy = {
  title: 'Start the conversation',
  lede: "Tell David what you have in mind and he'll get back to you.",
  savings: 'No brick-and-mortar overhead means lower prices, and the savings go straight to you.',
  submit: 'Send to David',
  sending: 'Sending…',
  success: 'Thanks. David will be in touch shortly.',
  error: 'Something went wrong sending your message. Please try again, or call David directly.',
};

export const consultOptions = [
  { title: 'Samples at your home', body: 'David brings samples to you, so you see them in your own light.' },
  { title: 'Meet by appointment', body: 'Want to see the full range? Book a time and David will arrange where to meet.' },
];
```

- [ ] **Step 5: Implement the gallery, brands and reviews data**

`web/content/gallery.ts`:
```ts
import type { GalleryItem } from './types';

const p = (file: string) => `/assets/photos/${file}`;

export const galleryItems: GalleryItem[] = [
  {
    type: 'pair',
    id: 'pair-hardwood-finish',
    before: { src: p('unfinished-wood.jpg'), alt: 'Hardwood mid-install, before finishing' },
    after: { src: p('finished-hdwd-0002.jpg'), alt: 'Finished hardwood floor' },
    caption: 'Placeholder pair: hardwood before and after finishing',
  },
  { type: 'photo', id: 'engineered', image: { src: p('engineered-hardwood.jpg'), alt: 'Engineered hardwood in an entry and stair hall' }, caption: 'Engineered hardwood' },
  { type: 'photo', id: 'light-hdwd', image: { src: p('light-hdwd.jpg'), alt: 'A light-toned hardwood floor' }, caption: 'Light hardwood' },
  { type: 'photo', id: 'border', image: { src: p('hdwd-w-border-0001.jpg'), alt: 'Hardwood floor with a contrasting inlaid border' }, caption: 'Hardwood with a border' },
  { type: 'photo', id: 'stairs', image: { src: p('refinished-stairs-0001.jpg'), alt: 'Refinished staircase with dark treads and white risers' }, caption: 'Refinished staircase' },
  { type: 'photo', id: 'lvp', image: { src: p('lvp-1-2.jpg'), alt: 'Luxury vinyl plank flooring in a bedroom' }, caption: 'Luxury vinyl plank' },
  { type: 'photo', id: 'lvt', image: { src: p('lvt.jpg'), alt: 'Marble-look tile in a hallway' }, caption: 'Marble-look tile' },
  { type: 'photo', id: 'lvp-repair', image: { src: p('after-repair-and-new-lvp-install.jpg'), alt: 'Open-plan living area with new luxury vinyl plank' }, caption: 'LVP after subfloor repair' },
  { type: 'photo', id: 'rubber', image: { src: p('amorim-rubber-tiles.jpg'), alt: 'Rubber tile flooring in a home gym' }, caption: 'Rubber tile, home gym' },
];
```

`web/content/brands.ts`:
```ts
import type { Brand } from './types';

// Incomplete list (O9): David to supply the full list. Styled text, not logos (C10).
export const brands: Brand[] = [
  { name: 'Shaw', slug: 'shaw' },
  { name: 'Mohawk', slug: 'mohawk' },
  { name: 'COREtec', slug: 'coretec' },
  { name: 'Somerset', slug: 'somerset' },
  { name: 'DreamWeaver', slug: 'dreamweaver' },
  { name: 'Chesapeake', slug: 'chesapeake' },
  { name: 'Amorim', slug: 'amorim' },
];
```

`web/content/reviews.ts`:
```ts
import type { Review } from './types';

// PLACEHOLDERS: never ship invented reviews. Replace with verbatim quotes from each profile.
export const reviews: Review[] = [
  { id: 'r1', quote: 'Placeholder: a real Google review will go here.', author: 'Google reviewer', platform: 'google' },
  { id: 'r2', quote: 'Placeholder: a real Facebook review will go here.', author: 'Facebook reviewer', platform: 'facebook' },
  { id: 'r3', quote: 'Placeholder: a real Yelp review will go here.', author: 'Yelp reviewer', platform: 'yelp' },
];
```

- [ ] **Step 6: Check the poster exists**

The integrity test checks `/assets/video-poster.jpg`. Make sure Task 1 Step 11 has been run.

- [ ] **Step 7: Run to verify it passes**

Run: `npm test -- content/content.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 8: Commit**

```bash
cd .. && git add web/content web/lib/platforms.ts && git commit -m "feat(web): placeholder copy, gallery, brand and review data"
```

---

### Task 5: Layout shell (Container, headings, CTA styles, SocialRow, Nav, Footer)

**Files:**
- Create: `web/components/layout/Container.tsx`, `web/components/layout/SectionHeading.tsx`, `web/components/layout/PlaceholderNote.tsx`, `web/lib/cta.ts`, `web/components/blocks/SocialRow.tsx`, `web/components/Nav.tsx`, `web/components/Footer.tsx`
- Modify: `web/app/layout.tsx`
- Test: `web/components/blocks/SocialRow.test.tsx`, `web/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `site`, `telHref`, `mailtoHref`, `navLinks`, `socialPlatforms`, `platformLabels`, `cn`
- Produces:
  - `Container({ className?, children })`
  - `SectionHeading({ id, title, lede?, tone?: 'light' | 'dark', size?: 'default' | 'feature' })`
  - `PlaceholderNote({ children, tone?: 'light' | 'dark' })`
  - `ctaPrimary: string`, `ctaSecondary: string` (class strings)
  - `SocialRow({ links: Partial<Record<SocialPlatform, string>>, tone?: 'light' | 'dark' })`
  - `Nav()`, `Footer()`

- [ ] **Step 1: Write the failing tests**

`web/components/blocks/SocialRow.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialRow } from './SocialRow';

describe('SocialRow', () => {
  it('renders nothing when no profile URLs are set', () => {
    const { container } = render(<SocialRow links={{ google: '', facebook: '', yelp: '', apple: '' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders only configured profiles, opening in a new tab', () => {
    render(<SocialRow links={{ google: 'https://g.page/example', yelp: 'https://www.yelp.com/biz/example', facebook: '' }} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAccessibleName('Google (opens in a new tab)');
    expect(links[0]).toHaveAttribute('href', 'https://g.page/example');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
    expect(links[1]).toHaveAccessibleName('Yelp (opens in a new tab)');
  });
});
```

`web/components/Nav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Nav } from './Nav';

describe('Nav', () => {
  it('always shows the booking CTA', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /book/i })).toHaveAttribute('href', '/#contact');
  });

  it('has no showroom link', () => {
    render(<Nav />);
    expect(screen.queryByRole('link', { name: /showroom/i })).toBeNull();
  });

  it('toggles the mobile menu', async () => {
    render(<Nav />);
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- components/`
Expected: FAIL, "Failed to resolve import './SocialRow'" and "'./Nav'".

- [ ] **Step 3: Implement the layout primitives and CTA classes**

`web/components/layout/Container.tsx`:
```tsx
import { cn } from '@/lib/utils';

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}
```

`web/components/layout/SectionHeading.tsx`:
```tsx
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  title: string;
  lede?: string;
  tone?: 'light' | 'dark';
  size?: 'default' | 'feature';
};

export function SectionHeading({ id, title, lede, tone = 'light', size = 'default' }: Props) {
  const dark = tone === 'dark';
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <h2
        id={id}
        className={cn(
          'font-semibold tracking-tight',
          size === 'feature' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl',
          dark ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {lede && <p className={cn('mt-3 text-lg', dark ? 'text-white/85' : 'text-foreground/80')}>{lede}</p>}
    </div>
  );
}
```

`web/components/layout/PlaceholderNote.tsx`:
```tsx
import { cn } from '@/lib/utils';

export function PlaceholderNote({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return <p className={cn('mt-4 text-sm italic', tone === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>{children}</p>;
}
```

`web/lib/cta.ts`:
```ts
// Orange CTA: white text at 19px bold so the pair meets WCAG large-text contrast (spec §5.4).
export const ctaPrimary =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-syracuse px-7 text-[1.1875rem] font-bold text-white transition-colors hover:bg-syracuse-ink disabled:opacity-60';

export const ctaSecondary =
  'inline-flex min-h-12 items-center justify-center rounded-full border-2 border-navy px-7 text-[1.1875rem] font-semibold text-navy transition-colors hover:bg-navy hover:text-white';
```

- [ ] **Step 4: Implement SocialRow**

`web/components/blocks/SocialRow.tsx`:
```tsx
import type { SocialPlatform } from '@/content/types';
import { platformLabels, socialPlatforms } from '@/lib/platforms';
import { cn } from '@/lib/utils';

type Props = { links: Partial<Record<SocialPlatform, string>>; tone?: 'light' | 'dark' };

export function SocialRow({ links, tone = 'light' }: Props) {
  const set = socialPlatforms.filter((p) => (links[p] ?? '').trim() !== '');
  if (set.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Find us online">
      {set.map((platform) => (
        <li key={platform}>
          <a
            href={links[platform]}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 px-4 text-sm font-semibold transition-colors',
              tone === 'dark'
                ? 'border-white/50 text-white hover:bg-white/10'
                : 'border-navy text-navy hover:bg-navy hover:text-white',
            )}
          >
            {platformLabels[platform]}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Implement Nav and Footer**

`web/components/Nav.tsx`:
```tsx
'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navLinks } from '@/content/copy';
import { ctaPrimary } from '@/lib/cta';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';
import { Container } from './layout/Container';

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-4 md:h-18">
        <Link href="/" className="mr-auto leading-tight">
          <span className="block text-lg font-bold text-navy">{site.businessName}</span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:block">
            {site.ownerName} · Since {site.startYear}
          </span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[0.95rem] font-medium text-foreground hover:text-navy">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={site.bookingUrl} className={cn(ctaPrimary, 'min-h-10 px-4 sm:px-5')}>
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book a Consultation</span>
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-navy md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border md:hidden">
          <Container>
            <ul className="py-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-lg font-medium text-navy" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
```

`web/components/Footer.tsx`:
```tsx
import { mailtoHref, telHref } from '@/lib/contact';
import { site } from '@/site.config';
import { SocialRow } from './blocks/SocialRow';
import { Container } from './layout/Container';

// No address, and no manufacturer links (spec K18).
export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xl font-bold">{site.businessName}</p>
          <p className="mt-2 text-white/85">
            <a href={telHref(site.phone)} className="hover:underline">{site.phone}</a>
            {' · '}
            <a href={mailtoHref(site.email)} className="hover:underline">{site.email}</a>
          </p>
          <p className="mt-4 text-sm text-white/70">© {new Date().getFullYear()} {site.legalName}</p>
        </div>
        <SocialRow links={site.social} tone="dark" />
      </Container>
    </footer>
  );
}
```

- [ ] **Step 6: Wire Nav, Footer and a skip link into the layout**

Replace the `<body>` in `web/app/layout.tsx` and add the imports:
```tsx
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
```
```tsx
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
```

- [ ] **Step 7: Run tests and build**

Run: `npm test -- components/`
Expected: PASS (5 tests).
Run: `npm run build`
Expected: success.

- [ ] **Step 8: Commit**

```bash
cd .. && git add web && git commit -m "feat(web): layout shell with nav, footer and social row"
```

---

### Task 6: Hero, DualCta and IntroVideo

**Files:**
- Create: `web/components/blocks/DualCta.tsx`, `web/components/sections/Hero.tsx`, `web/components/sections/IntroVideo.tsx`
- Test: `web/components/sections/Hero.test.tsx`, `web/components/sections/IntroVideo.test.tsx`

**Interfaces:**
- Consumes: `hero`, `introVideo`, `yearsOfExperience`, `site.bookingUrl`, `ctaPrimary`, `ctaSecondary`, `Container`, `SectionHeading`
- Produces:
  - `DualCta({ primary: { label: string; href: string }, secondary?: { label: string; href: string }, className?: string })`
  - `Hero()` renders `<section id="top">`
  - `IntroVideo()` renders `<section id="video">`

- [ ] **Step 1: Write the failing tests**

`web/components/sections/Hero.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from '@/lib/years';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders a text headline with the derived year count', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(`${yearsOfExperience()} years of floors`);
  });

  it('renders both CTAs together, primary first', () => {
    render(<Hero />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveTextContent('Book a Consultation');
    expect(links[0]).toHaveAttribute('href', '/#contact');
    expect(links[0].className).toContain('bg-syracuse');
    expect(links[1]).toHaveTextContent('Watch My Story');
    expect(links[1]).toHaveAttribute('href', '#video');
    expect(links[1].className).toContain('border-navy');
  });
});
```

`web/components/sections/IntroVideo.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IntroVideo } from './IntroVideo';

describe('IntroVideo', () => {
  it('has a poster, never autoplays, and does not preload', () => {
    const { container } = render(<IntroVideo />);
    const video = container.querySelector('video')!;
    expect(video).toHaveAttribute('poster', '/assets/video-poster.jpg');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('controls');
    expect(container.querySelector('section')).toHaveAttribute('id', 'video');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- components/sections/`
Expected: FAIL, "Failed to resolve import './Hero'" and "'./IntroVideo'".

- [ ] **Step 3: Implement DualCta**

`web/components/blocks/DualCta.tsx`:
```tsx
import Link from 'next/link';
import { ctaPrimary, ctaSecondary } from '@/lib/cta';
import { cn } from '@/lib/utils';

type Cta = { label: string; href: string };

/** K2: primary = orange fill, secondary = navy outline. Only one orange CTA per section. */
export function DualCta({ primary, secondary, className }: { primary: Cta; secondary?: Cta; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Link href={primary.href} className={ctaPrimary}>{primary.label}</Link>
      {secondary && <Link href={secondary.href} className={ctaSecondary}>{secondary.label}</Link>}
    </div>
  );
}
```

- [ ] **Step 4: Implement Hero**

`web/components/sections/Hero.tsx`:
```tsx
import Image from 'next/image';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { hero } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S1. Headline + both CTAs must sit above the fold at 1440×900 and 375×812.
export function Hero() {
  const h = hero.headline(yearsOfExperience());
  return (
    <section id="top" aria-label="Introduction" className="border-b border-border">
      <Container className="grid items-center gap-8 py-8 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy">{hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-navy md:text-6xl">
            {h.before}
            <span className="text-syracuse">{h.highlight}</span>
            {h.after}
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-foreground/80">{hero.lede}</p>
          <DualCta
            className="mt-7"
            primary={{ label: hero.primaryCta, href: site.bookingUrl }}
            secondary={{ label: hero.secondaryCta, href: '#video' }}
          />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted md:aspect-square">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Implement IntroVideo**

`web/components/sections/IntroVideo.tsx`:
```tsx
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { introVideo } from '@/content/copy';

// S2. Directly after the hero, before all other content. With no video file, the poster alone shows.
export function IntroVideo() {
  return (
    <section id="video" aria-labelledby="video-title" className="bg-navy-deep py-16 md:py-24">
      <Container>
        <SectionHeading id="video-title" title={introVideo.title} lede={introVideo.lede} tone="dark" />
        <div className="relative aspect-video overflow-hidden rounded-md bg-navy">
          <video className="h-full w-full object-cover" controls preload="none" playsInline poster={introVideo.poster}>
            <source src={introVideo.src} type="video/mp4" />
          </video>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Run to verify they pass**

Run: `npm test -- components/sections/`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
cd .. && git add web/components && git commit -m "feat(web): hero with dual CTA and intro video block"
```

---

### Task 7: TwoWays, SeeItFirst and About sections

**Files:**
- Create: `web/components/sections/TwoWays.tsx`, `web/components/sections/SeeItFirst.tsx`, `web/components/sections/About.tsx`
- Test: `web/components/sections/simpleSections.test.tsx`

**Interfaces:**
- Consumes: `twoWays`, `seeItFirst`, `about`, `yearsOfExperience`, `site`, `Container`, `SectionHeading`, `PlaceholderNote`, `DualCta`
- Produces: `TwoWays()` (`#services`), `SeeItFirst()` (`#see-it`), `About()` (`#about`)

- [ ] **Step 1: Write the failing test**

`web/components/sections/simpleSections.test.tsx`:
```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from '@/lib/years';
import { About } from './About';
import { SeeItFirst } from './SeeItFirst';
import { TwoWays } from './TwoWays';

describe('TwoWays', () => {
  it('shows exactly two parallel paths', () => {
    const { container } = render(<TwoWays />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'services');
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Just the product' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Product + installation' })).toBeInTheDocument();
  });
});

describe('SeeItFirst', () => {
  it('is a full feature block with the sample shelf and a single primary CTA', () => {
    const { container } = render(<SeeItFirst />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'see-it');
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(9);
    const cta = screen.getByRole('link', { name: 'Book a Consultation' });
    expect(cta.className).toContain('bg-syracuse');
  });
});

describe('About', () => {
  it('shows the derived years and a 4:5 portrait slot', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'about');
    expect(screen.getByText(String(yearsOfExperience()))).toBeInTheDocument();
    expect(container.querySelector('.aspect-\\[4\\/5\\]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- components/sections/simpleSections.test.tsx`
Expected: FAIL, "Failed to resolve import './About'".

- [ ] **Step 3: Implement TwoWays**

`web/components/sections/TwoWays.tsx`:
```tsx
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { twoWays } from '@/content/copy';

// S3. Two equal-weight paths; stacks on mobile.
export function TwoWays() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-16 md:py-24">
      <Container>
        <SectionHeading id="services-title" title={twoWays.title} />
        <ul className="grid gap-6 md:grid-cols-2">
          {twoWays.paths.map((path, i) => (
            <li key={path.title} className="rounded-md border border-border p-8">
              <p className="text-sm font-semibold text-navy">0{i + 1}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-navy">{path.title}</h3>
              <p className="mt-3 text-foreground/80">{path.body}</p>
            </li>
          ))}
        </ul>
        <PlaceholderNote>{twoWays.note}</PlaceholderNote>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Implement SeeItFirst**

`web/components/sections/SeeItFirst.tsx`:
```tsx
import Image from 'next/image';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { seeItFirst } from '@/content/copy';
import { site } from '@/site.config';

// S5. Prime real estate: full width, feature-size heading.
export function SeeItFirst() {
  return (
    <section id="see-it" aria-labelledby="see-it-title" className="bg-secondary py-16 md:py-28">
      <Container>
        <SectionHeading id="see-it-title" title={seeItFirst.title} lede={seeItFirst.lede} size="feature" />
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4" aria-label="Sample displays">
          {seeItFirst.shelf.map((img) => (
            <li key={img.src} className="relative aspect-[3/4] w-56 shrink-0 snap-start overflow-hidden rounded-md bg-muted md:w-64">
              <Image src={img.src} alt={img.alt} fill sizes="256px" className="object-cover" />
            </li>
          ))}
        </ul>
        <DualCta className="mt-8" primary={{ label: seeItFirst.cta, href: site.bookingUrl }} />
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Implement About**

`web/components/sections/About.tsx`:
```tsx
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { about } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S7 / K10. Fixed 4:5 portrait slot so a replacement photo drops straight in.
export function About() {
  const facts = [
    { label: 'Years in flooring', value: String(yearsOfExperience()) },
    { label: 'In flooring since', value: String(site.startYear) },
    { label: 'Workmanship warranty', value: '1 yr' },
  ];
  return (
    <section id="about" aria-labelledby="about-title" className="py-16 md:py-24">
      <Container className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
          <Image src={about.portrait.src} alt={about.portrait.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
        </div>
        <div>
          <h2 id="about-title" className="text-3xl font-semibold tracking-tight text-navy md:text-4xl">{about.title}</h2>
          <blockquote className="mt-6 text-2xl font-medium leading-snug text-navy">{about.quote}</blockquote>
          {about.body.map((para) => (
            <p key={para} className="mt-4 text-foreground/80">{para}</p>
          ))}
          <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="bg-white p-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-3xl font-semibold text-navy">{f.value}</dd>
              </div>
            ))}
          </dl>
          <PlaceholderNote>{about.note}</PlaceholderNote>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Run to verify it passes**

Run: `npm test -- components/sections/simpleSections.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
cd .. && git add web/components/sections && git commit -m "feat(web): two-ways, see-it-first and about sections"
```

---

### Task 8: Mixed-media gallery with before/after slider

**Files:**
- Create: `web/components/blocks/BeforeAfter.tsx`, `web/components/blocks/GalleryPhoto.tsx`, `web/components/blocks/GalleryVideo.tsx`, `web/components/sections/Gallery.tsx`
- Test: `web/components/blocks/BeforeAfter.test.tsx`, `web/components/sections/Gallery.test.tsx`

**Interfaces:**
- Consumes: `GalleryItem`, `Img`, `galleryItems`, `Container`, `SectionHeading`
- Produces:
  - `BeforeAfter({ before: Img | null, after: Img | null, caption: string })`
  - `GalleryPhoto({ src, alt }: Img)`
  - `GalleryVideo({ src, poster, alt }: { src: string; poster: string; alt: string })`
  - `Gallery({ items?: GalleryItem[] })` renders `<section id="gallery">`

**Note:** The slider is a native `<input type="range">` rather than Radix Slider. It works with keyboard, touch and screen readers without extra code. This is a deliberate simplification of spec §3.4.

- [ ] **Step 1: Write the failing tests**

`web/components/blocks/BeforeAfter.test.tsx`:
```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BeforeAfter } from './BeforeAfter';

const before = { src: '/b.jpg', alt: 'Before shot' };
const after = { src: '/a.jpg', alt: 'After shot' };

describe('BeforeAfter', () => {
  it('starts at 50% and clips the before layer to the slider position', () => {
    render(<BeforeAfter before={before} after={after} caption="Stairs" />);
    const slider = screen.getByRole('slider', { name: 'Before and after comparison: Stairs' });
    expect(slider).toHaveValue('50');
    expect(screen.getByTestId('before-layer')).toHaveStyle({ clipPath: 'inset(0 50% 0 0)' });
    fireEvent.change(slider, { target: { value: '70' } });
    expect(screen.getByTestId('before-layer')).toHaveStyle({ clipPath: 'inset(0 30% 0 0)' });
  });

  it('degrades to a single image when one side is missing', () => {
    render(<BeforeAfter before={null} after={after} caption="Stairs" />);
    expect(screen.queryByRole('slider')).toBeNull();
    expect(screen.getByRole('img', { name: 'After shot' })).toBeInTheDocument();
  });
});
```

`web/components/sections/Gallery.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { GalleryItem } from '@/content/types';
import { Gallery } from './Gallery';

const items: GalleryItem[] = [
  { type: 'photo', id: 'p', image: { src: '/p.jpg', alt: 'A photo' }, caption: 'Photo caption' },
  { type: 'video', id: 'v', src: '/v.mp4', poster: '/v.jpg', alt: 'Crew installing', caption: 'Video caption' },
  { type: 'pair', id: 'pr', before: { src: '/b.jpg', alt: 'Before' }, after: { src: '/a.jpg', alt: 'After' }, caption: 'Pair caption' },
];

describe('Gallery', () => {
  it('renders photo, video and pair items in one grid with captions', () => {
    const { container } = render(<Gallery items={items} />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'gallery');
    expect(screen.getAllByRole('figure')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'A photo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play video: Crew installing' })).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText('Pair caption')).toBeInTheDocument();
  });

  it('loads the video only after the play button is clicked', async () => {
    const { container } = render(<Gallery items={items} />);
    expect(container.querySelector('video')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Play video: Crew installing' }));
    expect(container.querySelector('video')).toHaveAttribute('src', '/v.mp4');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- BeforeAfter Gallery`
Expected: FAIL, "Failed to resolve import './BeforeAfter'" and "'./Gallery'".

- [ ] **Step 3: Implement GalleryPhoto and GalleryVideo**

`web/components/blocks/GalleryPhoto.tsx`:
```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Img } from '@/content/types';

const SIZES = '(min-width: 768px) 33vw, 50vw';

/** A missing or broken image falls back to a neutral tile (spec §5). */
export function GalleryPhoto({ src, alt }: Img) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={alt} className="h-full w-full bg-muted" />;
  return <Image src={src} alt={alt} fill sizes={SIZES} className="object-cover" onError={() => setFailed(true)} />;
}
```

`web/components/blocks/GalleryVideo.tsx`:
```tsx
'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useState } from 'react';

export function GalleryVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    // Playback starts only after an explicit click.
    return <video className="h-full w-full object-cover" src={src} controls autoPlay playsInline />;
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${alt}`} className="group relative h-full w-full">
      <Image src={poster} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
      <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-navy transition-transform group-hover:scale-105">
        <Play aria-hidden className="ml-0.5 h-6 w-6" />
      </span>
    </button>
  );
}
```

- [ ] **Step 4: Implement BeforeAfter**

`web/components/blocks/BeforeAfter.tsx`:
```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Img } from '@/content/types';

const SIZES = '(min-width: 768px) 33vw, 50vw';
const tag = 'absolute top-2 rounded bg-navy/85 px-2 py-0.5 text-xs font-semibold text-white';

/** K6. Drag or arrow keys to compare. Degrades to one image if a side is missing. */
export function BeforeAfter({ before, after, caption }: { before: Img | null; after: Img | null; caption: string }) {
  const [pos, setPos] = useState(50);

  if (!before || !after) {
    const only = before ?? after;
    if (!only) return null;
    return <Image src={only.src} alt={only.alt} fill sizes={SIZES} className="object-cover" />;
  }

  return (
    <div className="relative h-full w-full select-none">
      <Image src={after.src} alt={after.alt} fill sizes={SIZES} className="object-cover" />
      <div data-testid="before-layer" className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes={SIZES} className="object-cover" />
      </div>
      <span className={`${tag} left-2`}>Before</span>
      <span className={`${tag} right-2`}>After</span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Before and after comparison: ${caption}`}
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow peer-focus-visible:w-1.5 peer-focus-visible:bg-syracuse"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-navy/80" />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Implement the Gallery section**

`web/components/sections/Gallery.tsx`:
```tsx
import { BeforeAfter } from '@/components/blocks/BeforeAfter';
import { GalleryPhoto } from '@/components/blocks/GalleryPhoto';
import { GalleryVideo } from '@/components/blocks/GalleryVideo';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { galleryItems } from '@/content/gallery';
import type { GalleryItem } from '@/content/types';

function Media({ item }: { item: GalleryItem }) {
  switch (item.type) {
    case 'photo':
      return <GalleryPhoto src={item.image.src} alt={item.image.alt} />;
    case 'video':
      return <GalleryVideo src={item.src} poster={item.poster} alt={item.alt} />;
    case 'pair':
      return <BeforeAfter before={item.before} after={item.after} caption={item.caption} />;
  }
}

// S4 / K5. One grid, one enforced ratio, for every media type.
export function Gallery({ items = galleryItems }: { items?: GalleryItem[] }) {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-16 md:py-24">
      <Container>
        <SectionHeading id="gallery-title" title="Recent work" lede="Real jobs by David and his technicians." />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {items.map((item) => (
            <li key={item.id}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Media item={item} />
                </div>
                <figcaption className="mt-2 text-sm text-foreground/80">{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Run to verify they pass**

Run: `npm test -- BeforeAfter Gallery`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
cd .. && git add web/components && git commit -m "feat(web): mixed-media gallery with before/after slider"
```

---

### Task 9: Brands grid and on-site brand stub pages

**Files:**
- Create: `web/components/sections/Brands.tsx`, `web/app/brands/[slug]/page.tsx`
- Test: `web/components/sections/Brands.test.tsx`

**Interfaces:**
- Consumes: `brands`, `brandsCopy`, `site.bookingUrl`, `Container`, `SectionHeading`, `DualCta`
- Produces: `Brands({ items?: Brand[] })` renders `<section id="brands">`; route `/brands/[slug]`

- [ ] **Step 1: Write the failing test**

`web/components/sections/Brands.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Brands } from './Brands';

describe('Brands', () => {
  it('links every brand inward to /brands/[slug]', () => {
    render(<Brands />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(7);
    for (const link of links) expect(link.getAttribute('href')).toMatch(/^\/brands\/[a-z0-9-]+$/);
  });

  it('reflows for any brand count', () => {
    render(<Brands items={[{ name: 'Solo', slug: 'solo' }]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- Brands`
Expected: FAIL, "Failed to resolve import './Brands'".

- [ ] **Step 3: Implement the section**

`web/components/sections/Brands.tsx`:
```tsx
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { brands } from '@/content/brands';
import { brandsCopy } from '@/content/copy';
import type { Brand } from '@/content/types';

// S6 / K8. Inbound links only. Never link to a manufacturer site (spec D9 / CH10).
export function Brands({ items = brands }: { items?: Brand[] }) {
  return (
    <section id="brands" aria-labelledby="brands-title" className="border-t border-border py-16 md:py-24">
      <Container>
        <SectionHeading id="brands-title" title={brandsCopy.title} lede={brandsCopy.lede} />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/brands/${b.slug}`}
                className="flex min-h-20 items-center justify-center rounded-md border border-border px-4 text-center text-lg font-semibold text-navy transition-colors hover:border-navy"
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Implement the brand stub page**

`web/app/brands/[slug]/page.tsx`:
```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { brands } from '@/content/brands';
import { site } from '@/site.config';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  return { title: brand ? `${brand.name} | ${site.businessName}` : site.businessName };
}

// STUB. The product and colour swatch grid (K9) comes in a later build.
export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();
  return (
    <Container className="py-16 md:py-24">
      <Link href="/#brands" className="text-sm font-semibold text-navy hover:underline">← All brands</Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-navy md:text-5xl">{brand.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/80">
        The full {brand.name} range and colours are coming to this page soon. In the meantime, David can bring samples to you.
      </p>
      <DualCta className="mt-8" primary={{ label: 'Book a Consultation', href: site.bookingUrl }} />
    </Container>
  );
}
```

- [ ] **Step 5: Run the tests and build**

Run: `npm test -- Brands`
Expected: PASS (2 tests).
Run: `npm run build`
Expected: success. The route list shows `/brands/[slug]` with 7 prerendered paths.

- [ ] **Step 6: Commit**

```bash
cd .. && git add web && git commit -m "feat(web): brand grid with on-site brand stub pages"
```

---

### Task 10: Reviews section

**Files:**
- Create: `web/components/blocks/ReviewCard.tsx`, `web/components/sections/Reviews.tsx`
- Test: `web/components/sections/Reviews.test.tsx`

**Interfaces:**
- Consumes: `Review`, `reviews`, `reviewsCopy`, `platformLabels`, `Container`, `SectionHeading`, `PlaceholderNote`
- Produces: `ReviewCard({ review }: { review: Review })`; `Reviews({ items?: Review[] })` renders `<section id="reviews">`

- [ ] **Step 1: Write the failing test**

`web/components/sections/Reviews.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reviews } from './Reviews';

describe('Reviews', () => {
  it('renders static cards with platform attribution', () => {
    const { container } = render(
      <Reviews items={[{ id: 'x', quote: 'Great job.', author: 'Holly', platform: 'yelp' }]} />,
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'reviews');
    expect(screen.getByText('Great job.')).toBeInTheDocument();
    expect(screen.getByText('Holly · Yelp')).toBeInTheDocument();
  });

  it('never auto-rotates (no timers or carousel roles)', () => {
    render(<Reviews />);
    expect(screen.queryByRole('region', { name: /carousel/i })).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- Reviews`
Expected: FAIL, "Failed to resolve import './Reviews'".

- [ ] **Step 3: Implement**

`web/components/blocks/ReviewCard.tsx`:
```tsx
import type { Review } from '@/content/types';
import { platformLabels } from '@/lib/platforms';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="h-full rounded-md border border-border bg-white p-6">
      <blockquote className="text-lg text-foreground">{review.quote}</blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-navy">
        {review.author} · {platformLabels[review.platform]}
      </figcaption>
    </figure>
  );
}
```

`web/components/sections/Reviews.tsx`:
```tsx
import { ReviewCard } from '@/components/blocks/ReviewCard';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { reviewsCopy } from '@/content/copy';
import { reviews } from '@/content/reviews';
import type { Review } from '@/content/types';

// S8 / K11. Static cards. No auto-rotation.
export function Reviews({ items = reviews }: { items?: Review[] }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-secondary py-16 md:py-24">
      <Container>
        <SectionHeading id="reviews-title" title={reviewsCopy.title} />
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((r) => (
            <li key={r.id}><ReviewCard review={r} /></li>
          ))}
        </ul>
        <PlaceholderNote>{reviewsCopy.note}</PlaceholderNote>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- Reviews`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
cd .. && git add web/components && git commit -m "feat(web): static review cards with platform attribution"
```

---

### Task 11: Contact section (lead form, consultation options, business panel)

**Files:**
- Create: `web/components/blocks/LeadForm.tsx`, `web/components/blocks/ConsultOptions.tsx`, `web/components/sections/Contact.tsx`
- Test: `web/components/blocks/LeadForm.test.tsx`, `web/components/sections/Contact.test.tsx`

**Interfaces:**
- Consumes: `leadFields`, `validateLead`, `submitLead`, `LeadResult`, `contactCopy`, `consultOptions`, `site`, `telHref`, `mailtoHref`, `ctaPrimary`, `SocialRow`, the shadcn `Input`/`Textarea`/`Label`, `Container`, `SectionHeading`
- Produces:
  - `LeadForm({ fields?: LeadField[]; submit?: (values: Record<string, string>, opts?: { forceError?: boolean }) => Promise<LeadResult> })`
  - `ConsultOptions()`
  - `Contact()` renders `<section id="contact">`

- [ ] **Step 1: Write the failing tests**

`web/components/blocks/LeadForm.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LeadForm } from './LeadForm';

async function fillValid() {
  await userEvent.type(screen.getByLabelText('Name'), 'Pat Smith');
  await userEvent.type(screen.getByLabelText('Email'), 'pat@example.com');
  await userEvent.type(screen.getByLabelText('Phone'), '704-555-0100');
  await userEvent.type(screen.getByLabelText("What you're looking for"), 'Two bedrooms, carpet.');
}

describe('LeadForm', () => {
  it('shows inline errors and does not submit when empty', async () => {
    const submit = vi.fn();
    render(<LeadForm submit={submit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send to David' }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(submit).not.toHaveBeenCalled();
  });

  it('uses a numeric keypad for phone and a guiding placeholder for the message', () => {
    render(<LeadForm submit={vi.fn()} />);
    expect(screen.getByLabelText('Phone')).toHaveAttribute('inputmode', 'tel');
    expect(screen.getByLabelText("What you're looking for")).toHaveAttribute(
      'placeholder',
      expect.stringContaining('Which rooms'),
    );
  });

  it('submits every field and shows the success state', async () => {
    const submit = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadForm submit={submit} />);
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: 'Send to David' }));
    expect(submit).toHaveBeenCalledWith(
      {
        name: 'Pat Smith',
        email: 'pat@example.com',
        phone: '704-555-0100',
        message: 'Two bedrooms, carpet.',
        company: '',
      },
      { forceError: false },
    );
    expect(await screen.findByRole('status')).toHaveTextContent('David will be in touch');
  });

  it('shows a retry message on failure and keeps the form', async () => {
    const submit = vi.fn().mockResolvedValue({ ok: false, error: 'mock-failure' });
    render(<LeadForm submit={submit} />);
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: 'Send to David' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please try again');
    expect(screen.getByRole('button', { name: 'Send to David' })).toBeEnabled();
  });
});
```

`web/components/sections/Contact.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Contact } from './Contact';

describe('Contact', () => {
  it('puts the form first and shows both consultation options', () => {
    const { container } = render(<Contact />);
    const section = container.querySelector('section#contact')!;
    const form = screen.getByRole('form', { name: 'Contact David' });
    expect(section.querySelector('.grid')!.firstElementChild).toContainElement(form);
    expect(screen.getByRole('heading', { name: 'Samples at your home' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Meet by appointment' })).toBeInTheDocument();
  });

  it('publishes no address, hours or map', () => {
    const { container } = render(<Contact />);
    expect(container.textContent).not.toMatch(/showroom|\bhours\b|address:|directions/i);
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('links phone and email', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: '704-614-1200' })).toHaveAttribute('href', 'tel:+17046141200');
    expect(screen.getByRole('link', { name: 'david@carolinasflooring.com' })).toHaveAttribute(
      'href',
      'mailto:david@carolinasflooring.com',
    );
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- LeadForm Contact`
Expected: FAIL, "Failed to resolve import './LeadForm'" and "'./Contact'".

- [ ] **Step 3: Implement LeadForm**

`web/components/blocks/LeadForm.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactCopy } from '@/content/copy';
import { leadFields } from '@/content/leadForm';
import type { LeadField } from '@/content/types';
import { ctaPrimary } from '@/lib/cta';
import { submitLead, type LeadResult } from '@/lib/submitLead';
import { validateLead, type LeadErrors } from '@/lib/validateLead';

type Submit = (values: Record<string, string>, opts?: { forceError?: boolean }) => Promise<LeadResult>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

// K13. Fields come from content/leadForm.ts, so adding one needs no layout change.
export function LeadForm({ fields = leadFields, submit = submitLead }: { fields?: LeadField[]; submit?: Submit }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateLead(values, fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus('sending');
    // Dev hook for exercising the failure state: /?formError=1
    const forceError = new URLSearchParams(window.location.search).get('formError') === '1';
    const payload = Object.fromEntries(fields.map((f) => [f.name, (values[f.name] ?? '').trim()]));
    const result = await submit({ ...payload, company: honeypot }, { forceError });
    setStatus(result.ok ? 'sent' : 'error');
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-md border border-border bg-secondary p-8">
        <p className="text-xl font-semibold text-navy">{contactCopy.success}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Contact David" className="relative">
      {fields.map((f) => {
        const id = `lead-${f.name}`;
        const error = errors[f.name];
        const common = {
          id,
          name: f.name,
          value: values[f.name] ?? '',
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValues((v) => ({ ...v, [f.name]: e.target.value })),
          required: f.required,
          placeholder: f.placeholder,
          autoComplete: f.autoComplete,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? `${id}-error` : undefined,
          className: 'text-base md:text-lg',
        };
        return (
          <div key={f.name} className="mb-5">
            <Label htmlFor={id} className="mb-2 block text-base font-medium">{f.label}</Label>
            {f.kind === 'textarea' ? (
              <Textarea {...common} rows={5} />
            ) : (
              <Input {...common} type={f.kind} inputMode={f.kind === 'tel' ? 'tel' : undefined} className="h-12 text-base md:text-lg" />
            )}
            {error && (
              <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-syracuse-ink">{error}</p>
            )}
          </div>
        );
      })}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      {status === 'error' && (
        <p role="alert" className="mb-4 font-medium text-syracuse-ink">{contactCopy.error}</p>
      )}
      <button type="submit" disabled={status === 'sending'} className={ctaPrimary}>
        {status === 'sending' ? contactCopy.sending : contactCopy.submit}
      </button>
    </form>
  );
}
```

Note: the "sending" label changes the button's accessible name only while sending. The tests query it before and after sending.

- [ ] **Step 4: Implement ConsultOptions and Contact**

`web/components/blocks/ConsultOptions.tsx`:
```tsx
import { consultOptions } from '@/content/copy';

// K16. Replaces the removed showroom content (spec S11 / N52).
export function ConsultOptions() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {consultOptions.map((o) => (
        <li key={o.title} className="rounded-md border border-border bg-white p-5">
          <h3 className="text-lg font-semibold text-navy">{o.title}</h3>
          <p className="mt-1 text-base text-foreground/80">{o.body}</p>
        </li>
      ))}
    </ul>
  );
}
```

`web/components/sections/Contact.tsx`:
```tsx
import { ConsultOptions } from '@/components/blocks/ConsultOptions';
import { LeadForm } from '@/components/blocks/LeadForm';
import { SocialRow } from '@/components/blocks/SocialRow';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { contactCopy } from '@/content/copy';
import { mailtoHref, telHref } from '@/lib/contact';
import { site } from '@/site.config';

// S10–S14. Form first (it's the conversion target). No address, hours or map.
export function Contact() {
  const details = [
    { label: 'Phone', value: site.phone, href: telHref(site.phone) },
    { label: 'Email', value: site.email, href: mailtoHref(site.email) },
    { label: 'Business', value: site.legalName },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-border py-16 md:py-24">
      <Container>
        <SectionHeading id="contact-title" title={contactCopy.title} lede={contactCopy.lede} />
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <LeadForm />
          </div>
          <div className="space-y-8">
            <dl>
              {details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 border-t border-border py-4 last:border-b">
                  <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{d.label}</dt>
                  <dd className="text-right">
                    {d.href ? <a href={d.href} className="font-medium text-navy hover:underline">{d.value}</a> : d.value}
                  </dd>
                </div>
              ))}
            </dl>
            <ConsultOptions />
            <p className="text-lg font-medium text-navy">{contactCopy.savings}</p>
            <SocialRow links={site.social} />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Run to verify they pass**

Run: `npm test -- LeadForm Contact`
Expected: PASS (7 tests).

- [ ] **Step 6: Commit**

```bash
cd .. && git add web/components && git commit -m "feat(web): contact section with validated lead form and consultation options"
```

---

### Task 12: Assemble the homepage from the ordered section list

**Files:**
- Create: `web/content/home.ts`
- Modify: `web/app/page.tsx`
- Test: `web/content/home.test.ts`

**Interfaces:**
- Consumes: all nine section components
- Produces: `homeSections: HomeSection[]`, where `HomeSection = { id: string; Component: React.ComponentType }`

- [ ] **Step 1: Write the failing test**

`web/content/home.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { homeSections } from './home';

describe('homeSections', () => {
  it('keeps the approved section order (spec §3)', () => {
    expect(homeSections.map((s) => s.id)).toEqual([
      'hero',
      'video',
      'two-ways',
      'gallery',
      'see-it',
      'brands',
      'about',
      'reviews',
      'contact',
    ]);
  });

  it('places the intro video directly after the hero', () => {
    const ids = homeSections.map((s) => s.id);
    expect(ids.indexOf('video')).toBe(ids.indexOf('hero') + 1);
  });

  it('contains no deleted sections', () => {
    const ids = homeSections.map((s) => s.id).join(' ');
    expect(ids).not.toMatch(/region|standards|showroom|hours/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- content/home.test.ts`
Expected: FAIL, "Failed to resolve import './home'".

- [ ] **Step 3: Implement**

`web/content/home.ts`:
```ts
import type { ComponentType } from 'react';
import { About } from '@/components/sections/About';
import { Brands } from '@/components/sections/Brands';
import { Contact } from '@/components/sections/Contact';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { IntroVideo } from '@/components/sections/IntroVideo';
import { Reviews } from '@/components/sections/Reviews';
import { SeeItFirst } from '@/components/sections/SeeItFirst';
import { TwoWays } from '@/components/sections/TwoWays';

export type HomeSection = { id: string; Component: ComponentType };

// Hybrid rule (spec §4): reorder, remove or graft a Concept B section by editing this array only.
// Deleted per spec: "highest standards" region band (S9), showroom block (S11), hours (S12).
export const homeSections: HomeSection[] = [
  { id: 'hero', Component: Hero },
  { id: 'video', Component: IntroVideo },
  { id: 'two-ways', Component: TwoWays },
  { id: 'gallery', Component: Gallery },
  { id: 'see-it', Component: SeeItFirst },
  { id: 'brands', Component: Brands },
  { id: 'about', Component: About },
  { id: 'reviews', Component: Reviews },
  { id: 'contact', Component: Contact },
];
```

`web/app/page.tsx`:
```tsx
import { homeSections } from '@/content/home';

// Re-render daily so the years figure rolls over on 1 January without a redeploy.
export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      {homeSections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
```

- [ ] **Step 4: Run all tests and build**

Run: `npm test`
Expected: PASS (all suites).
Run: `npm run build && npm run lint`
Expected: build succeeds (`/` shown with revalidate 1d), lint clean.

- [ ] **Step 5: Visual check**

Run: `npm run dev`, open `http://localhost:3000` at desktop and mobile widths, and confirm:
- the sections appear in order;
- orange appears only on CTAs, the highlighted headline phrase and the focus outline;
- there is no orange on navy.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
cd .. && git add web && git commit -m "feat(web): assemble homepage from ordered section list"
```

---

### Task 13: End-to-end acceptance tests (Playwright)

**Files:**
- Create: `web/playwright.config.ts`, `web/e2e/homepage.spec.ts`
- Modify: `web/.gitignore` (append Playwright output dirs)

**Interfaces:**
- Consumes: the built app, and `site` from `../site.config`

- [ ] **Step 1: Configure Playwright**

`web/playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, hasTouch: true } },
  ],
});
```

Append to `web/.gitignore`:
```
/test-results/
/playwright-report/
```

- [ ] **Step 2: Write the acceptance tests**

`web/e2e/homepage.spec.ts`:
```ts
import { expect, test, type Page } from '@playwright/test';
import { site } from '../site.config';

async function fillLeadForm(page: Page) {
  const form = page.getByRole('form', { name: 'Contact David' });
  await form.getByLabel('Name', { exact: true }).fill('Test Person');
  await form.getByLabel('Email', { exact: true }).fill('test@example.com');
  await form.getByLabel('Phone', { exact: true }).fill('704-555-0100');
  await form.getByLabel("What you're looking for").fill('Two bedrooms, carpet, next month.');
  return form;
}

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('headline and both hero CTAs are visible without scrolling', async ({ page }) => {
    const vh = page.viewportSize()!.height;
    const hero = page.locator('#top');
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    for (const name of ['Book a Consultation', 'Watch My Story']) {
      const box = await hero.getByRole('link', { name }).boundingBox();
      expect(box, name).not.toBeNull();
      expect(box!.y + box!.height, name).toBeLessThanOrEqual(vh);
    }
  });

  test('intro video is the first thing after the hero', async ({ page }) => {
    const ids = await page.locator('main > *').evaluateAll((els) => els.map((e) => e.id));
    expect(ids.slice(0, 2)).toEqual(['top', 'video']);
    await expect(page.locator('#video video')).not.toHaveAttribute('autoplay', /.*/);
  });

  test('no outbound links except configured social profiles', async ({ page }) => {
    const allowed = Object.values(site.social).filter(Boolean);
    const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      const internal = href.startsWith('/') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:');
      expect(internal || allowed.includes(href), href).toBe(true);
    }
  });

  test('publishes no showroom, address, hours or map', async ({ page }) => {
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/showroom|\bhours\b|directions/i);
    await expect(page.locator('iframe')).toHaveCount(0);
  });

  test('lead form validates, then shows success', async ({ page }) => {
    const form = page.getByRole('form', { name: 'Contact David' });
    await form.getByRole('button', { name: 'Send to David' }).click();
    await expect(form.getByText('Please enter your name.')).toBeVisible();
    await fillLeadForm(page);
    await form.getByRole('button', { name: 'Send to David' }).click();
    await expect(page.getByRole('status')).toContainText('David will be in touch');
  });

  test('before/after slider responds to the keyboard', async ({ page }) => {
    const slider = page.getByRole('slider').first();
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    const start = Number(await slider.inputValue());
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue(String(start + 1));
  });

  test('brand links stay on site', async ({ page }) => {
    await page.locator('#brands').getByRole('link', { name: 'Shaw' }).click();
    await expect(page).toHaveURL(/\/brands\/shaw$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Shaw' })).toBeVisible();
  });

  test('no horizontal scroll', async ({ page }) => {
    const [scrollW, clientW] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollW).toBeLessThanOrEqual(clientW);
  });
});

test('lead form shows a retry message on failure', async ({ page }) => {
  await page.goto('/?formError=1');
  const form = await fillLeadForm(page);
  await form.getByRole('button', { name: 'Send to David' }).click();
  await expect(page.getByRole('alert')).toContainText('Please try again');
});
```

- [ ] **Step 3: Run the suite**

Run: `npm run test:e2e`
Expected: 18 passed (9 tests × 2 projects).

If "hero CTAs visible" fails on mobile, reduce the hero's mobile vertical padding (`py-8` → `py-6`) and the headline size (`text-4xl` → `text-[2.1rem]`) in `components/sections/Hero.tsx`. The spec lets the headline compress, but the buttons must not drop below the fold. Re-run afterwards.

- [ ] **Step 4: Commit**

```bash
cd .. && git add web && git commit -m "test(web): Playwright acceptance tests for fold, links, form and slider"
```

---

### Task 14: README for the production app

**Files:**
- Create: `web/README.md` (replaces the create-next-app README)

- [ ] **Step 1: Write the README**

`web/README.md`:
````markdown
# Carolinas Flooring — production homepage (Concept A)

Built from `docs/superpowers/specs/2026-09-23-concept-a-homepage-design.md`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (Vitest)
npm run test:e2e   # acceptance tests (Playwright, builds first)
```

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

- **Business-card blue (C1):** replace `--brand-navy` and `--brand-navy-deep`, then run `npm run poster`.
- **Social profile URLs:** Google, Facebook, Yelp and Apple are hidden until set in `site.config.ts`.
- **Booking:** `bookingUrl` points to the contact form until the Google appointment schedule exists.
- **Lead form:** mocked (`lib/submitLead.ts`) and sends nothing. Wire it to an `/api/lead` route next.
- **Content:** all copy, reviews and the portrait are placeholders. Drop the intro video at `public/assets/david-intro.mp4`.
- **Brand pages:** `/brands/[slug]` is a stub until the product/colour swatch grid is built.
````

- [ ] **Step 2: Commit**

```bash
cd .. && git add web/README.md && git commit -m "docs(web): README with config map and outstanding stubs"
```
