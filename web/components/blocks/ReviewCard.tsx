import type { Review } from '@/content/types';
import { platformLabels } from '@/lib/platforms';

// Mockup-styled review card: paper, hairline border, serif quote, platform attribution.
export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-[4px] border border-line bg-paper p-6">
      <p aria-hidden className="text-[13px] tracking-[0.18em] text-tan">★★★★★</p>
      <blockquote className="mt-3 flex-1 font-display text-[18px] leading-[1.45] text-ink">{review.quote}</blockquote>
      <figcaption className="mt-4 text-[12px] font-medium uppercase tracking-[0.16em] text-stone">
        {review.author} · {platformLabels[review.platform]}
      </figcaption>
    </figure>
  );
}
