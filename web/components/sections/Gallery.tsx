'use client';

// Client component: it hands render functions to <Carousel>, which a server component cannot do.
import { BeforeAfter } from '@/components/blocks/BeforeAfter';
import { Carousel } from '@/components/blocks/Carousel';
import { GalleryPhoto } from '@/components/blocks/GalleryPhoto';
import { GalleryVideo } from '@/components/blocks/GalleryVideo';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { galleryItems } from '@/content/gallery';
import type { GalleryItem } from '@/content/types';

function Media({ item }: { item: GalleryItem }) {
  switch (item.type) {
    case 'photo':
      return <GalleryPhoto src={item.image.src} alt={item.image.alt} />;
    case 'video':
      return <GalleryVideo src={item.src} poster={item.poster} alt={item.alt} />;
    case 'pair':
      return <BeforeAfter before={item.before} after={item.after} caption={item.caption} />;
  }
}

// S4 / K5. Every media type in one carousel (same behaviour as the samples carousel).
export function Gallery({ items = galleryItems }: { items?: GalleryItem[] }) {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="border-t border-border py-16 md:py-24">
      <Container size="wide">
        <SectionHeading id="gallery-title" number="04" label="Our work" title="Recent work" lede="Real jobs by David and his technicians." />
        <Carousel
          slides={items}
          label="Project photos and videos"
          keyOf={(item) => item.id}
          slideClassName="w-[85%] sm:w-[60%] md:w-[48%] lg:w-[32%]"
          render={(item) => (
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-soft [&_img]:transition-transform [&_img]:duration-700 group-hover/slide:[&_img]:scale-[1.03]">
                <Media item={item} />
              </div>
              <figcaption className="mt-2 text-xs text-foreground/80 sm:text-sm">{item.caption}</figcaption>
            </figure>
          )}
        />
      </Container>
    </section>
  );
}
