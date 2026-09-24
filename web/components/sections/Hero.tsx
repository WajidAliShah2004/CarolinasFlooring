import Image from 'next/image';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { hero } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S1 (modernized). Navy band; staircase photo right on desktop, behind the text on phones.
// The orange bottom border is the rule between hero and video — nothing may sit between them.
export function Hero() {
  const years = yearsOfExperience();
  const h = hero.headline(years);
  const watermark = site.businessName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative isolate overflow-hidden border-b-4 border-syracuse bg-gradient-to-br from-navy-deep via-navy-deep to-navy text-white"
    >
      <Image src={hero.image.src} alt="" fill priority sizes="100vw" className="-z-20 object-cover md:hidden" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy-deep/85 md:hidden" />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-4 top-1/2 -z-10 hidden -translate-y-1/2 select-none text-[28rem] font-bold leading-none tracking-tighter text-white/5 md:block"
      >
        {watermark}
      </span>
      <Container className="grid items-center gap-10 py-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
            <span className="text-syracuse">01</span> · {hero.eyebrow}
          </p>
          <h1 className="mt-4 text-[2.125rem] font-semibold leading-[1.05] tracking-tight md:text-7xl">
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
        <div className="relative hidden md:block">
          <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-navy/60 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
            <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="45vw" className="object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
