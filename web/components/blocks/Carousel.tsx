'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Img } from '@/content/types';
import { cn } from '@/lib/utils';

const REDUCED = '(prefers-reduced-motion: reduce)';
const INTERVAL_MS = 4000;

type Props<T> = {
  slides: T[];
  label: string;
  className?: string;
  /** Renders one slide's content. Default: an `Img` card with a gradient caption. */
  render?: (slide: T, index: number) => React.ReactNode;
  keyOf?: (slide: T, index: number) => string;
  /** Width/aspect classes for each slide `<li>`. */
  slideClassName?: string;
};

const DEFAULT_SLIDE = 'aspect-[3/4] w-[72%] sm:w-[46%] md:w-[31%] lg:w-[23.5%] overflow-hidden rounded-xl bg-muted shadow-soft';

function renderImg(slide: Img) {
  return (
    <>
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 75vw"
        className="object-cover transition-transform duration-700 group-hover/slide:scale-105"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep/85 to-transparent" />
      <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-white">{slide.alt}</p>
    </>
  );
}

/**
 * Carousel — scroll-snap track with arrows, dots and safeguarded autoplay.
 * Autoplay pauses on hover / focus / touch / off-screen / the Pause button and never runs under reduced motion.
 * (Client-approved override of the base spec's "no self-moving carousels" — see modernization spec §6.)
 */
export function Carousel<T = Img>({
  slides,
  label,
  className,
  render = renderImg as unknown as (slide: T, index: number) => React.ReactNode,
  keyOf = (s, i) => ((s as { src?: string; id?: string }).id ?? (s as { src?: string }).src ?? String(i)),
  slideClassName = DEFAULT_SLIDE,
}: Props<T>) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);

  const slideStep = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 16;
    return first.offsetWidth + gap;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = ((i % slides.length) + slides.length) % slides.length;
      setIndex(next);
      track.scrollTo?.({ left: next * slideStep(), behavior: 'smooth' });
    },
    [slides.length, slideStep],
  );

  useEffect(() => {
    // Deferred so the effect schedules work rather than setting state synchronously.
    const t = setTimeout(() => setReduced(window.matchMedia(REDUCED).matches), 0);
    return () => clearTimeout(t);
  }, []);

  // Only autoplay while on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver((entries) => setVisible(entries.some((e) => e.isIntersecting)), { threshold: 0.3 });
    io.observe(track);
    return () => io.disconnect();
  }, []);

  const autoplay = !reduced && visible && !hovered && !paused;
  useEffect(() => {
    // Re-check the media query here so autoplay can never start before the deferred state lands.
    if (!autoplay || window.matchMedia(REDUCED).matches) return;
    const t = setInterval(() => goTo(index + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [autoplay, goTo, index]);

  // Keep the dots in sync with manual scrolling / swiping.
  function onScroll() {
    const track = trackRef.current;
    const step = slideStep();
    if (!track || !step) return;
    setIndex(Math.round(track.scrollLeft / step));
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('group/carousel relative', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
    >
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <li
            key={keyOf(s, i)}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn('group/slide relative shrink-0 snap-start', slideClassName)}
          >
            {render(s, i)}
          </li>
        ))}
      </ul>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous"
        className="absolute top-[42%] left-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft backdrop-blur transition hover:bg-white md:flex"
      >
        <ChevronLeft aria-hidden className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next"
        className="absolute top-[42%] right-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft backdrop-blur transition hover:bg-white md:flex"
      >
        <ChevronRight aria-hidden className="h-6 w-6" />
      </button>

      {/* Dots + pause */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <div role="tablist" aria-label="Slides" className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={keyOf(s, i)}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === index ? 'w-7 bg-syracuse' : 'w-2 bg-navy/25 hover:bg-navy/50',
              )}
            />
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play autoplay' : 'Pause autoplay'}
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/20 text-navy transition hover:bg-white"
          >
            {paused ? <Play aria-hidden className="ml-0.5 h-4 w-4" /> : <Pause aria-hidden className="h-4 w-4" />}
          </button>
        )}
      </div>
    </section>
  );
}
