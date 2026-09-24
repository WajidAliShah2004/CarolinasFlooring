import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading (mockup .shead)', () => {
  it('renders a serif h2 with an optional side note', () => {
    render(<SectionHeading id="t" title="Floors, two ways" lede="Short note" />);
    const h2 = screen.getByRole('heading', { level: 2, name: 'Floors, two ways' });
    expect(h2.className).toContain('font-display');
    expect(screen.getByText('Short note')).toBeInTheDocument();
  });

  it('renders no numbered label (the mockup has none)', () => {
    render(<SectionHeading id="t" number="02" label="Services" title="Plain" />);
    expect(screen.queryByText(/02/)).toBeNull();
  });
});
