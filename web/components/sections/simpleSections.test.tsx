import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from '@/lib/years';
import { About } from './About';
import { SeeItFirst } from './SeeItFirst';
import { TwoWays } from './TwoWays';

describe('TwoWays', () => {
  it('shows exactly two parallel paths', () => {
    const { container } = render(<TwoWays />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'services');
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Just the product' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Product + installation' })).toBeInTheDocument();
  });
});

describe('SeeItFirst', () => {
  it('is a full feature block with the sample shelf and a single primary CTA', () => {
    const { container } = render(<SeeItFirst />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'see-it');
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(9);
    const cta = screen.getByRole('link', { name: 'Book a Consultation' });
    expect(cta.className).toContain('bg-syracuse');
  });
});

describe('About', () => {
  it('shows the derived years and a 4:5 portrait slot', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'about');
    expect(screen.getByText(String(yearsOfExperience()))).toBeInTheDocument();
    expect(container.querySelector('[class*="md:aspect-[4/5]"]')).not.toBeNull();
    expect(container.querySelector('section')!.className).toContain('bg-navy');
  });
});
