import Image from 'next/image';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { seeItFirst } from '@/content/copy';
import { site } from '@/site.config';

// S5 / K7 — "See it before you buy it": pale band, snap-scrolling shelf of display photos, primary CTA.
// Brands have their own section (S6) per the docx section map.
export function SeeItFirst() {
  return (
    <section id="see-it" aria-labelledby="see-it-title" className="border-y border-line bg-surface py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="see-it-title" title={seeItFirst.title} lede={seeItFirst.lede} />
        </Reveal>
        <Reveal>
          <ul className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-3" aria-label="Sample displays">
            {seeItFirst.shelf.map((img) => (
              <li
                key={img.src}
                className="group relative aspect-[3/4] w-[clamp(200px,24vw,290px)] shrink-0 snap-start overflow-hidden rounded-[4px] border border-line bg-white"
              >
                <Image src={img.src} alt={img.alt} fill sizes="290px" className="object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/55 to-transparent px-4 pt-8 pb-3 text-[12.5px] font-semibold text-white">
                  {img.alt}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <DualCta className="mt-8" primary={{ label: seeItFirst.cta, href: site.bookingUrl }} />
        </Reveal>
      </Container>
    </section>
  );
}
