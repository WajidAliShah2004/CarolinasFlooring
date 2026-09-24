import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { yearsOfExperience } from '@/lib/years';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders a text headline with the derived year count', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(`${yearsOfExperience()} years of floors`);
  });

  it('renders both CTAs together, primary first', () => {
    render(<Hero />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveTextContent('Book a Consultation');
    expect(links[0]).toHaveAttribute('href', '/#contact');
    expect(links[0].className).toContain('bg-syracuse');
    expect(links[1]).toHaveTextContent('Watch My Story');
    expect(links[1]).toHaveAttribute('href', '#video');
    expect(links[1].className).toContain('border-white');
  });

  it('shows a data-derived trust strip', () => {
    render(<Hero />);
    expect(screen.getByRole('list', { name: 'Why David' })).toHaveTextContent(`${yearsOfExperience()} years in flooring`);
  });

  it('uses the staircase photo and an orange rule under the band', () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole('img', { name: /staircase/i })).toHaveAttribute('src', '/assets/photos/refinished-stairs-0001.jpg');
    expect(container.querySelector('section')!.className).toContain('border-syracuse');
  });
});
