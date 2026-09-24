'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useState } from 'react';

export function GalleryVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    // Playback starts only after an explicit click.
    return <video className="h-full w-full object-cover" src={src} controls autoPlay playsInline />;
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${alt}`} className="group relative h-full w-full">
      <Image src={poster} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
      <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-bone/90 text-ink transition-transform group-hover:scale-105">
        <Play aria-hidden className="ml-0.5 h-6 w-6" />
      </span>
    </button>
  );
}
