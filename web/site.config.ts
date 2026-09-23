import type { SocialPlatform } from '@/content/types';

export type SiteConfig = {
  businessName: string;
  legalName: string;
  ownerName: string;
  phone: string;
  email: string;
  domain: string;
  startYear: number;
  /** STUB until the Google appointment schedule exists (spec S14). */
  bookingUrl: string;
  /** Empty string = not yet supplied; the link is hidden. */
  social: Record<SocialPlatform, string>;
};

// Branding is open (O5/C7) — every business fact is swapped here, in one place.
export const site: SiteConfig = {
  businessName: 'Carolinas Flooring',
  legalName: 'David A Gwilt LLC',
  ownerName: 'David A. Gwilt',
  phone: '704-614-1200',
  email: 'david@carolinasflooring.com',
  domain: 'carolinasflooring.com',
  startYear: 2007,
  bookingUrl: '/#contact',
  social: { google: '', facebook: '', yelp: '', apple: '' },
};
