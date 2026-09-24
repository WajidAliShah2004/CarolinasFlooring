import { cn } from '@/lib/utils';

export function PlaceholderNote({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return <p className={cn('mt-4 text-sm italic', tone === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>{children}</p>;
}
