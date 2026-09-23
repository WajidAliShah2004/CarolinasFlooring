import Link from 'next/link';
import { ctaPrimary, ctaSecondary } from '@/lib/cta';
import { cn } from '@/lib/utils';

type Cta = { label: string; href: string };

/** K2 — primary = orange fill, secondary = navy outline. Only one orange CTA per section. */
export function DualCta({ primary, secondary, className }: { primary: Cta; secondary?: Cta; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Link href={primary.href} className={ctaPrimary}>{primary.label}</Link>
      {secondary && <Link href={secondary.href} className={ctaSecondary}>{secondary.label}</Link>}
    </div>
  );
}
