import type { Review } from '@/content/types';
import { platformLabels } from '@/lib/platforms';

// Review card: white, hairline rule, serif quote, platform attribution (docx K11).
export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-[4px] border border-line bg-surface p-6">
      <p aria-hidden className="text-[13px] tracking-[0.18em] text-orange">★★★★★</p>
      <blockquote className="mt-3 flex-1 font-display text-[18px] leading-[1.45] text-navy">{review.quote}</blockquote>
      <figcaption className="mt-4 text-[12px] font-medium uppercase tracking-[0.16em] text-stone">
        {review.author} · {platformLabels[review.platform]}
      </figcaption>
    </figure>
  );
}
