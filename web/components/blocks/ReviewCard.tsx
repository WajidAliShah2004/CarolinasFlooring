import { Star } from 'lucide-react';
import type { Review } from '@/content/types';
import { platformLabels } from '@/lib/platforms';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-xl bg-white p-6 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="flex gap-0.5 text-syracuse" aria-label="5 out of 5 stars" role="img">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} data-star aria-hidden className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-lg text-foreground">{review.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
          {initials(review.author)}
        </span>
        <span className="text-sm font-semibold text-navy">{review.author}</span>
        <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-navy">
          {platformLabels[review.platform]}
        </span>
      </figcaption>
    </figure>
  );
}
