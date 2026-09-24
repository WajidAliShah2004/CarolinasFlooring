import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from '@/lib/years';
import { About } from './About';
import { Brands } from './Brands';
import { SeeItFirst } from './SeeItFirst';
import { TwoWays } from './TwoWays';

describe('TwoWays (docx §7.4: two parallel paths)', () => {
  it('shows exactly two equal paths, each with its own CTA', () => {
    const { container } = render(<TwoWays />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'services');
    const paths = screen.getAllByRole('list')[0];
    expect(within(paths).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Just the product' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Product + installation' })).toBeInTheDocument();
    expect(within(paths).getAllByRole('link')).toHaveLength(2);
    expect(within(paths).getAllByRole('link').filter((a) => a.className.includes('bg-orange'))).toHaveLength(1);
  });

  it('lists the four floor types with brands as text only', () => {
    render(<TwoWays />);
    const floors = screen.getByRole('list', { name: 'Floor types' });
    expect(within(floors).getAllByRole('listitem')).toHaveLength(4);
    expect(within(floors).queryAllByRole('link')).toHaveLength(0);
  });
});

describe('SeeItFirst', () => {
  it('shows the sample shelf and a single primary CTA', () => {
    const { container } = render(<SeeItFirst />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'see-it');
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(9);
    expect(screen.getByRole('link', { name: 'Book a consultation' }).className).toContain('bg-orange');
  });
});

describe('Brands (docx §7.7)', () => {
  it('links every brand inward and reflows at any count', () => {
    render(<Brands />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(7);
    for (const link of links) expect(link.getAttribute('href')).toMatch(/^\/brands\/[a-z0-9-]+$/);
    render(<Brands items={[{ name: 'Solo', slug: 'solo' }]} />);
    expect(screen.getByRole('link', { name: 'Solo' })).toBeInTheDocument();
  });
});

describe('About', () => {
  it('shows the derived years and a 4:5 portrait slot', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'about');
    expect(screen.getByText(`${yearsOfExperience()}+`)).toBeInTheDocument();
    expect(container.querySelector('[class*="md:aspect-[4/5]"]')).not.toBeNull();
  });
});
