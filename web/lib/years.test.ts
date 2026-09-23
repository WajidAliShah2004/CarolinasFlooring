import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from './years';

describe('yearsOfExperience', () => {
  it('is 19 during 2026 (flooring since 2007)', () => {
    expect(yearsOfExperience(new Date(2026, 8, 23))).toBe(19);
    expect(yearsOfExperience(new Date(2026, 0, 1))).toBe(19);
  });
  it('increments on 1 January', () => {
    expect(yearsOfExperience(new Date(2027, 0, 1))).toBe(20);
  });
  it('accepts an explicit start year', () => {
    expect(yearsOfExperience(new Date(2026, 5, 1), 2010)).toBe(16);
  });
});
