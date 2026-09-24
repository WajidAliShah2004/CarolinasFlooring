import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { services, twoWays } from '@/content/copy';
import { ctaPrimary, ctaSecondary } from '@/lib/utils-cta';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';

// S3 / K4 (docx §7.4): two clearly parallel paths of equal weight, each with its own CTA.
// The four floor types sit underneath as a compact list (from the Concept A mockup).
export function TwoWays() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="services-title" title={twoWays.title} lede={twoWays.lede} />
        </Reveal>
        <ul className="grid gap-5 md:grid-cols-2">
          {twoWays.paths.map((path, i) => (
            <Reveal as="li" key={path.title} delay={i * 80} className="flex flex-col rounded-[4px] border border-line bg-white p-8">
              <p className="font-display text-[15px] font-semibold text-orange-text">0{i + 1}</p>
              <h3 className="mt-2 font-display text-[clamp(23px,2.6vw,31px)] font-semibold tracking-[-0.02em] text-navy">{path.title}</h3>
              <p className="mt-3 flex-1 text-stone">{path.body}</p>
              <Link href={site.bookingUrl} className={cn(i === 0 ? ctaSecondary : ctaPrimary, 'mt-6 self-start')}>
                {path.cta}
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <ul className="mt-8 grid gap-x-8 gap-y-3 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Floor types">
            {services.rows.map((row) => (
              <li key={row.title}>
                <p className="font-display text-[19px] font-semibold text-navy">{row.title}</p>
                <p className="mt-1 text-[12.5px] font-semibold tracking-[0.04em] text-orange-text">{row.brands}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <PlaceholderNote>{twoWays.note}</PlaceholderNote>
      </Container>
    </section>
  );
}
