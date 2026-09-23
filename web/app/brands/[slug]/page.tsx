import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { brands } from '@/content/brands';
import { site } from '@/site.config';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  return { title: brand ? `${brand.name} | ${site.businessName}` : site.businessName };
}

// STUB — the product and colour swatch grid (K9) comes in a later build.
export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();
  return (
    <Container className="py-16 md:py-24">
      <Link href="/#brands" className="text-sm font-semibold text-navy hover:underline">← All brands</Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-navy md:text-5xl">{brand.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/80">
        The full {brand.name} range and colours are coming to this page soon. In the meantime, David can bring samples to you.
      </p>
      <DualCta className="mt-8" primary={{ label: 'Book a Consultation', href: site.bookingUrl }} />
    </Container>
  );
}
