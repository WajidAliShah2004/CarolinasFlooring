'use client';

import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type Chapter = { label: string; seconds: number };

type Props = {
  /** Empty until the video exists — then no request is made and no 404 is logged. */
  src?: string;
  poster: string;
  title: string;
  subtitle: string;
  duration?: string;
  chapters?: Chapter[];
};

/**
 * K3 — video player in the mockup's frame (dark ink surface, 5px radius, deep shadow). Never autoplays.
 * Chapter chips seek and play. With no video file yet, nothing is fetched and the poster stays.
 */
export function VideoPlayer({ src, poster, title, subtitle, duration, chapters = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  function start(seconds?: number) {
    const v = videoRef.current;
    if (!v || !src) return; // no video yet: the poster stays, nothing is fetched
    setPlaying(true);
    if (seconds !== undefined) v.currentTime = seconds;
    void v.play().catch(() => {});
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-[5px] bg-navy-deep shadow-soft">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          controls={playing}
          preload="none"
          playsInline
          poster={poster}
          onPlay={() => setPlaying(true)}
        >
          {src && <source src={src} type="video/mp4" />}
        </video>

        {!playing && (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/15 to-transparent" />
            <button type="button" onClick={() => start()} aria-label={`Play video: ${title}`} className="group absolute inset-0 flex items-center justify-center">
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/80 bg-white/10 text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-navy">
                <Play aria-hidden className="ml-1 h-8 w-8 fill-current" />
              </span>
            </button>
            <div className="pointer-events-none absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 sm:right-6 sm:bottom-6 sm:left-6">
              <div className="text-white">
                <p className="font-display text-[19px] font-semibold leading-tight">{title}</p>
                <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/75">{subtitle}</p>
              </div>
              {duration && <span className="rounded-full border border-white/40 px-3 py-1 text-[11px] font-semibold text-white/90">{duration}</span>}
            </div>
          </>
        )}
      </div>

      {chapters.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Video chapters">
          {chapters.map((c, i) => (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => {
                  setActive(i);
                  start(c.seconds);
                }}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors',
                  active === i ? 'border-navy bg-navy text-white' : 'border-line text-stone hover:border-navy hover:text-navy',
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
