import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Nav } from './Nav';

describe('Nav', () => {
  it('always shows the booking CTA', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /book/i })).toHaveAttribute('href', '/#contact');
  });

  it('has no showroom link', () => {
    render(<Nav />);
    expect(screen.queryByRole('link', { name: /showroom/i })).toBeNull();
  });

  it('turns navy after scrolling past 80px', () => {
    render(<Nav />);
    const header = screen.getByRole('banner');
    expect(header.className).toContain('bg-white');
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
    fireEvent.scroll(window);
    expect(header.className).toContain('bg-navy');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('toggles the mobile menu', async () => {
    render(<Nav />);
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
  });
});
