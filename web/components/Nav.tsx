'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navLinks } from '@/content/copy';
import { ctaPrimary } from '@/lib/cta';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';
import { Container } from './layout/Container';

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-4 md:h-18">
        <Link href="/" className="mr-auto leading-tight">
          <span className="block text-lg font-bold text-navy">{site.businessName}</span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:block">
            {site.ownerName} · Since {site.startYear}
          </span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[0.95rem] font-medium text-foreground hover:text-navy">
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
          className="inline-flex h-11 w-11 items-center justify-center text-navy md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </Container>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border md:hidden">
          <Container>
            <ul className="py-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-lg font-medium text-navy" onClick={() => setOpen(false)}>
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
