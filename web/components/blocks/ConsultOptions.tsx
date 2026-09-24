import { consultOptions } from '@/content/copy';

// K16 — replaces the removed showroom content (docx S11 / N52). White card, hairline rule.
export function ConsultOptions() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {consultOptions.map((o) => (
        <li key={o.title} className="rounded-[4px] border border-line bg-surface p-5">
          <h3 className="font-display text-[19px] font-semibold tracking-[-0.015em] text-navy">{o.title}</h3>
          <p className="mt-1 text-[15px] text-stone">{o.body}</p>
        </li>
      ))}
    </ul>
  );
}
