// Copy follows the Concept A mockup (01-warm-minimal.html). PLACEHOLDER — David replaces every word (docx CH4).
import type { Img } from './types';

export const navLinks = [
  { label: 'Meet David', href: '/#video' },
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#gallery' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const hero = {
  eyebrow: (startYear: number) => `Serving the Carolinas · Since ${startYear}`,
  headline: (years: number) => ({
    before: `${years} years of floors, and `,
    highlight: 'one person',
    after: ' answering for every one.',
  }),
  lede: 'Carpet, hardwood, and luxury vinyl plank — selected with the owner, installed by his own technicians. Nothing gets handed to a call centre.',
  primaryCta: 'Book a consultation',
  secondaryCta: "Watch David's story",
  panelTag: 'Herringbone · hardwood',
  trust: (years: number) => [`${years} years in flooring`, 'Owner-led consultations', '1-year workmanship warranty'],
  image: { src: '/assets/photos/refinished-stairs-0001.jpg', alt: 'Refinished staircase with dark stained treads and white risers' } as Img,
};

export const introVideo = {
  title: 'Meet David',
  lede: 'Two minutes with the owner — how he sells flooring, and why he still does the consultation himself.',
  quote: (years: number) =>
    `"I'm originally from Syracuse. I've been consulting on flooring solutions for over ${years} years — and there's a reason I get nothing but 5-star reviews."`,
  // Set to '/assets/david-intro.mp4' once the file is in public/assets. Empty = poster only, no request.
  src: '',
  poster: '/assets/video-poster.jpg',
  duration: '~2 min', // PLACEHOLDER until the video is cut
  // PLACEHOLDER timestamps — set once the real video exists.
  chapters: [
    { label: 'Who I am', seconds: 0 },
    { label: 'How I work', seconds: 40 },
    { label: 'Why my prices are lower', seconds: 80 },
  ],
};

// Docx §7.4 — two parallel service paths, each with its own CTA. PLACEHOLDER: David is rewriting this.
export const twoWays = {
  title: 'Floors, two ways',
  lede: "Buy the product on its own, or have David's technicians install it.",
  note: 'Placeholder copy — David is rewriting this section.',
  paths: [
    {
      title: 'Just the product',
      body: 'Choose your flooring with David and buy it on its own. Ideal if you already have an installer.',
      cta: 'Ask about a product',
    },
    {
      title: 'Product + installation',
      body: "David supplies the floor and his own technicians install it — one person answerable from start to finish.",
      cta: 'Book a consultation',
    },
  ],
};

// Floor types from the Concept A mockup. Brand names are text only (no outbound links, docx D9).
export const services = {
  title: 'Four floors, sold two ways',
  lede: "Buy the product on its own, or have David's technicians install it.",
  rows: [
    { title: 'Carpet', body: 'Plush through to hard-wearing loop, matched to the room and the traffic it actually takes.', brands: 'Shaw · Mohawk · DreamWeaver', swatch: 'carpet' },
    { title: 'Hardwood', body: 'Solid and engineered, in straight-lay, herringbone or chevron. The subfloor is assessed before anything is quoted.', brands: 'Shaw · Somerset', swatch: 'wood' },
    { title: 'Luxury vinyl plank', body: 'Waterproof, quiet underfoot, and the workhorse for kitchens, basements and busy households.', brands: 'COREtec · Shaw Floorté', swatch: 'lvp' },
    { title: 'Tile', body: 'Porcelain, ceramic and stone-look, for bathrooms, entryways and floors that take a beating.', brands: 'Chesapeake', swatch: 'tile' },
  ] as { title: string; body: string; brands: string; swatch: 'carpet' | 'wood' | 'lvp' | 'tile' }[],
  note: 'Placeholder copy — David is rewriting this section.',
};

export const gallery = {
  title: 'Recent work',
  lede: 'Thousands of square feet across homes and businesses in the region.',
};

export const seeItFirst = {
  title: 'See it before you buy it',
  lede: 'Full-size displays, so you handle the actual product rather than a postage stamp — brought to your home, or at a meeting by appointment.',
  cta: 'Book a consultation',
  shelf: [
    { src: '/assets/photos/shaw-hardwood-0001.jpg', alt: 'Shaw · Floorté hardwood' },
    { src: '/assets/photos/shaw-carpet.jpg', alt: 'Shaw carpet' },
    { src: '/assets/photos/mohawk-carpet-image-0001.jpg', alt: 'Mohawk carpet' },
    { src: '/assets/photos/coretec-display-0001.jpg', alt: 'COREtec luxury vinyl' },
    { src: '/assets/photos/dreamweaver-carpet-0001.jpg', alt: 'DreamWeaver carpet' },
    { src: '/assets/photos/floorte.jpg', alt: 'Shaw Floorté vinyl' },
    { src: '/assets/photos/somerset-hardwood-0001.jpg', alt: 'Hardwood sample aisle' },
    { src: '/assets/photos/hardwood-photo-for-web-site-1.jpg', alt: 'Hardwood displays' },
    { src: '/assets/photos/tile-display-0001.jpg', alt: 'Chesapeake tile' },
  ] as Img[],
  note: 'Brand list to be confirmed by David (docx O9).',
};

export const brandsCopy = {
  title: 'Brands we carry',
  lede: "Explore each brand's range right here — then ask David about anything you like.",
};

export const about = {
  title: 'About David',
  quote: '"I\'m the best at what I do, and there is a reason I get nothing but 5-star reviews."',
  body: (startYear: number) => [
    `David A. Gwilt has worked in flooring since ${startYear}, after moving down from Syracuse, in upstate New York. Since then he and his technicians have installed thousands of square feet of flooring in homes and businesses throughout the region.`,
    "The business runs on three things he'll tell you himself: fair pricing, service that doesn't stop at the sale, and follow-up during and after the job.",
  ],
  note: 'Placeholder bio. Portrait to be replaced — supply a 4:5 photo, at least 1600 × 2000 px.',
  portrait: { src: '/assets/david.jpg', alt: 'David A. Gwilt, owner' } as Img,
};

export const reviewsCopy = {
  title: 'Why people call back',
  note: 'Placeholder reviews — to be replaced with real quotes from each profile. Review counts to confirm.',
  trust: [
    { title: 'Five stars, three platforms', body: 'Google, Facebook and Yelp.' },
    { title: 'Warranty in writing', body: 'Manufacturer warranties on every product, plus a one-year workmanship warranty. Longer cover is available — pricing depends on the product and the setting.' },
    { title: 'The owner picks up', body: 'Consultation, selection and follow-up all go through David. The technicians handle the install.' },
  ],
};

export const contactCopy = {
  title: 'Start with a conversation',
  lede: "Tell David the rooms and the rough square footage — he'll take it from there.",
  savings: 'No brick-and-mortar overhead means lower prices — the savings go straight to you.',
  submit: 'Send to David',
  sending: 'Sending…',
  success: 'Thanks — David will be in touch shortly.',
  error: 'Something went wrong sending your message. Please try again, or call David directly.',
};

export const consultOptions = [
  { title: 'Samples at your home', body: 'David brings samples to you, so you see them in your own light.' },
  { title: 'Meet by appointment', body: 'Want to see the full range? Book a time and David will arrange where to meet.' },
];
