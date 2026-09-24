import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { brands } from '@/content/brands';
import { brandsCopy } from '@/content/copy';
import type { Brand } from '@/content/types';

// S6 / K8. Inbound links only — never to a manufacturer site (spec D9 / CH10).
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
                className="flex min-h-20 items-center justify-center rounded-md bg-white px-4 text-center text-lg font-semibold text-navy shadow-soft transition-shadow hover:ring-2 hover:ring-navy"
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
