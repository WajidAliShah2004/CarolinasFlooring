import { Carousel } from '@/components/blocks/Carousel';
import { DualCta } from '@/components/blocks/DualCta';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { seeItFirst } from '@/content/copy';
import { site } from '@/site.config';

// S5. Prime real estate — full width, feature-size heading, samples carousel.
export function SeeItFirst() {
  return (
    <section id="see-it" aria-labelledby="see-it-title" className="bg-secondary py-16 md:py-28">
      <Container size="wide">
        <SectionHeading id="see-it-title" number="05" label="Samples" title={seeItFirst.title} lede={seeItFirst.lede} size="feature" />
        <Carousel slides={seeItFirst.shelf} label="Sample displays" />
        <DualCta className="mt-10" primary={{ label: seeItFirst.cta, href: site.bookingUrl }} />
      </Container>
    </section>
  );
}
