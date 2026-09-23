import { homeSections } from '@/content/home';

// Re-render daily so the years figure rolls over on 1 January without a redeploy.
export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      {homeSections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
