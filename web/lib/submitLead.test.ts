import { describe, expect, it } from 'vitest';
import { submitLead } from './submitLead';

describe('submitLead (mock)', () => {
  it('succeeds for a normal submission', async () => {
    await expect(submitLead({ name: 'Pat' }, { delayMs: 0 })).resolves.toEqual({ ok: true });
  });
  it('fails when forced', async () => {
    await expect(submitLead({ name: 'Pat' }, { delayMs: 0, forceError: true })).resolves.toEqual({
      ok: false,
      error: 'mock-failure',
    });
  });
  it('fails when the honeypot is filled', async () => {
    await expect(submitLead({ name: 'Bot', company: 'Spam Inc' }, { delayMs: 0 })).resolves.toEqual({
      ok: false,
      error: 'mock-failure',
    });
  });
});
