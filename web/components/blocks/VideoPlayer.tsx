'use client';

import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type Chapter = { label: string; seconds: number };

type Props = {
  src: string;
  poster: string;
  title: string;
  subtitle: string;
  duration?: string;
  chapters?: Chapter[];
};

/**
 * K3 — cinematic player. Never autoplays; the poster is always present.
 * Chapter chips seek and play. With no video file yet, play() rejects silently and the poster stays.
 */
export function VideoPlayer({ src, poster, title, subtitle, duration, chapters = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  function start(seconds?: number) {
    const v = videoRef.current;
    if (!v) return;
    setPlaying(true);
    if (seconds !== undefined) v.currentTime = seconds;
    void v.play().catch(() => {});
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-navy-deep shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          controls={playing}
          preload="none"
          playsInline
          poster={poster}
          onPlay={() => setPlaying(true)}
        >
          <source src={src} type="video/mp4" />
        </video>

        {!playing && (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/20 to-transparent" />
            <button
              type="button"
              onClick={() => start()}
              aria-label={`Play video: ${title}`}
              className="group absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-syracuse text-white shadow-xl transition-transform group-hover:scale-105">
                <Play aria-hidden className="ml-1 h-9 w-9 fill-current" />
              </span>
            </button>
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-lg font-semibold leading-tight">{title}</p>
                <p className="text-sm text-white/80">{subtitle}</p>
              </div>
              {duration && (
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {duration}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {chapters.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Video chapters">
          {chapters.map((c, i) => (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => {
                  setActive(i);
                  start(c.seconds);
                }}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  active === i
                    ? 'border-white bg-white text-navy'
                    : 'border-white/30 text-white/85 hover:border-white hover:text-white',
                )}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
