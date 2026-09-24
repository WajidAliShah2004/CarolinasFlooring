import Link from 'next/link';
import { ctaPrimary, ctaSecondary, ctaSecondaryDark } from '@/lib/cta';
import { cn } from '@/lib/utils';

type Cta = { label: string; href: string };
type Props = {
  primary: Cta;
  secondary?: Cta;
  className?: string;
  /** 'dark' = on an ink surface: the secondary becomes a bone outline. */
  tone?: 'light' | 'dark';
  fullWidthMobile?: boolean;
};

/** K2 — primary = orange fill, secondary = outline. Only one orange CTA per section. */
export function DualCta({ primary, secondary, className, tone = 'light', fullWidthMobile = false }: Props) {
  const width = fullWidthMobile ? 'w-full sm:w-auto' : '';
  return (
    <div className={cn('flex flex-wrap gap-3', fullWidthMobile && 'flex-col sm:flex-row', className)}>
      <Link href={primary.href} className={cn(ctaPrimary, width)}>{primary.label}</Link>
      {secondary && (
        <Link href={secondary.href} className={cn(tone === 'dark' ? ctaSecondaryDark : ctaSecondary, width)}>
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
