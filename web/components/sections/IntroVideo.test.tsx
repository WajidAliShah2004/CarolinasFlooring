import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IntroVideo } from './IntroVideo';

describe('IntroVideo', () => {
  it('has a poster, never autoplays, and does not preload', () => {
    const { container } = render(<IntroVideo />);
    const video = container.querySelector('video')!;
    expect(video).toHaveAttribute('poster', '/assets/video-poster.jpg');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('controls');
    expect(container.querySelector('section')).toHaveAttribute('id', 'video');
  });
});
