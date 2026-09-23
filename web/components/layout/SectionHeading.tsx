import { cn } from '@/lib/utils';

type Props = {
  id: string;
  title: string;
  lede?: string;
  tone?: 'light' | 'dark';
  size?: 'default' | 'feature';
};

export function SectionHeading({ id, title, lede, tone = 'light', size = 'default' }: Props) {
  const dark = tone === 'dark';
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <h2
        id={id}
        className={cn(
          'font-semibold tracking-tight',
          size === 'feature' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl',
          dark ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {lede && <p className={cn('mt-3 text-lg', dark ? 'text-white/85' : 'text-foreground/80')}>{lede}</p>}
    </div>
  );
}
