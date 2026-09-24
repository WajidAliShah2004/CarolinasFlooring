import type { GalleryItem } from './types';

const p = (file: string) => `/assets/photos/${file}`;

export const galleryItems: GalleryItem[] = [
  {
    type: 'pair',
    id: 'pair-hardwood-finish',
    before: { src: p('unfinished-wood.jpg'), alt: 'Hardwood mid-install, before finishing' },
    after: { src: p('finished-hdwd-0002.jpg'), alt: 'Finished hardwood floor' },
    caption: 'Placeholder pair — hardwood before and after finishing',
  },
  { type: 'photo', id: 'engineered', image: { src: p('engineered-hardwood.jpg'), alt: 'Engineered hardwood in an entry and stair hall' }, caption: 'Engineered hardwood' },
  { type: 'photo', id: 'light-hdwd', image: { src: p('light-hdwd.jpg'), alt: 'A light-toned hardwood floor' }, caption: 'Light hardwood' },
  { type: 'photo', id: 'border', image: { src: p('hdwd-w-border-0001.jpg'), alt: 'Hardwood floor with a contrasting inlaid border' }, caption: 'Hardwood with a border' },
  { type: 'photo', id: 'stairs', image: { src: p('refinished-stairs-0001.jpg'), alt: 'Refinished staircase with dark treads and white risers' }, caption: 'Refinished staircase' },
  { type: 'photo', id: 'lvp', image: { src: p('lvp-1-2.jpg'), alt: 'Luxury vinyl plank flooring in a bedroom' }, caption: 'Luxury vinyl plank' },
  { type: 'photo', id: 'lvt', image: { src: p('lvt.jpg'), alt: 'Marble-look tile in a hallway' }, caption: 'Marble-look tile' },
  { type: 'photo', id: 'lvp-repair', image: { src: p('after-repair-and-new-lvp-install.jpg'), alt: 'Open-plan living area with new luxury vinyl plank' }, caption: 'LVP after subfloor repair' },
  { type: 'photo', id: 'rubber', image: { src: p('amorim-rubber-tiles.jpg'), alt: 'Rubber tile flooring in a home gym' }, caption: 'Rubber tile, home gym' },
];
