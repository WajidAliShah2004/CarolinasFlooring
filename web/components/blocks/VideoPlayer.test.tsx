import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VideoPlayer } from './VideoPlayer';

const props = {
  src: '/assets/david-intro.mp4',
  poster: '/assets/video-poster.jpg',
  title: 'David A. Gwilt',
  subtitle: 'Owner · in flooring since 2007',
  duration: '~2 min',
  chapters: [
    { label: 'Who I am', seconds: 0 },
    { label: 'How I work', seconds: 40 },
  ],
};

describe('VideoPlayer', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
  });

  it('shows the poster overlay and never autoplays', () => {
    const { container } = render(<VideoPlayer {...props} />);
    const video = container.querySelector('video')!;
    expect(video).toHaveAttribute('poster', '/assets/video-poster.jpg');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('autoplay');
    expect(screen.getByText('David A. Gwilt')).toBeInTheDocument();
    expect(screen.getByText('~2 min')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play video: David A. Gwilt' })).toBeInTheDocument();
  });

  it('starts playback and hides the overlay on play', async () => {
    const { container } = render(<VideoPlayer {...props} />);
    await userEvent.click(screen.getByRole('button', { name: 'Play video: David A. Gwilt' }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(container.querySelector('video')).toHaveAttribute('controls');
    expect(screen.queryByRole('button', { name: 'Play video: David A. Gwilt' })).toBeNull();
  });

  it('chapter chips seek and play', async () => {
    const { container } = render(<VideoPlayer {...props} />);
    await userEvent.click(screen.getByRole('button', { name: 'How I work' }));
    expect(container.querySelector('video')!.currentTime).toBe(40);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });
});
