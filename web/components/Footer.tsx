import Image from 'next/image';
import { mailtoHref, telHref } from '@/lib/contact';
import { site } from '@/site.config';
import { SocialRow } from './blocks/SocialRow';
import { Container } from './layout/Container';

// Concept A mockup footer: ink band, existing logo, tagline, contact on the right. No address (spec K18).
export function Footer() {
  return (
    <footer className="bg-ink py-12 text-[14px] text-[#B9B0A5] md:py-16">
      <Container className="grid items-center gap-9 md:grid-cols-[auto_1fr_auto]">
        <Image src="/assets/logo.jpg" alt={`${site.businessName} logo`} width={132} height={92} className="rounded-[3px] bg-white p-2" />
        <div>
          <p className="font-display text-[19px] font-semibold text-bone">{site.businessName}</p>
          <p className="mt-1.5">Great selection · Fair prices · Outstanding service</p>
          <div className="mt-4"><SocialRow links={site.social} tone="dark" /></div>
        </div>
        <div className="md:text-right">
          <a href={telHref(site.phone)} className="hover:text-bone">{site.phone}</a>
          <br />
          <a href={mailtoHref(site.email)} className="hover:text-bone">{site.email}</a>
          <br />
          <span className="opacity-60">© {new Date().getFullYear()} {site.legalName}</span>
        </div>
      </Container>
    </footer>
  );
}
