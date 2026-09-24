import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { platformLabels } from '@/lib/platforms';
import { brands } from './brands';
import { about, hero, introVideo, seeItFirst } from './copy';
import { galleryItems } from './gallery';
import { reviews } from './reviews';
import type { GalleryItem } from './types';

const publicFile = (src: string) => path.join(process.cwd(), 'public', src);

function gallerySrcs(item: GalleryItem): string[] {
  if (item.type === 'photo') return [item.image.src];
  if (item.type === 'video') return [item.poster];
  return [item.before?.src, item.after?.src].filter((s): s is string => Boolean(s));
}

describe('content integrity', () => {
  it('brand slugs are unique and URL-safe', () => {
    const slugs = brands.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('gallery ids are unique and there is at least one before/after pair', () => {
    const ids = galleryItems.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(galleryItems.some((g) => g.type === 'pair')).toBe(true);
  });

  it('every referenced image exists in public/', () => {
    const srcs = [
      hero.image.src,
      introVideo.poster,
      about.portrait.src,
      ...seeItFirst.shelf.map((s) => s.src),
      ...galleryItems.flatMap(gallerySrcs),
    ];
    for (const src of srcs) {
      expect(src.startsWith('/assets/'), src).toBe(true);
      expect(fs.existsSync(publicFile(src)), src).toBe(true);
    }
  });

  it('every review names a known platform', () => {
    for (const r of reviews) expect(platformLabels[r.platform]).toBeTruthy();
  });

  it('copy never mentions a showroom, hours or an address', () => {
    const all = JSON.stringify({ hero, introVideo, seeItFirst, about });
    expect(all).not.toMatch(/showroom|\bhours\b|directions/i);
  });
});
