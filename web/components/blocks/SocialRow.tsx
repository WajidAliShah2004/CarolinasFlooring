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
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-4 text-[13.5px] font-medium transition-colors',
              tone === 'dark' ? 'border-bone/40 text-bone hover:bg-bone/10' : 'border-ink text-ink hover:bg-ink hover:text-bone',
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
