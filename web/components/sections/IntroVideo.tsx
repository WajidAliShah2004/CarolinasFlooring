import { VideoPlayer } from '@/components/blocks/VideoPlayer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { introVideo } from '@/content/copy';
import { yearsOfExperience } from '@/lib/years';
import { site } from '@/site.config';

// S2 — mockup "Meet David": paper band, player left, italic serif quote right. Directly after the hero.
export function IntroVideo() {
  return (
    <section id="video" aria-labelledby="video-title" className="border-y border-line bg-paper py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="video-title" title={introVideo.title} lede={introVideo.lede} />
        </Reveal>
        <div className="grid items-center gap-[clamp(28px,4vw,56px)] md:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <VideoPlayer
              src={introVideo.src}
              poster={introVideo.poster}
              title={site.ownerName}
              subtitle={`Owner · in flooring since ${site.startYear}`}
              duration={introVideo.duration}
              chapters={introVideo.chapters}
            />
          </Reveal>
          <Reveal delay={120}>
            <blockquote className="max-w-[30ch] font-display text-[clamp(19px,2.2vw,26px)] italic leading-[1.45] tracking-[-0.015em] text-ink">
              {introVideo.quote(yearsOfExperience())}
              <cite className="mt-4.5 block font-sans text-[12px] font-medium not-italic uppercase tracking-[0.18em] text-stone">
                {site.ownerName}, owner
              </cite>
            </blockquote>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
