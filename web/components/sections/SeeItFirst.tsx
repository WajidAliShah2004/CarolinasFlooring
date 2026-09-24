import Image from 'next/image';
import Link from 'next/link';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { brands } from '@/content/brands';
import { seeItFirst } from '@/content/copy';
import { site } from '@/site.config';

// S5 + S6 — mockup "See it before you buy it": paper band, snap-scrolling shelf of display photos,
// then the "On display" brand list. Brands link inward only (docx D9).
export function SeeItFirst() {
  return (
    <section id="see-it" aria-labelledby="see-it-title" className="border-y border-line bg-paper py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="see-it-title" title={seeItFirst.title} lede={seeItFirst.lede} />
        </Reveal>
        <Reveal>
          <ul className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-3" aria-label="Sample displays">
            {seeItFirst.shelf.map((img) => (
              <li
                key={img.src}
                className="group relative aspect-[3/4] w-[clamp(200px,24vw,290px)] shrink-0 snap-start overflow-hidden rounded-[4px] border border-line bg-[#EFE7DC]"
              >
                <Image src={img.src} alt={img.alt} fill sizes="290px" className="object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/55 to-transparent px-4 pt-8 pb-3 text-[12.5px] font-semibold text-white">
                  {img.alt}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <p id="brands" className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">{seeItFirst.onDisplay}</span>
            {brands.map((b) => (
              <Link key={b.slug} href={`/brands/${b.slug}`} className="text-[15px] font-bold tracking-[-0.01em] text-tan-deep hover:underline">
                {b.name}
              </Link>
            ))}
          </p>
          <PlaceholderNote>{seeItFirst.note}</PlaceholderNote>
          <DualCta className="mt-8" primary={{ label: seeItFirst.cta, href: site.bookingUrl }} />
        </Reveal>
      </Container>
    </section>
  );
}
