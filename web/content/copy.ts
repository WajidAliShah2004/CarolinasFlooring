// PLACEHOLDER COPY — every word here is replaced by David's copy (spec CH4).
import type { Img } from './types';

export const navLinks = [
  { label: 'Work', href: '/#gallery' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/#contact' },
];

export const hero = {
  eyebrow: 'Carpet · Hardwood · Luxury vinyl · Tile',
  headline: (years: number) => ({
    before: `${years} years of floors, and `,
    highlight: 'one person',
    after: ' answering for every one.',
  }),
  lede: "Buy the flooring on its own, or have it installed by David's own technicians. Either way, you deal with the owner.",
  primaryCta: 'Book a Consultation',
  secondaryCta: 'Watch My Story',
  image: { src: '/assets/photos/refinished-stairs-0001.jpg', alt: 'Refinished staircase with dark stained treads and white risers' } as Img,
  trust: (years: number) => [`${years} years in flooring`, 'Owner-led consultations', '1-year workmanship warranty'],
};

export const introVideo = {
  title: 'Meet David',
  lede: 'A short introduction from the owner — how he works, and why you deal with him from the first visit to the last.',
  src: '/assets/david-intro.mp4',
  poster: '/assets/video-poster.jpg',
};

export const twoWays = {
  title: 'Floors, two ways',
  note: 'Placeholder copy — David is writing this section.',
  paths: [
    {
      title: 'Just the product',
      body: 'Choose your flooring with David and buy it on its own. Ideal if you already have an installer.',
    },
    {
      title: 'Product + installation',
      body: 'David supplies the floor and his own technicians install it — one person answerable from start to finish.',
    },
  ],
};

export const seeItFirst = {
  title: 'See it before you buy it',
  lede: 'Handle full-size samples of the real product — brought to your home, or at a meeting by appointment.',
  cta: 'Book a Consultation',
  shelf: [
    { src: '/assets/photos/shaw-hardwood-0001.jpg', alt: 'Shaw hardwood samples' },
    { src: '/assets/photos/shaw-carpet.jpg', alt: 'Shaw carpet samples' },
    { src: '/assets/photos/mohawk-carpet-image-0001.jpg', alt: 'Mohawk carpet samples' },
    { src: '/assets/photos/coretec-display-0001.jpg', alt: 'COREtec luxury vinyl samples' },
    { src: '/assets/photos/dreamweaver-carpet-0001.jpg', alt: 'DreamWeaver carpet samples' },
    { src: '/assets/photos/floorte.jpg', alt: 'Shaw Floorté vinyl samples' },
    { src: '/assets/photos/somerset-hardwood-0001.jpg', alt: 'Hardwood sample boards' },
    { src: '/assets/photos/hardwood-photo-for-web-site-1.jpg', alt: 'Hardwood sample boards' },
    { src: '/assets/photos/tile-display-0001.jpg', alt: 'Chesapeake tile samples' },
  ] as Img[],
};

export const brandsCopy = {
  title: 'Brands we carry',
  lede: "Explore each brand's range right here — then ask David about anything you like.",
};

export const about = {
  title: 'About David',
  quote: '"There is a reason I get nothing but 5-star reviews."',
  body: [
    'David A. Gwilt has worked in flooring since 2007, after moving down from Syracuse, New York.',
    'Consultation, selection and follow-up all go through him; his technicians handle the install.',
  ],
  note: 'Placeholder bio. Portrait to be replaced — supply a 4:5 photo, at least 1600 × 2000 px.',
  portrait: { src: '/assets/david.jpg', alt: 'David A. Gwilt, owner' } as Img,
};

export const reviewsCopy = {
  title: 'What customers say',
  note: 'Placeholder reviews — to be replaced with real quotes from each profile.',
};

export const contactCopy = {
  title: 'Start the conversation',
  lede: "Tell David what you have in mind and he'll get back to you.",
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
