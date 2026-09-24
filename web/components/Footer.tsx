import { mailtoHref, telHref } from '@/lib/contact';
import { site } from '@/site.config';
import { SocialRow } from './blocks/SocialRow';
import { Container } from './layout/Container';

// No address, no manufacturer links (spec K18).
export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xl font-bold">{site.businessName}</p>
          <p className="mt-2 text-white/85">
            <a href={telHref(site.phone)} className="hover:underline">{site.phone}</a>
            {' · '}
            <a href={mailtoHref(site.email)} className="hover:underline">{site.email}</a>
          </p>
          <p className="mt-4 text-sm text-white/70">© {new Date().getFullYear()} {site.legalName}</p>
        </div>
        <SocialRow links={site.social} tone="dark" />
      </Container>
    </footer>
  );
}
