import { cn } from '@/lib/utils';

export function PlaceholderNote({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return <p className={cn('mt-4 text-[12.5px] font-semibold', tone === 'dark' ? 'text-white/70' : 'text-orange-text')}>{children}</p>;
}
