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

describe('palette pairings (spec 2026-09-24 §1) — re-check whenever C1 blue changes', () => {
  const navy = token('brand-navy');
  const navyDeep = token('brand-navy-deep');
  const orange = token('brand-orange');
  const orangeText = token('brand-orange-text');

  it('orange large text / UI on navy is at least 3:1', () => {
    expect(contrastRatio(orange, navyDeep)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(orange, navy)).toBeGreaterThanOrEqual(3);
  });
  it('white text on navy is at least 4.5:1', () => {
    expect(contrastRatio(WHITE, navyDeep)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(WHITE, navy)).toBeGreaterThanOrEqual(4.5);
  });
  it('text-safe orange on white is at least 4.5:1', () => {
    expect(contrastRatio(orangeText, WHITE)).toBeGreaterThanOrEqual(4.5);
  });
  it('white button text on orange is at least 3:1 (large text)', () => {
    expect(contrastRatio(WHITE, orange)).toBeGreaterThanOrEqual(3);
  });
});
