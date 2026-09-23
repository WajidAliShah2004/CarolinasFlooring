import { BeforeAfter } from '@/components/blocks/BeforeAfter';
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

// S4 / K5. One grid, one enforced ratio, every media type.
export function Gallery({ items = galleryItems }: { items?: GalleryItem[] }) {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-16 md:py-24">
      <Container>
        <SectionHeading id="gallery-title" title="Recent work" lede="Real jobs by David and his technicians." />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {items.map((item) => (
            <li key={item.id}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Media item={item} />
                </div>
                <figcaption className="mt-2 text-sm text-foreground/80">{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
