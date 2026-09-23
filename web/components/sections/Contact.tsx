import { ConsultOptions } from '@/components/blocks/ConsultOptions';
import { LeadForm } from '@/components/blocks/LeadForm';
import { SocialRow } from '@/components/blocks/SocialRow';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { contactCopy } from '@/content/copy';
import { mailtoHref, telHref } from '@/lib/contact';
import { site } from '@/site.config';

// S10–S14. Form first (it's the conversion target). No address, hours or map.
export function Contact() {
  const details = [
    { label: 'Phone', value: site.phone, href: telHref(site.phone) },
    { label: 'Email', value: site.email, href: mailtoHref(site.email) },
    { label: 'Business', value: site.legalName },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-border py-16 md:py-24">
      <Container>
        <SectionHeading id="contact-title" title={contactCopy.title} lede={contactCopy.lede} />
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <LeadForm />
          </div>
          <div className="space-y-8">
            <dl>
              {details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 border-t border-border py-4 last:border-b">
                  <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{d.label}</dt>
                  <dd className="text-right">
                    {d.href ? <a href={d.href} className="font-medium text-navy hover:underline">{d.value}</a> : d.value}
                  </dd>
                </div>
              ))}
            </dl>
            <ConsultOptions />
            <p className="text-lg font-medium text-navy">{contactCopy.savings}</p>
            <SocialRow links={site.social} />
          </div>
        </div>
      </Container>
    </section>
  );
}
