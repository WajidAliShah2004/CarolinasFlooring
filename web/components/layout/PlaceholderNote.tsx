import { cn } from '@/lib/utils';

export function PlaceholderNote({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return <p className={cn('mt-4 text-[12.5px] font-semibold', tone === 'dark' ? 'text-bone/70' : 'text-tan-deep')}>{children}</p>;
}
