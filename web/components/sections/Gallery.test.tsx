import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { GalleryItem } from '@/content/types';
import { Gallery } from './Gallery';

const items: GalleryItem[] = [
  { type: 'photo', id: 'p', image: { src: '/p.jpg', alt: 'A photo' }, caption: 'Photo caption' },
  { type: 'video', id: 'v', src: '/v.mp4', poster: '/v.jpg', alt: 'Crew installing', caption: 'Video caption' },
  { type: 'pair', id: 'pr', before: { src: '/b.jpg', alt: 'Before' }, after: { src: '/a.jpg', alt: 'After' }, caption: 'Pair caption' },
];

describe('Gallery', () => {
  it('renders photo, video and pair items in one grid with captions', () => {
    const { container } = render(<Gallery items={items} />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'gallery');
    expect(screen.getAllByRole('figure')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'A photo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play video: Crew installing' })).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText('Pair caption')).toBeInTheDocument();
  });

  it('gives the first tile a double-width bento slot on desktop', () => {
    const { container } = render(<Gallery items={items} />);
    const tiles = container.querySelectorAll('ul > li');
    expect(tiles[0].className).toContain('md:col-span-2');
    expect(tiles[1].className).not.toContain('md:col-span-2');
  });

  it('loads the video only after the play button is clicked', async () => {
    const { container } = render(<Gallery items={items} />);
    expect(container.querySelector('video')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Play video: Crew installing' }));
    expect(container.querySelector('video')).toHaveAttribute('src', '/v.mp4');
  });
});
