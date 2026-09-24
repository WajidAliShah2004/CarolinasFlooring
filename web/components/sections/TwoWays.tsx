import { Container } from '@/components/layout/Container';
import { PlaceholderNote } from '@/components/layout/PlaceholderNote';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { twoWays } from '@/content/copy';

// S3. Two equal-weight paths; stacks on mobile.
export function TwoWays() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-16 md:py-24">
      <Container>
        <SectionHeading id="services-title" number="02" label="Services" title={twoWays.title} />
        <ul className="grid gap-6 md:grid-cols-2">
          {twoWays.paths.map((path, i) => (
            <li key={path.title} className="rounded-xl bg-white p-8 shadow-soft transition-transform hover:-translate-y-0.5">
              <p className="text-sm font-semibold text-navy">0{i + 1}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-navy">{path.title}</h3>
              <p className="mt-3 text-foreground/80">{path.body}</p>
            </li>
          ))}
        </ul>
        <PlaceholderNote>{twoWays.note}</PlaceholderNote>
      </Container>
    </section>
  );
}
