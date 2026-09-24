import { cn } from '@/lib/utils';

type Props = {
  id: string;
  title: string;
  lede?: string;
  tone?: 'light' | 'dark';
  size?: 'default' | 'feature';
  /** Kept for API compatibility; the mockup's headings carry no numbers, so these render nothing. */
  number?: string;
  label?: string;
};

// Mockup `.shead`: serif h2 on the left, short sans note on the right, baseline-aligned.
export function SectionHeading({ id, title, lede, tone = 'light', size = 'default' }: Props) {
  const dark = tone === 'dark';
  return (
    <div className="mb-10 flex flex-wrap items-baseline gap-5 md:mb-13">
      <h2
        id={id}
        className={cn(
          'font-display font-semibold leading-[1.12] tracking-[-0.024em]',
          size === 'feature' ? 'text-[clamp(30px,3.8vw,46px)]' : 'text-[clamp(27px,3.4vw,42px)]',
          dark ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {lede && <p className={cn('max-w-[34ch] text-[15px] md:ml-auto', dark ? 'text-white/75' : 'text-stone')}>{lede}</p>}
    </div>
  );
}
