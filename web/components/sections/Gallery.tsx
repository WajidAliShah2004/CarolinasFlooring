import { BeforeAfter } from '@/components/blocks/BeforeAfter';
import { GalleryPhoto } from '@/components/blocks/GalleryPhoto';
import { GalleryVideo } from '@/components/blocks/GalleryVideo';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { galleryItems } from '@/content/gallery';
import type { GalleryItem } from '@/content/types';
import { cn } from '@/lib/utils';

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

// S4 / K5. One bento grid, every media type. The first tile spans two columns on desktop.
export function Gallery({ items = galleryItems }: { items?: GalleryItem[] }) {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="border-t border-border py-16 md:py-24">
      <Container size="wide">
        <SectionHeading id="gallery-title" number="04" label="Our work" title="Recent work" lede="Real jobs by David and his technicians." />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 3) * 60} className={cn(i === 0 && 'col-span-2 md:col-span-2')}>
              <figure className="group">
                <div
                  className={cn(
                    'relative overflow-hidden rounded-xl bg-muted shadow-soft [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.03]',
                    i === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]',
                  )}
                >
                  <Media item={item} />
                </div>
                <figcaption className="mt-2 text-xs text-foreground/80 sm:text-sm">{item.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
