'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const REDUCED = '(prefers-reduced-motion: reduce)';

type Props = {
  children: React.ReactNode;
  /** Stagger, in ms. */
  delay?: number;
  className?: string;
  as?: 'div' | 'li';
};

/** Fade/rise into place once, on first intersection. Instant under reduced motion. */
export function Reveal({ children, delay = 0, className, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) {
      // Deferred so the effect only schedules work rather than setting state synchronously.
      const t = setTimeout(() => setShown(true), 0);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-revealed={shown ? '' : undefined}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
