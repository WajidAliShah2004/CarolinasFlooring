import Image from 'next/image';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { seeItFirst } from '@/content/copy';
import { site } from '@/site.config';

// S5. Prime real estate — full width, feature-size heading.
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
