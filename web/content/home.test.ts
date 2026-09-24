import { describe, expect, it } from 'vitest';
import { homeSections } from './home';

describe('homeSections', () => {
  it('keeps the Concept A mockup order (spec §7)', () => {
    expect(homeSections.map((s) => s.id)).toEqual([
      'hero',
      'video',
      'two-ways',
      'gallery',
      'see-it',
      'about',
      'reviews',
      'contact',
    ]);
  });

  it('places the intro video directly after the hero', () => {
    const ids = homeSections.map((s) => s.id);
    expect(ids.indexOf('video')).toBe(ids.indexOf('hero') + 1);
  });

  it('contains no deleted sections', () => {
    const ids = homeSections.map((s) => s.id).join(' ');
    expect(ids).not.toMatch(/region|standards|showroom|hours/);
  });
});
