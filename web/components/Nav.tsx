'use client';

import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks } from '@/content/copy';
import { telHref } from '@/lib/contact';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';
import { Container } from './layout/Container';

const sectionId = (href: string) => href.split('#')[1] ?? '';

// Concept A mockup header: sticky, blurred bone, serif wordmark, underline-on-hover links, outlined call pill.
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: underline the link whose section is in the middle band of the viewport.
  useEffect(() => {
    const targets = navLinks.map((l) => document.getElementById(sectionId(l.href))).filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bone/90 backdrop-blur-md">
      <Container className={cn('flex items-center gap-3 transition-[height] duration-300 md:gap-8', scrolled ? 'h-16' : 'h-[78px]')}>
        <Link href="/" className="mr-auto min-w-0 leading-[1.1]">
          <span className="block truncate font-display text-[17px] font-semibold tracking-[-0.02em] text-ink sm:text-[21px]">{site.businessName}</span>
          <span className="mt-0.5 hidden text-[9.5px] font-medium uppercase tracking-[0.3em] text-stone sm:block">
            {site.ownerName} · Est. {site.startYear}
          </span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-[30px]">
            {navLinks.map((l) => {
              const isActive = active === sectionId(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative inline-flex h-11 items-center text-[14.5px] text-stone transition-colors hover:text-ink',
                      'after:absolute after:bottom-2.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-tan after:transition-transform after:duration-300 hover:after:scale-x-100',
                      isActive && 'text-ink after:scale-x-100',
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <a
          href={telHref(site.phone)}
          aria-label={`Call ${site.phone}`}
          className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-ink px-3 text-[14.5px] font-medium text-ink transition-colors hover:bg-ink hover:text-bone sm:px-5"
        >
          <Phone aria-hidden className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">{site.phone}</span>
        </a>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-ink md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-bone md:hidden">
          <Container>
            <ul className="py-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-[15px] text-ink" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href={site.bookingUrl} className="block py-3 text-[15px] font-medium text-tan-deep" onClick={() => setOpen(false)}>
                  Book a consultation
                </Link>
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
