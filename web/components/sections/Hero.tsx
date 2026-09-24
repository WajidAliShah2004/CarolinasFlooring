import { DualCta } from '@/components/blocks/DualCta';
import { Parquet } from '@/components/blocks/Parquet';
import { Container } from '@/components/layout/Container';
import { hero } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S1 — Concept A mockup hero: serif headline left, parquet panel right, both CTAs above the fold.
export function Hero() {
  const years = yearsOfExperience();
  const h = hero.headline(years);
  return (
    <section id="top" aria-label="Introduction" className="border-b border-line">
      <Container className="grid items-center gap-8 py-10 md:grid-cols-[1.05fr_0.95fr] md:gap-[clamp(32px,5vw,72px)] md:py-[clamp(56px,8vw,104px)]">
        <div>
          <p className="mb-6 text-[11.5px] font-semibold uppercase tracking-[0.24em] text-tan-deep">{hero.eyebrow(site.startYear)}</p>
          <h1 className="font-display text-[clamp(38px,5.6vw,70px)] font-semibold leading-[1.03] tracking-[-0.028em] text-balance text-ink">
            {h.before}
            <em className="italic text-tan-deep">{h.highlight}</em>
            {h.after}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[clamp(17px,1.5vw,19.5px)] leading-[1.62] text-stone">{hero.lede}</p>
          <DualCta
            className="mt-9"
            fullWidthMobile
            primary={{ label: hero.primaryCta, href: site.bookingUrl }}
            secondary={{ label: hero.secondaryCta, href: '#video' }}
          />
          <ul aria-label="Why David" className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-stone">
            {hero.trust(years).map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-tan" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        {/* Below the text on phones so both CTAs stay above the fold (docx §9.2); beside it on desktop. */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-[#EFE7DC] md:aspect-[1/1.02]">
          <Parquet />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-bone/10 to-bone/70" />
          <div className="absolute bottom-0 left-0 z-10 rounded-tr-[4px] bg-bone px-5 pt-3.5 pb-3 text-[11.5px] font-medium uppercase tracking-[0.16em] text-stone">
            {hero.panelTag}
          </div>
        </div>
      </Container>
    </section>
  );
}
