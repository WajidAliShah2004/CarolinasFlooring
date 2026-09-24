import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { faq } from '@/content/copy';

// Native <details> accordion — accessible, no JS.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-secondary py-16 md:py-24">
      <Container className="md:grid md:grid-cols-[1fr_2fr] md:gap-16">
        <SectionHeading id="faq-title" number={faq.number} label={faq.label} title={faq.title} />
        <div>
          <div className="divide-y divide-border overflow-hidden rounded-xl bg-white shadow-soft">
            {faq.items.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-navy transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-6 text-foreground/80">{item.a}</p>
              </details>
            ))}
          </div>
          <PlaceholderNote>{faq.note}</PlaceholderNote>
        </div>
      </Container>
    </section>
  );
}
