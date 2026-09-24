import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

const css = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
const token = (name: string) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1];
};
const WHITE = '#FFFFFF';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', WHITE)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, WHITE)).toBeCloseTo(1, 5);
  });
});

describe('docx palette pairings (Design spec §5.4) — re-check whenever the C1 blue changes', () => {
  const navy = token('brand-navy');
  const navyDeep = token('brand-navy-deep');
  const orange = token('brand-orange');
  const orangeText = token('brand-orange-text');
  const ink = token('ink');
  const stone = token('stone');
  const surface = token('surface');

  it('body copy on white and the pale surface is at least 4.5:1', () => {
    for (const bg of [WHITE, surface]) {
      expect(contrastRatio(ink, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(stone, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(navy, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('text-safe orange on white is at least 4.5:1', () => {
    expect(contrastRatio(orangeText, WHITE)).toBeGreaterThanOrEqual(4.5);
  });
  it('bright orange is used only at large size / as UI: at least 3:1 on white and on navy', () => {
    expect(contrastRatio(orange, WHITE)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(orange, navy)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(orange, navyDeep)).toBeGreaterThanOrEqual(3);
  });
  it('white text on orange buttons (large text) and on navy is readable', () => {
    expect(contrastRatio(WHITE, orange)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(WHITE, navy)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(WHITE, navyDeep)).toBeGreaterThanOrEqual(4.5);
  });
});
