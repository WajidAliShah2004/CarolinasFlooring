import { render, screen } from '@testing-library/react';
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
