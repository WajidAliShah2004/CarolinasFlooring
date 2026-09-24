'use client';

import Link from 'next/link';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { telHref } from '@/lib/contact';
import { cn } from '@/lib/utils';
import { site } from '@/site.config';

// K19 — phones only. Slides away while the contact section is on screen so it never covers the form.
export function StickyBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById('contact');
    if (!target) return;
    const io = new IntersectionObserver((entries) => setHidden(entries.some((e) => e.isIntersecting)), { threshold: 0.1 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Quick actions"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-navy/90 p-2 backdrop-blur-md transition-transform md:hidden',
        hidden && 'translate-y-full',
      )}
    >
      <a href={telHref(site.phone)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-white/60 text-base font-semibold text-white">
        <Phone aria-hidden className="h-4 w-4" /> Call David
      </a>
      <Link href={site.bookingUrl} className="inline-flex min-h-12 items-center justify-center rounded-full bg-syracuse text-[1.1875rem] font-bold text-white">
        Book
      </Link>
    </nav>
  );
}
