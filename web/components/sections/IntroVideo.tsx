import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { introVideo } from '@/content/copy';

// S2. Directly after the hero, before all other content. With no video file, the poster alone shows.
export function IntroVideo() {
  return (
    <section id="video" aria-labelledby="video-title" className="bg-navy-deep py-16 md:py-24">
      <Container>
        <SectionHeading id="video-title" title={introVideo.title} lede={introVideo.lede} tone="dark" />
        <div className="relative aspect-video overflow-hidden rounded-md bg-navy">
          <video className="h-full w-full object-cover" controls preload="none" playsInline poster={introVideo.poster}>
            <source src={introVideo.src} type="video/mp4" />
          </video>
        </div>
      </Container>
    </section>
  );
}
