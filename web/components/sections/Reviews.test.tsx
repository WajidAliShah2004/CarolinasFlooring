import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reviews } from './Reviews';

describe('Reviews', () => {
  it('renders static cards with platform attribution', () => {
    const { container } = render(
      <Reviews items={[{ id: 'x', quote: 'Great job.', author: 'Holly', platform: 'yelp' }]} />,
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'reviews');
    expect(screen.getByText('Great job.')).toBeInTheDocument();
    expect(screen.getByText('Holly · Yelp')).toBeInTheDocument();
    expect(screen.getByText('Five stars, three platforms')).toBeInTheDocument();
  });

  it('never auto-rotates (no timers or carousel roles)', () => {
    render(<Reviews />);
    expect(screen.queryByRole('region', { name: /carousel/i })).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
