import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialRow } from './SocialRow';

describe('SocialRow', () => {
  it('renders nothing when no profile URLs are set', () => {
    const { container } = render(<SocialRow links={{ google: '', facebook: '', yelp: '', apple: '' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders only configured profiles, opening in a new tab', () => {
    render(<SocialRow links={{ google: 'https://g.page/example', yelp: 'https://www.yelp.com/biz/example', facebook: '' }} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAccessibleName('Google (opens in a new tab)');
    expect(links[0]).toHaveAttribute('href', 'https://g.page/example');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
    expect(links[1]).toHaveAccessibleName('Yelp (opens in a new tab)');
  });
});
