import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BeforeAfter } from './BeforeAfter';

const before = { src: '/b.jpg', alt: 'Before shot' };
const after = { src: '/a.jpg', alt: 'After shot' };

describe('BeforeAfter', () => {
  it('starts at 50% and clips the before layer to the slider position', () => {
    render(<BeforeAfter before={before} after={after} caption="Stairs" />);
    const slider = screen.getByRole('slider', { name: 'Before and after comparison: Stairs' });
    expect(slider).toHaveValue('50');
    expect(screen.getByTestId('before-layer')).toHaveStyle({ clipPath: 'inset(0 50% 0 0)' });
    fireEvent.change(slider, { target: { value: '70' } });
    expect(screen.getByTestId('before-layer')).toHaveStyle({ clipPath: 'inset(0 30% 0 0)' });
  });

  it('degrades to a single image when one side is missing', () => {
    render(<BeforeAfter before={null} after={after} caption="Stairs" />);
    expect(screen.queryByRole('slider')).toBeNull();
    expect(screen.getByRole('img', { name: 'After shot' })).toBeInTheDocument();
  });
});
