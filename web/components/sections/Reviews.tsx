import { ReviewCard } from '@/components/blocks/ReviewCard';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { reviewsCopy } from '@/content/copy';
import { reviews } from '@/content/reviews';
import type { Review } from '@/content/types';

// S8 / K11. Static cards — no auto-rotation.
export function Reviews({ items = reviews }: { items?: Review[] }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-secondary py-16 md:py-24">
      <Container>
        <SectionHeading id="reviews-title" number="08" label="Reviews" title={reviewsCopy.title} />
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((r) => (
            <li key={r.id}><ReviewCard review={r} /></li>
          ))}
        </ul>
        <PlaceholderNote>{reviewsCopy.note}</PlaceholderNote>
      </Container>
    </section>
  );
}
