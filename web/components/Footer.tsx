import Image from 'next/image';
import { mailtoHref, telHref } from '@/lib/contact';
import { site } from '@/site.config';
import { SocialRow } from './blocks/SocialRow';
import { Container } from './layout/Container';

// Concept A footer structure in the docx palette: navy band (§5.2 "footer"), existing logo, contact right. No address (K18).
export function Footer() {
  return (
    <footer className="bg-navy py-12 text-[14px] text-white/75 md:py-16">
      <Container className="grid items-center gap-9 md:grid-cols-[auto_1fr_auto]">
        <Image src="/assets/logo.jpg" alt={`${site.businessName} logo`} width={132} height={92} className="rounded-[3px] bg-white p-2" />
        <div>
          <p className="font-display text-[19px] font-semibold text-white">{site.businessName}</p>
          <p className="mt-1.5">Great selection · Fair prices · Outstanding service</p>
          <div className="mt-4"><SocialRow links={site.social} tone="dark" /></div>
        </div>
        <div className="md:text-right">
          <a href={telHref(site.phone)} className="hover:text-white">{site.phone}</a>
          <br />
          <a href={mailtoHref(site.email)} className="hover:text-white">{site.email}</a>
          <br />
          <span className="opacity-70">© {new Date().getFullYear()} {site.legalName}</span>
        </div>
      </Container>
    </footer>
  );
}
