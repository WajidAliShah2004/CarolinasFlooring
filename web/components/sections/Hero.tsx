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
