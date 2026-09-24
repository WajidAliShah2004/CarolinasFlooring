import { BeforeAfter } from '@/components/blocks/BeforeAfter';
import { GalleryPhoto } from '@/components/blocks/GalleryPhoto';
import { GalleryVideo } from '@/components/blocks/GalleryVideo';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { gallery as copy, } from '@/content/copy';
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

// Mockup `.pgrid`: 12-column grid, a 6/6 pair then 4/4/4 rows; captions on a bottom gradient.
const SPAN = ['g6', 'g6', 'g4', 'g4', 'g4', 'g4', 'g4', 'g4', 'g6', 'g6'] as const;

// S4 / K5 — mixed media (photo, video, before/after) in the mockup's staggered grid.
export function Gallery({ items = galleryItems }: { items?: GalleryItem[] }) {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="border-t border-line py-16 md:py-[clamp(64px,8vw,112px)]">
      <Container>
        <Reveal>
          <SectionHeading id="gallery-title" title={copy.title} lede={copy.lede} />
        </Reveal>
        <ul className="grid grid-cols-12 gap-3.5">
          {items.map((item, i) => {
            const six = SPAN[i % SPAN.length] === 'g6';
            return (
              <Reveal
                as="li"
                key={item.id}
                delay={(i % 3) * 60}
                className={cn('col-span-12', six ? 'sm:col-span-6' : 'sm:col-span-6 md:col-span-4')}
              >
                <figure className="group relative overflow-hidden rounded-[4px] border border-line bg-surface">
                  <div className={cn('relative [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.045]', six ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
                    <Media item={item} />
                  </div>
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/55 to-transparent px-4 pt-8 pb-3 text-[12.5px] font-semibold text-white">
                    {item.caption}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
