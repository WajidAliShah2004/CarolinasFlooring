import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { Reveal } from '@/components/motion/Reveal';
import { about } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S7 / K10 — mockup "About": portrait left (4:5), serif quote, two paragraphs, three facts.
export function About() {
  const facts = [
    { label: 'Founded', value: String(site.startYear) },
    { label: 'Years advising', value: `${yearsOfExperience()}+` },
    { label: 'Workmanship warranty', value: '1 yr' },
  ];
  return (
    <section id="about" aria-labelledby="about-title" className="border-y border-line bg-surface py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container className="grid items-center gap-[clamp(30px,5vw,66px)] md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="relative aspect-square overflow-hidden rounded-[4px] bg-surface md:aspect-[4/5]">
            <Image src={about.portrait.src} alt={about.portrait.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[center_22%] saturate-[0.88] contrast-[1.02]" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 id="about-title" className="sr-only">{about.title}</h2>
          <blockquote className="font-display text-[clamp(20px,2.3vw,27px)] leading-[1.42] tracking-[-0.018em] text-navy">{about.quote}</blockquote>
          {about.body(site.startYear).map((para) => (
            <p key={para} className="mt-4.5 max-w-[56ch] text-stone">{para}</p>
          ))}
          <dl className="mt-9 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-4.5 py-5">
                <dt className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-stone">{f.label}</dt>
                <dd className="mt-1.5 font-display text-[clamp(24px,3vw,33px)] font-semibold tracking-[-0.02em] text-navy">{f.value}</dd>
              </div>
            ))}
          </dl>
          <PlaceholderNote>{about.note}</PlaceholderNote>
        </Reveal>
      </Container>
    </section>
  );
}
