import { cn } from '@/lib/utils';

type Props = {
  id: string;
  title: string;
  lede?: string;
  tone?: 'light' | 'dark';
  size?: 'default' | 'feature';
  /** Numbered label, e.g. number="02" label="Services" → "02 · Services". */
  number?: string;
  label?: string;
};

export function SectionHeading({ id, title, lede, tone = 'light', size = 'default', number, label }: Props) {
  const dark = tone === 'dark';
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <span aria-hidden className="mb-4 block h-1 w-10 rounded-full bg-syracuse" />
      {number && (
        <p className={cn('mb-3 text-xs font-semibold uppercase tracking-[0.22em]', dark ? 'text-white/70' : 'text-muted-foreground')}>
          {number}
          {label && <> · {label}</>}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          'font-semibold tracking-tight',
          size === 'feature' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl',
          dark ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {lede && <p className={cn('mt-3 text-lg', dark ? 'text-white/85' : 'text-foreground/80')}>{lede}</p>}
    </div>
  );
}
