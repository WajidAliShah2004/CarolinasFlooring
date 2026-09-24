import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('renders a numbered label above the title', () => {
    render(<SectionHeading id="t" number="02" label="Services" title="Floors, two ways" />);
    expect(screen.getByText('02 · Services')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Floors, two ways' })).toBeInTheDocument();
  });

  it('omits the label row when no number is given', () => {
    render(<SectionHeading id="t" title="Plain" />);
    expect(screen.queryByText(/·/)).toBeNull();
  });
});
