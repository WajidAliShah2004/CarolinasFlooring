import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { services } from '@/content/copy';
import { cn } from '@/lib/utils';

const SWATCH: Record<(typeof services.rows)[number]['swatch'], string> = {
  carpet: 'bg-stone [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.22)_1px,transparent_1.4px)] [background-size:4px_4px]',
  wood: 'bg-wood-2 [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.13)_0_1px,transparent_1px_13px)]',
  lvp: 'bg-wood-3 [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.1)_0_1px,transparent_1px_26px),repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0_1px,transparent_1px_32px)]',
  tile: 'bg-[#D9D5CE] [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.17)_0_1px,transparent_1px_21px),repeating-linear-gradient(90deg,rgba(0,0,0,0.17)_0_1px,transparent_1px_21px)]',
};

// S3 — mockup "Four floors, sold two ways": numbered editorial rows with a swatch, not cards.
export function TwoWays() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="services-title" title={services.title} lede={services.lede} />
        </Reveal>
        <Reveal>
          <ul>
            {services.rows.map((row, i) => (
              <li
                key={row.title}
                className="grid grid-cols-[auto_1fr] items-start gap-[clamp(20px,4vw,48px)] border-t border-line py-8 last:border-b md:grid-cols-[auto_1fr_auto]"
              >
                <span className="pt-1.5 font-display text-[15px] font-semibold text-tan-deep">0{i + 1}</span>
                <div>
                  <h3 className="mb-2.5 font-display text-[clamp(23px,2.6vw,31px)] font-semibold tracking-[-0.02em] text-ink">{row.title}</h3>
                  <p className="max-w-[56ch] text-[16px] text-stone">{row.body}</p>
                  <p className="mt-2.5 text-[12.5px] font-semibold tracking-[0.04em] text-tan-deep">{row.brands}</p>
                </div>
                <span aria-hidden className={cn('hidden h-16 w-24 rounded-[3px] md:block', SWATCH[row.swatch])} />
              </li>
            ))}
          </ul>
        </Reveal>
        <PlaceholderNote>{services.note}</PlaceholderNote>
      </Container>
    </section>
  );
}
