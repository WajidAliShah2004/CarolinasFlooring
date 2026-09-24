// Builds the intro-video poster: David's portrait centred on the navy-deep token.
// Re-run (`npm run poster`) whenever --brand-navy-deep changes in app/globals.css.
import sharp from 'sharp';

const WIDTH = 1600;
const HEIGHT = 900;
const NAVY_DEEP = { r: 0x15, g: 0x2a, b: 0x46 }; // keep in sync with --brand-navy-deep
const PORTRAIT_W = 470;
const PORTRAIT_H = 610;

const portrait = await sharp('public/assets/david.jpg')
  .resize(PORTRAIT_W, PORTRAIT_H, { fit: 'cover', position: 'top' })
  .toBuffer();

await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: NAVY_DEEP } })
  .composite([{ input: portrait, left: (WIDTH - PORTRAIT_W) / 2, top: (HEIGHT - PORTRAIT_H) / 2 }])
  .jpeg({ quality: 85 })
  .toFile('public/assets/video-poster.jpg');

console.log('Wrote public/assets/video-poster.jpg');
