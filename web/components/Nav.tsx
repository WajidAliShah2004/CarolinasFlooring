'use client';

import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks } from '@/content/copy';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';

const sectionId = (href: string) => href.split('#')[1] ?? '';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');

  // White at the top of the page; frosted navy once scrolled past the first 80px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
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

  const linkClass = (isActive: boolean) =>
    cn(
      'group relative inline-flex h-11 items-center text-[15px] font-medium transition-colors',
      scrolled ? 'text-white/85 hover:text-white' : 'text-foreground hover:text-navy',
      // Orange underline slides in from the left; stays for the active section.
      'after:absolute after:bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-syracuse after:transition-transform after:duration-300',
      'hover:after:scale-x-100',
      isActive && 'after:scale-x-100',
    );

  const ctaClass =
    'group inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-b from-[#FF7A14] to-syracuse px-5 text-[1.1875rem] font-bold text-white shadow-[0_10px_24px_-10px_rgba(247,105,0,0.75)] transition-all hover:-translate-y-0.5 hover:to-syracuse-ink hover:shadow-[0_14px_28px_-10px_rgba(247,105,0,0.8)]';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300',
        scrolled ? 'border-navy bg-navy/85' : 'border-border bg-white/70',
      )}
    >
      {/* Full-width bar: brand hard left, menu + CTA hard right, regardless of the content column. */}
      <div className="flex h-14 items-center gap-6 px-4 sm:px-6 md:h-18 lg:px-10">
        {/* One line on md+ so the name shares a baseline with the nav links; stacked only on phones. */}
        <Link href="/" className="mr-auto flex flex-col leading-tight md:flex-row md:items-baseline md:gap-3">
          <span className={cn('text-lg font-bold', scrolled ? 'text-white' : 'text-navy')}>{site.businessName}</span>
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
          <ul className="flex items-center gap-7">
            {navLinks.map((l) => {
              const isActive = active === sectionId(l.href);
              return (
                <li key={l.href}>
                  <Link href={l.href} aria-current={isActive ? 'true' : undefined} className={linkClass(isActive)}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link href={site.bookingUrl} className={cn(ctaClass, 'md:ml-2')}>
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">Book a Consultation</span>
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/15 bg-navy md:hidden">
          <div className="px-4 sm:px-6">
            <ul className="py-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-lg font-medium text-white" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
