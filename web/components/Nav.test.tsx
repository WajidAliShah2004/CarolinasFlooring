import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { intersectAll } from '@/test/intersection-observer';
import { Nav } from './Nav';

describe('Nav (Concept A header, docx palette)', () => {
  it('always shows the booking CTA in orange, and the phone number', () => {
    render(<Nav />);
    const book = screen.getByRole('link', { name: /book a consultation/i });
    expect(book).toHaveAttribute('href', '/#contact');
    expect(book.className).toContain('bg-orange');
    expect(screen.getAllByRole('link', { name: 'Call 704-614-1200' })[0]).toHaveAttribute('href', 'tel:+17046141200');
  });

  it('is a navy bar', () => {
    render(<Nav />);
    expect(screen.getByRole('banner').className).toContain('bg-navy');
  });

  it('has no showroom link', () => {
    render(<Nav />);
    expect(screen.queryByRole('link', { name: /showroom/i })).toBeNull();
  });

  it('shrinks after scrolling past 40px', () => {
    const { container } = render(<Nav />);
    const bar = container.querySelector('header > div')!;
    expect(bar.className).toContain('h-[78px]');
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
    fireEvent.scroll(window);
    expect(bar.className).toContain('h-16');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('marks the link for the section currently in view', () => {
    render(
      <>
        <section id="gallery" />
        <Nav />
      </>,
    );
    expect(screen.queryByRole('link', { current: true })).toBeNull();
    act(() => intersectAll(true));
    expect(screen.getByRole('link', { current: true })).toHaveTextContent('Work');
  });

  it('toggles the mobile menu', async () => {
    render(<Nav />);
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
  });
});
