import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { brands } from '@/content/brands';
import { brandsCopy, seeItFirst } from '@/content/copy';
import type { Brand } from '@/content/types';

// S6 / K8 (docx §7.7): a grid that reflows at any brand count. Inbound links only — never to a manufacturer site.
// Styled text until logo permission is confirmed (C10).
export function Brands({ items = brands }: { items?: Brand[] }) {
  return (
    <section id="brands" aria-labelledby="brands-title" className="border-t border-line py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="brands-title" title={brandsCopy.title} lede={brandsCopy.lede} />
        </Reveal>
        <Reveal>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/brands/${b.slug}`}
                  className="flex min-h-20 items-center justify-center rounded-[4px] border border-line bg-white px-4 text-center font-display text-[19px] font-semibold text-navy transition-colors hover:border-navy"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
          <PlaceholderNote>{seeItFirst.note}</PlaceholderNote>
        </Reveal>
      </Container>
    </section>
  );
}
