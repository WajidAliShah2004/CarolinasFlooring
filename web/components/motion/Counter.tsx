'use client';

import { useEffect, useRef, useState } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';
const FRAME_MS = 16;

/** Counts from 0 to `to` the first time it scrolls into view. Instant under reduced motion. */
export function Counter({ to, duration = 1000, className }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const steps = Math.max(1, Math.round(duration / FRAME_MS));
        let i = 0;
        const tick = () => {
          i += 1;
          const p = i / steps;
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * to));
          if (i < steps) timer = setTimeout(tick, FRAME_MS);
        };
        timer = setTimeout(tick, FRAME_MS);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [to, duration]);

  return <span ref={ref} className={className}>{value}</span>;
}
