import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from '@/lib/years';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders a serif text headline with the derived year count and the italic phrase', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(`${yearsOfExperience()} years of floors`);
    expect(h1.className).toContain('font-display');
    expect(h1.querySelector('em')).toHaveTextContent('one person');
  });

  it('renders both CTAs together: orange primary, blue-outline secondary (docx §7.2)', () => {
    render(<Hero />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveTextContent('Book a consultation');
    expect(links[0]).toHaveAttribute('href', '/#contact');
    expect(links[0].className).toContain('bg-orange');
    expect(links[1]).toHaveTextContent("Watch David's story");
    expect(links[1]).toHaveAttribute('href', '#video');
    expect(links[1].className).toContain('border-navy');
  });

  it('highlights the headline phrase in orange at large size only', () => {
    render(<Hero />);
    const em = screen.getByRole('heading', { level: 1 }).querySelector('em')!;
    expect(em.className).toContain('text-orange');
    expect(em.className).not.toContain('text-orange-text');
  });

  it('shows a data-derived trust strip', () => {
    render(<Hero />);
    expect(screen.getByRole('list', { name: 'Why David' })).toHaveTextContent(`${yearsOfExperience()} years in flooring`);
  });

  it('carries the parquet panel with its tag', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('.rotate-45')).not.toBeNull();
    expect(screen.getByText('Herringbone · hardwood')).toBeInTheDocument();
  });
});
