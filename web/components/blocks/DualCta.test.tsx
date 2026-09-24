import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DualCta } from './DualCta';

const primary = { label: 'Book', href: '/#contact' };
const secondary = { label: 'Story', href: '#video' };

describe('DualCta (docx K2)', () => {
  it('renders an orange-fill primary and a blue-outline secondary', () => {
    render(<DualCta primary={primary} secondary={secondary} />);
    const book = screen.getByRole('link', { name: 'Book' });
    expect(book.className).toContain('bg-orange');
    expect(book.className).toContain('text-white');
    expect(screen.getByRole('link', { name: 'Story' }).className).toContain('border-navy');
  });
  it('uses a white outline secondary on navy surfaces', () => {
    render(<DualCta primary={primary} secondary={secondary} tone="dark" />);
    expect(screen.getByRole('link', { name: 'Story' }).className).toContain('border-white');
  });
  it('can stretch both buttons full width on phones', () => {
    render(<DualCta primary={primary} secondary={secondary} fullWidthMobile />);
    for (const name of ['Book', 'Story']) {
      expect(screen.getByRole('link', { name }).className).toContain('w-full');
    }
  });
});
