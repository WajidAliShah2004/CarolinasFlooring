import { consultOptions } from '@/content/copy';

// K16 — replaces the removed showroom content (spec S11 / N52).
export function ConsultOptions() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {consultOptions.map((o) => (
        <li key={o.title} className="rounded-md border border-border bg-white p-5">
          <h3 className="text-lg font-semibold text-navy">{o.title}</h3>
          <p className="mt-1 text-base text-foreground/80">{o.body}</p>
        </li>
      ))}
    </ul>
  );
}
