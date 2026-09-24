// Docx §7.2 / K2: primary = Syracuse Orange fill with white text (19px bold clears large-text contrast, §5.4);
// secondary = blue outline so it visibly defers. Concept A pill shape.
export const ctaPrimary =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-orange px-7 text-[1.1875rem] font-bold text-white transition-colors hover:bg-orange-text disabled:opacity-60';

export const ctaSecondary =
  'inline-flex min-h-12 items-center justify-center rounded-full border-2 border-navy bg-white px-7 text-[15px] font-medium text-navy transition-colors hover:bg-navy hover:text-white';

// Same pair for navy surfaces.
export const ctaSecondaryDark =
  'inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white/70 px-7 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-navy';
