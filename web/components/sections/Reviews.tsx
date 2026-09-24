import { ReviewCard } from '@/components/blocks/ReviewCard';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { reviewsCopy } from '@/content/copy';
import { reviews } from '@/content/reviews';
import type { Review } from '@/content/types';

// S8 — mockup "Why people call back": three starred columns, then the review cards (docx K11). No auto-rotation.
export function Reviews({ items = reviews }: { items?: Review[] }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="reviews-title" title={reviewsCopy.title} />
        </Reveal>
        <Reveal>
          <div className="grid gap-[clamp(20px,3vw,44px)] md:grid-cols-3">
            {reviewsCopy.trust.map((t) => (
              <div key={t.title}>
                <p aria-hidden className="mb-3 text-[14px] tracking-[0.18em] text-tan">★★★★★</p>
                <h3 className="mb-2 font-display text-[20px] font-semibold tracking-[-0.015em] text-ink">{t.title}</h3>
                <p className="text-[15px] text-stone">{t.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <ul className="mt-12 grid gap-3.5 md:grid-cols-3">
            {items.map((r) => (
              <li key={r.id}><ReviewCard review={r} /></li>
            ))}
          </ul>
          <PlaceholderNote>{reviewsCopy.note}</PlaceholderNote>
        </Reveal>
      </Container>
    </section>
  );
}
