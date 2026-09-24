import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { intersectAll, setReducedMotion } from '@/test/intersection-observer';
import { Reveal } from './Reveal';

describe('Reveal', () => {
  it('starts hidden and reveals once it intersects', () => {
    render(<Reveal><p>Hello</p></Reveal>);
    const wrapper = screen.getByText('Hello').parentElement!;
    expect(wrapper.className).toContain('opacity-0');
    act(() => intersectAll(true));
    expect(wrapper.className).toContain('opacity-100');
    expect(wrapper).toHaveAttribute('data-revealed');
  });

  it('is visible without waiting for intersection under prefers-reduced-motion', async () => {
    setReducedMotion(true);
    render(<Reveal><p>Hello</p></Reveal>);
    await waitFor(() => expect(screen.getByText('Hello').parentElement!.className).toContain('opacity-100'));
  });

  it('applies a stagger delay', () => {
    render(<Reveal delay={120}><p>Hello</p></Reveal>);
    expect(screen.getByText('Hello').parentElement).toHaveStyle({ transitionDelay: '120ms' });
  });
});
