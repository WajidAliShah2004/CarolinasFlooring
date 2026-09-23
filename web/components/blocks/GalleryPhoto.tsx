'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Img } from '@/content/types';

const SIZES = '(min-width: 768px) 33vw, 50vw';

/** A missing or broken image falls back to a neutral tile (spec §5). */
export function GalleryPhoto({ src, alt }: Img) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={alt} className="h-full w-full bg-muted" />;
  return <Image src={src} alt={alt} fill sizes={SIZES} className="object-cover" onError={() => setFailed(true)} />;
}
