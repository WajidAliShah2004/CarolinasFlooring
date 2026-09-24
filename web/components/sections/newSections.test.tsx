import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StickyBar } from '@/components/StickyBar';
import { ReviewCard } from '@/components/blocks/ReviewCard';
import { yearsOfExperience } from '@/lib/years';
import { intersectAll, setReducedMotion } from '@/test/intersection-observer';
import { Faq } from './Faq';
import { Stats } from './Stats';
import { Timeline } from './Timeline';

describe('Timeline', () => {
  it('shows three numbered steps', () => {
    const { container } = render(<Timeline />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'process');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Measure & consult')).toBeInTheDocument();
  });
});

describe('Stats', () => {
  it('shows the derived years and three data-backed tiles', async () => {
    setReducedMotion(true);
    const { container } = render(<Stats />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'stats');
    await waitFor(() => expect(screen.getByText(String(yearsOfExperience()))).toBeInTheDocument());
    expect(screen.getByText('Owner on every job')).toBeInTheDocument();
    expect(screen.getByText('Samples to your home')).toBeInTheDocument();
    expect(screen.getByText('1-year workmanship warranty')).toBeInTheDocument();
  });
});

describe('Faq', () => {
  it('renders questions as native accordions that toggle', async () => {
    const { container } = render(<Faq />);
    expect(container.querySelector('section')).toHaveAttribute('id', 'faq');
    const items = container.querySelectorAll('details');
    expect(items.length).toBeGreaterThanOrEqual(4);
    expect(items[0]).not.toHaveAttribute('open');
    await userEvent.click(screen.getByText('Can I buy just the flooring?'));
    const opened = [...items].find((d) => d.textContent?.includes('Can I buy just the flooring?'))!;
    expect(opened).toHaveAttribute('open');
  });

  it('never mentions an address, hours or a showroom location', () => {
    const { container } = render(<Faq />);
    expect(container.textContent).not.toMatch(/showroom address|\bhours\b|directions/i);
  });
});

describe('StickyBar', () => {
  it('shows call and book links, and hides while the contact section is in view', () => {
    render(
      <>
        <section id="contact" />
        <StickyBar />
      </>,
    );
    const bar = screen.getByRole('navigation', { name: 'Quick actions' });
    expect(screen.getByRole('link', { name: /call/i })).toHaveAttribute('href', 'tel:+17046141200');
    expect(screen.getByRole('link', { name: /book/i })).toHaveAttribute('href', '/#contact');
    expect(bar.className).not.toContain('translate-y-full');
    act(() => intersectAll(true));
    expect(bar.className).toContain('translate-y-full');
    act(() => intersectAll(false));
    expect(bar.className).not.toContain('translate-y-full');
  });
});

describe('ReviewCard (modernized)', () => {
  it('shows five stars, an initials avatar and a platform pill', () => {
    const { container } = render(<ReviewCard review={{ id: 'x', quote: 'Great job.', author: 'Holly Smith', platform: 'yelp' }} />);
    expect(container.querySelectorAll('[data-star]')).toHaveLength(5);
    expect(screen.getByText('HS')).toBeInTheDocument();
    expect(screen.getByText('Yelp')).toBeInTheDocument();
    expect(screen.getByText('Holly Smith')).toBeInTheDocument();
  });
});
