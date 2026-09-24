import type { SocialPlatform } from '@/content/types';
import { platformLabels, socialPlatforms } from '@/lib/platforms';
import { cn } from '@/lib/utils';

type Props = { links: Partial<Record<SocialPlatform, string>>; tone?: 'light' | 'dark' };

// Brand marks need permission; a lettered circle stands in until then.
const MARK: Record<SocialPlatform, string> = { google: 'G', facebook: 'f', yelp: 'Y', apple: '' };

/** S13 / K14 — icon row of review profiles. Tap targets ≥ 44px, open in a new tab. Hidden until a URL is configured. */
export function SocialRow({ links, tone = 'light' }: Props) {
  const set = socialPlatforms.filter((p) => (links[p] ?? '').trim() !== '');
  if (set.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2.5" aria-label="Find us online">
      {set.map((platform) => (
        <li key={platform}>
          <a
            href={links[platform]}
            target="_blank"
            rel="noopener noreferrer"
            title={platformLabels[platform]}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-[18px] font-semibold transition-colors',
              tone === 'dark' ? 'border-white/50 text-white hover:bg-white/10' : 'border-navy text-navy hover:bg-navy hover:text-white',
            )}
          >
            <span aria-hidden>{MARK[platform]}</span>
            <span className="sr-only">{platformLabels[platform]} (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
