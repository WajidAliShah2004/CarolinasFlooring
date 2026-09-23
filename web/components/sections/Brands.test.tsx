import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Brands } from './Brands';

describe('Brands', () => {
  it('links every brand inward to /brands/[slug]', () => {
    render(<Brands />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(7);
    for (const link of links) expect(link.getAttribute('href')).toMatch(/^\/brands\/[a-z0-9-]+$/);
  });

  it('reflows for any brand count', () => {
    render(<Brands items={[{ name: 'Solo', slug: 'solo' }]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
