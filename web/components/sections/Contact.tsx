import { ConsultOptions } from '@/components/blocks/ConsultOptions';
import { LeadForm } from '@/components/blocks/LeadForm';
import { SocialRow } from '@/components/blocks/SocialRow';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { contactCopy } from '@/content/copy';
import { mailtoHref, telHref } from '@/lib/contact';
import { site } from '@/site.config';

// S10–S14 — mockup "Start with a conversation": form left, hairline detail rows right. No address, hours or map.
export function Contact() {
  const details = [
    { label: 'Phone', value: site.phone, href: telHref(site.phone) },
    { label: 'Email', value: site.email, href: mailtoHref(site.email) },
    { label: 'Business', value: site.legalName },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="contact-title" title={contactCopy.title} lede={contactCopy.lede} />
        </Reveal>
        <div className="grid gap-[clamp(30px,5vw,70px)] md:grid-cols-2">
          <Reveal>
            <LeadForm />
          </Reveal>
          <Reveal delay={100} className="space-y-7">
            <dl>
              {details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 border-t border-line py-4 text-[15.5px] last:border-b">
                  <dt className="pt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-stone">{d.label}</dt>
                  <dd className="text-right">{d.href ? <a href={d.href} className="hover:underline">{d.value}</a> : d.value}</dd>
                </div>
              ))}
            </dl>
            <ConsultOptions />
            <p className="font-display text-[19px] leading-snug text-ink">{contactCopy.savings}</p>
            <SocialRow links={site.social} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
