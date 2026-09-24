import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { intersectAll, setReducedMotion } from '@/test/intersection-observer';
import { Counter } from './Counter';

describe('Counter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('counts up to the target after it scrolls into view', () => {
    render(<Counter to={19} duration={320} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    act(() => intersectAll(true));
    act(() => { vi.advanceTimersByTime(160); });
    const mid = Number(screen.getByText(/\d+/).textContent);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThanOrEqual(19);
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByText('19')).toBeInTheDocument();
  });

  it('shows the final value immediately under prefers-reduced-motion', () => {
    setReducedMotion(true);
    render(<Counter to={19} />);
    expect(screen.getByText('19')).toBeInTheDocument();
  });
});
