import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { timeline } from '@/content/copy';

// Process timeline — horizontal on md+, vertical on phones.
export function Timeline() {
  return (
    <section id="process" aria-labelledby="process-title" className="py-16 md:py-24">
      <Container>
        <SectionHeading id="process-title" number={timeline.number} label={timeline.label} title={timeline.title} />
        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          <span aria-hidden className="absolute top-6 right-0 left-0 hidden h-px bg-border md:block" />
          {timeline.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="relative md:pt-14">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-lg font-bold text-white shadow-soft md:absolute md:top-0 md:left-0">
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-navy md:mt-2">{s.title}</h3>
              <p className="mt-2 text-foreground/80">{s.body}</p>
            </Reveal>
          ))}
        </ol>
        <PlaceholderNote>{timeline.note}</PlaceholderNote>
      </Container>
    </section>
  );
}
