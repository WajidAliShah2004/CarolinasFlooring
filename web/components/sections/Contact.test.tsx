import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Contact } from './Contact';

describe('Contact', () => {
  it('puts the form first and shows both consultation options', () => {
    const { container } = render(<Contact />);
    const section = container.querySelector('section#contact')!;
    const form = screen.getByRole('form', { name: 'Contact David' });
    expect(section.querySelector('.grid')!.firstElementChild).toContainElement(form);
    expect(screen.getByRole('heading', { name: 'Samples at your home' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Meet by appointment' })).toBeInTheDocument();
  });

  it('publishes no address, hours or map', () => {
    const { container } = render(<Contact />);
    expect(container.textContent).not.toMatch(/showroom|\bhours\b|address:|directions/i);
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('links phone and email', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: '704-614-1200' })).toHaveAttribute('href', 'tel:+17046141200');
    expect(screen.getByRole('link', { name: 'david@carolinasflooring.com' })).toHaveAttribute(
      'href',
      'mailto:david@carolinasflooring.com',
    );
  });
});
