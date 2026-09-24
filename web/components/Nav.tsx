'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks } from '@/content/copy';
import { ctaPrimary } from '@/lib/cta';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';
import { Container } from './layout/Container';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // White at the top of the page; solid navy once scrolled past the first 80px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300',
        scrolled ? 'border-navy bg-navy/85' : 'border-border bg-white/70',
      )}
    >
      <Container className="flex h-14 items-center gap-4 md:h-18">
        <Link href="/" className="mr-auto leading-tight">
          <span className={cn('block text-lg font-bold', scrolled ? 'text-white' : 'text-navy')}>{site.businessName}</span>
          <span
            className={cn(
              'hidden text-xs font-medium uppercase tracking-[0.2em] sm:block',
              scrolled ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            {site.ownerName} · Since {site.startYear}
          </span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'text-[0.95rem] font-medium',
                    scrolled ? 'text-white/85 hover:text-white' : 'text-foreground hover:text-navy',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={site.bookingUrl} className={cn(ctaPrimary, 'min-h-10 px-4 sm:px-5')}>
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book a Consultation</span>
        </Link>
        <button
          type="button"
          className={cn('inline-flex h-11 w-11 items-center justify-center md:hidden', scrolled ? 'text-white' : 'text-navy')}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/15 bg-navy md:hidden">
          <Container>
            <ul className="py-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-lg font-medium text-white" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
