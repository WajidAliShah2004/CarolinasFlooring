import type { Review } from '@/content/types';
import { platformLabels } from '@/lib/platforms';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="h-full rounded-md bg-white p-6 shadow-soft">
      <blockquote className="text-lg text-foreground">{review.quote}</blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-navy">
        {review.author} · {platformLabels[review.platform]}
      </figcaption>
    </figure>
  );
}
