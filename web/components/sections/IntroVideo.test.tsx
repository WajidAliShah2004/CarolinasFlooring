import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IntroVideo } from './IntroVideo';

describe('IntroVideo', () => {
  it('has a poster, never autoplays, and does not preload', () => {
    const { container } = render(<IntroVideo />);
    const video = container.querySelector('video')!;
    expect(video).toHaveAttribute('poster', '/assets/video-poster.jpg');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('autoplay');
    expect(container.querySelector('section')).toHaveAttribute('id', 'video');
  });

  it('requests no video file while none is configured', () => {
    const { container } = render(<IntroVideo />);
    expect(container.querySelector('video source')).toBeNull();
  });

  it('renders the chapter chips from content', () => {
    render(<IntroVideo />);
    expect(screen.getByRole('button', { name: 'Who I am' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Why my prices are lower' })).toBeInTheDocument();
  });
});
