import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { intersectAll, setReducedMotion } from '@/test/intersection-observer';
import { Carousel } from './Carousel';

const slides = [
  { src: '/a.jpg', alt: 'Shaw hardwood samples' },
  { src: '/b.jpg', alt: 'Shaw carpet samples' },
  { src: '/c.jpg', alt: 'Mohawk carpet samples' },
];

describe('Carousel', () => {
  let scrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { value: scrollTo, configurable: true, writable: true });
  });
  afterEach(() => vi.useRealTimers());

  it('renders every slide with a caption and the controls', () => {
    render(<Carousel slides={slides} label="Sample displays" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Shaw hardwood samples')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pause autoplay' })).toBeInTheDocument();
  });

  it('next and previous scroll the track', () => {
    render(<Carousel slides={slides} label="Sample displays" />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(scrollTo).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(scrollTo).toHaveBeenCalledTimes(2);
  });

  it('autoplays every 4 seconds while visible, and the pause button stops it', () => {
    render(<Carousel slides={slides} label="Sample displays" />);
    act(() => intersectAll(true));
    act(() => { vi.advanceTimersByTime(4000); });
    expect(scrollTo).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Pause autoplay' }));
    expect(screen.getByRole('button', { name: 'Play autoplay' })).toHaveAttribute('aria-pressed', 'true');
    act(() => { vi.advanceTimersByTime(8000); });
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it('does not autoplay while hovered or off-screen', () => {
    render(<Carousel slides={slides} label="Sample displays" />);
    act(() => { vi.advanceTimersByTime(4000); }); // never intersected
    expect(scrollTo).not.toHaveBeenCalled();
    act(() => intersectAll(true));
    fireEvent.mouseEnter(screen.getByRole('region', { name: 'Sample displays' }));
    act(() => { vi.advanceTimersByTime(4000); });
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('never autoplays under prefers-reduced-motion', () => {
    setReducedMotion(true);
    render(<Carousel slides={slides} label="Sample displays" />);
    act(() => intersectAll(true));
    act(() => { vi.advanceTimersByTime(12000); });
    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /autoplay/ })).toBeNull();
  });

  it('dots reflect the active slide', async () => {
    vi.useRealTimers();
    render(<Carousel slides={slides} label="Sample displays" />);
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(dots[2]);
    expect(scrollTo).toHaveBeenCalled();
  });
});
