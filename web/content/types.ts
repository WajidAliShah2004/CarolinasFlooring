export type Img = { src: string; alt: string };

export type GalleryItem =
  | { type: 'photo'; id: string; image: Img; caption: string }
  | { type: 'video'; id: string; src: string; poster: string; alt: string; caption: string }
  | { type: 'pair'; id: string; before: Img | null; after: Img | null; caption: string };

export type Brand = { name: string; slug: string };

export type SocialPlatform = 'google' | 'facebook' | 'yelp' | 'apple';

export type Review = { id: string; quote: string; author: string; platform: SocialPlatform };

export type LeadField = {
  name: string;
  label: string;
  kind: 'text' | 'email' | 'tel' | 'textarea';
  required: boolean;
  requiredMessage: string;
  autoComplete?: string;
  placeholder?: string;
};
