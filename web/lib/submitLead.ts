export type LeadResult = { ok: true } | { ok: false; error: string };

/**
 * MOCK — no email is sent. Replace with a POST to /api/lead when delivery is built
 * (spec §7: email to David with reply-to = visitor).
 * `company` is the honeypot field.
 */
export async function submitLead(
  values: Record<string, string>,
  opts: { forceError?: boolean; delayMs?: number } = {},
): Promise<LeadResult> {
  const { forceError = false, delayMs = 800 } = opts;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  if (forceError || (values.company ?? '').trim() !== '') return { ok: false, error: 'mock-failure' };
  return { ok: true };
}
