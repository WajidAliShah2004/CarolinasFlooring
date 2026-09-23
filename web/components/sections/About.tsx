import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { about } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S7 / K10. Fixed 4:5 portrait slot so a replacement photo drops straight in.
export function About() {
  const facts = [
    { label: 'Years in flooring', value: String(yearsOfExperience()) },
    { label: 'In flooring since', value: String(site.startYear) },
    { label: 'Workmanship warranty', value: '1 yr' },
  ];
  return (
    <section id="about" aria-labelledby="about-title" className="py-16 md:py-24">
      <Container className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
          <Image src={about.portrait.src} alt={about.portrait.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
        </div>
        <div>
          <h2 id="about-title" className="text-3xl font-semibold tracking-tight text-navy md:text-4xl">{about.title}</h2>
          <blockquote className="mt-6 text-2xl font-medium leading-snug text-navy">{about.quote}</blockquote>
          {about.body.map((para) => (
            <p key={para} className="mt-4 text-foreground/80">{para}</p>
          ))}
          <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="bg-white p-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-3xl font-semibold text-navy">{f.value}</dd>
              </div>
            ))}
          </dl>
          <PlaceholderNote>{about.note}</PlaceholderNote>
        </div>
      </Container>
    </section>
  );
}
