'use client';

import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks } from '@/content/copy';
import { telHref } from '@/lib/contact';
import { ctaPrimary } from '@/lib/utils-cta';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';
import { Container } from './layout/Container';

const sectionId = (href: string) => href.split('#')[1] ?? '';

// Concept A header structure (sticky, serif wordmark, underline links) in the docx palette:
// navy bar (§5.2 "navigation bar"), persistent orange booking CTA (K17 / S14), phone as a plain link.
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <Container className={cn('flex items-center gap-3 transition-[height] duration-300 md:gap-7', scrolled ? 'h-16' : 'h-[78px]')}>
        <Link href="/" className="mr-auto min-w-0 leading-[1.1]">
          <span className="block truncate font-display text-[17px] font-semibold tracking-[-0.02em] sm:text-[21px]">{site.businessName}</span>
          <span className="mt-0.5 hidden text-[9.5px] font-medium uppercase tracking-[0.3em] text-white/65 sm:block">
            {site.ownerName} · Est. {site.startYear}
          </span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-[26px]">
            {navLinks.map((l) => {
              const isActive = active === sectionId(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative inline-flex h-11 items-center text-[14.5px] text-white/80 transition-colors hover:text-white',
                      // Orange underline slides in from the left; stays for the active section (§5.3 active states).
                      'after:absolute after:bottom-2.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-orange after:transition-transform after:duration-300 hover:after:scale-x-100',
                      isActive && 'text-white after:scale-x-100',
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
          className="hidden h-11 shrink-0 items-center gap-2 whitespace-nowrap text-[14.5px] font-medium text-white/85 hover:text-white lg:inline-flex"
        >
          <Phone aria-hidden className="h-4 w-4" />
          {site.phone}
        </a>
        <Link href={site.bookingUrl} className={cn(ctaPrimary, 'h-11 min-h-0 shrink-0 px-4 sm:px-5')}>
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book a Consultation</span>
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-white md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/10 bg-navy md:hidden">
          <Container>
            <ul className="py-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-[15px] text-white" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a href={telHref(site.phone)} aria-label={`Call ${site.phone}`} className="flex items-center gap-2 py-3 text-[15px] font-medium text-white">
                  <Phone aria-hidden className="h-4 w-4" /> {site.phone}
                </a>
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
