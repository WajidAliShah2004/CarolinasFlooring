import { Container } from '@/components/layout/Container';
import { Counter } from '@/components/motion/Counter';
import { Reveal } from '@/components/motion/Reveal';
import { stats } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';

// Bento stats — data-backed only (years derived; the rest are stated commitments).
export function Stats() {
  return (
    <section id="stats" aria-label="At a glance" className="py-16 md:py-24">
      <Container>
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Reveal className="rounded-xl bg-gradient-to-br from-navy-deep to-navy p-8 text-white shadow-soft md:row-span-2 md:flex md:flex-col md:justify-end">
            <p className="text-7xl font-semibold tracking-tight md:text-8xl">
              <Counter to={yearsOfExperience()} />
            </p>
            <p className="mt-2 text-lg text-white/80">{stats.yearsLabel}</p>
          </Reveal>
          {stats.items.map((s, i) => (
            <Reveal key={s.title} delay={(i + 1) * 80} className="rounded-xl bg-white p-6 shadow-soft transition-transform hover:-translate-y-0.5">
              <span aria-hidden className="mb-3 block h-1 w-8 rounded-full bg-syracuse" />
              <h3 className="text-lg font-semibold text-navy">{s.title}</h3>
              <p className="mt-1 text-foreground/80">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
