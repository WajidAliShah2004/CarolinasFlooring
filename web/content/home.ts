import type { ComponentType } from 'react';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { IntroVideo } from '@/components/sections/IntroVideo';
import { Reviews } from '@/components/sections/Reviews';
import { SeeItFirst } from '@/components/sections/SeeItFirst';
import { TwoWays } from '@/components/sections/TwoWays';

export type HomeSection = { id: string; Component: ComponentType };

// Concept A mockup order (spec §7). Brands live inside SeeItFirst as in the mockup.
// Deleted per the docx: "highest standards" region band (S9), showroom block (S11), hours (S12).
export const homeSections: HomeSection[] = [
  { id: 'hero', Component: Hero },
  { id: 'video', Component: IntroVideo },
  { id: 'two-ways', Component: TwoWays },
  { id: 'gallery', Component: Gallery },
  { id: 'see-it', Component: SeeItFirst },
  { id: 'about', Component: About },
  { id: 'reviews', Component: Reviews },
  { id: 'contact', Component: Contact },
];
