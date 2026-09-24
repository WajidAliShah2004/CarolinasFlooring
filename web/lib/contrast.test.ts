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

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
});

describe('Concept A palette pairings (spec §7) — re-check whenever tokens change', () => {
  const bone = token('bone');
  const paper = token('paper');
  const ink = token('ink');
  const stone = token('stone');
  const tan = token('tan');
  const tanDeep = token('tan-deep');

  it('body text (ink, stone) on bone and paper is at least 4.5:1', () => {
    for (const bg of [bone, paper]) {
      expect(contrastRatio(ink, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(stone, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('tan-deep (accent text, italic phrase) on bone and paper is at least 4.5:1', () => {
    expect(contrastRatio(tanDeep, bone)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tanDeep, paper)).toBeGreaterThanOrEqual(4.5);
  });
  it('tan (stars, rules — decorative or large only) on paper is at least 3:1', () => {
    expect(contrastRatio(tan, paper)).toBeGreaterThanOrEqual(3);
  });
  it('bone text on ink surfaces is at least 4.5:1', () => {
    expect(contrastRatio(bone, ink)).toBeGreaterThanOrEqual(4.5);
  });
});
