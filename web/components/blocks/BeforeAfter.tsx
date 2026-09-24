'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Img } from '@/content/types';

const SIZES = '(min-width: 768px) 33vw, 50vw';
const tag = 'absolute top-2 rounded bg-ink/85 px-2 py-0.5 text-xs font-semibold text-bone';

/** K6 — drag or arrow-key to compare. Degrades to one image if a side is missing. */
export function BeforeAfter({ before, after, caption }: { before: Img | null; after: Img | null; caption: string }) {
  const [pos, setPos] = useState(50);

  if (!before || !after) {
    const only = before ?? after;
    if (!only) return null;
    return <Image src={only.src} alt={only.alt} fill sizes={SIZES} className="object-cover" />;
  }

  return (
    <div className="relative h-full w-full select-none">
      <Image src={after.src} alt={after.alt} fill sizes={SIZES} className="object-cover" />
      <div data-testid="before-layer" className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes={SIZES} className="object-cover" />
      </div>
      <span className={`${tag} left-2`}>Before</span>
      <span className={`${tag} right-2`}>After</span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Before and after comparison: ${caption}`}
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow peer-focus-visible:w-1.5 peer-focus-visible:bg-tan"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink/80" />
      </div>
    </div>
  );
}
