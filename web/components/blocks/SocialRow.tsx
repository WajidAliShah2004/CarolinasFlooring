import type { SocialPlatform } from '@/content/types';
import { platformLabels, socialPlatforms } from '@/lib/platforms';
import { cn } from '@/lib/utils';

type Props = { links: Partial<Record<SocialPlatform, string>>; tone?: 'light' | 'dark' };

export function SocialRow({ links, tone = 'light' }: Props) {
  const set = socialPlatforms.filter((p) => (links[p] ?? '').trim() !== '');
  if (set.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Find us online">
      {set.map((platform) => (
        <li key={platform}>
          <a
            href={links[platform]}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 px-4 text-sm font-semibold transition-colors',
              tone === 'dark'
                ? 'border-white/50 text-white hover:bg-white/10'
                : 'border-navy text-navy hover:bg-navy hover:text-white',
            )}
          >
            {platformLabels[platform]}{' '}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
