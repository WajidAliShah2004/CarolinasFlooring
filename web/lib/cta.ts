// Concept A mockup buttons: solid ink pill and a paper ghost pill (spec §7).
export const ctaPrimary =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-7 text-[15px] font-medium text-bone transition-colors hover:bg-tan-deep disabled:opacity-60';

export const ctaSecondary =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-paper px-7 text-[15px] font-medium text-ink transition-colors hover:border-ink';

// Same pair for dark surfaces (video frame captions etc.).
export const ctaSecondaryDark =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-bone/60 px-7 text-[15px] font-medium text-bone transition-colors hover:bg-bone hover:text-ink';
