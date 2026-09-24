// The mockup's signature: a rotated basketweave-parquet motif in the four wood tones.
const TILES = Array.from({ length: 80 }, (_, i) => i);
const TONES = ['bg-wood-2', 'bg-wood-1', 'bg-wood-3', 'bg-wood-4'];

export function Parquet() {
  return (
    <div aria-hidden className="absolute -inset-[34%] grid rotate-45 grid-cols-[repeat(auto-fill,93px)] auto-rows-[93px]">
      {TILES.map((i) => (
        <i
          key={i}
          className={`block ${TONES[(i + 1) % 4]} ${
            i % 2 === 0
              ? '[mask-image:repeating-linear-gradient(0deg,#000_0_27px,transparent_27px_31px)]'
              : '[mask-image:repeating-linear-gradient(90deg,#000_0_27px,transparent_27px_31px)]'
          }`}
        />
      ))}
    </div>
  );
}
