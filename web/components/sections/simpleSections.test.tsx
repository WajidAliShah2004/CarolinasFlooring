import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from '@/lib/years';
import { About } from './About';
import { SeeItFirst } from './SeeItFirst';
import { TwoWays } from './TwoWays';

describe('TwoWays (mockup "Four floors, sold two ways")', () => {
  it('shows four numbered editorial rows', () => {
    const { container } = render(<TwoWays />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'services');
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
    for (const name of ['Carpet', 'Hardwood', 'Luxury vinyl plank', 'Tile']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    }
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('names brands as text only, never as outbound links', () => {
    render(<TwoWays />);
    expect(screen.getByText('Shaw · Mohawk · DreamWeaver')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});

describe('SeeItFirst', () => {
  it('shows the sample shelf, the on-display brand list and a single primary CTA', () => {
    const { container } = render(<SeeItFirst />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'see-it');
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(9);
    const brandLinks = screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.startsWith('/brands/'));
    expect(brandLinks.length).toBeGreaterThanOrEqual(7);
    expect(screen.getByRole('link', { name: 'Book a consultation' }).className).toContain('bg-ink');
  });
});

describe('About', () => {
  it('shows the derived years and a 4:5 portrait slot on a paper band', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'about');
    expect(screen.getByText(`${yearsOfExperience()}+`)).toBeInTheDocument();
    expect(container.querySelector('[class*="md:aspect-[4/5]"]')).not.toBeNull();
    expect(container.querySelector('section')!.className).toContain('bg-paper');
  });
});
