import { VideoPlayer } from '@/components/blocks/VideoPlayer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { introVideo } from '@/content/copy';
import { site } from '@/site.config';

// S2. Directly after the hero, before all other content. With no video file, the poster alone shows.
export function IntroVideo() {
  return (
    <section id="video" aria-labelledby="video-title" className="bg-gradient-to-b from-navy-deep to-navy py-12 md:py-24">
      <Container>
        <SectionHeading
          id="video-title"
          number={introVideo.number}
          label={introVideo.label}
          title={introVideo.title}
          lede={introVideo.lede}
          tone="dark"
        />
        <VideoPlayer
          src={introVideo.src}
          poster={introVideo.poster}
          title={site.ownerName}
          subtitle={`Owner · in flooring since ${site.startYear}`}
          duration={introVideo.duration}
          chapters={introVideo.chapters}
        />
      </Container>
    </section>
  );
}
