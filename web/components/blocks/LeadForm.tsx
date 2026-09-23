'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactCopy } from '@/content/copy';
import { leadFields } from '@/content/leadForm';
import type { LeadField } from '@/content/types';
import { ctaPrimary } from '@/lib/cta';
import { submitLead, type LeadResult } from '@/lib/submitLead';
import { validateLead, type LeadErrors } from '@/lib/validateLead';

type Submit = (values: Record<string, string>, opts?: { forceError?: boolean }) => Promise<LeadResult>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

// K13. Fields come from content/leadForm.ts, so adding one needs no layout change.
export function LeadForm({ fields = leadFields, submit = submitLead }: { fields?: LeadField[]; submit?: Submit }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateLead(values, fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus('sending');
    // Dev hook for exercising the failure state: /?formError=1
    const forceError = new URLSearchParams(window.location.search).get('formError') === '1';
    const payload = Object.fromEntries(fields.map((f) => [f.name, (values[f.name] ?? '').trim()]));
    const result = await submit({ ...payload, company: honeypot }, { forceError });
    setStatus(result.ok ? 'sent' : 'error');
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-md border border-border bg-secondary p-8">
        <p className="text-xl font-semibold text-navy">{contactCopy.success}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Contact David" className="relative">
      {fields.map((f) => {
        const id = `lead-${f.name}`;
        const error = errors[f.name];
        const common = {
          id,
          name: f.name,
          value: values[f.name] ?? '',
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValues((v) => ({ ...v, [f.name]: e.target.value })),
          required: f.required,
          placeholder: f.placeholder,
          autoComplete: f.autoComplete,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? `${id}-error` : undefined,
          className: 'text-base md:text-lg',
        };
        return (
          <div key={f.name} className="mb-5">
            <Label htmlFor={id} className="mb-2 block text-base font-medium">{f.label}</Label>
            {f.kind === 'textarea' ? (
              <Textarea {...common} rows={5} />
            ) : (
              <Input {...common} type={f.kind} inputMode={f.kind === 'tel' ? 'tel' : undefined} className="h-12 text-base md:text-lg" />
            )}
            {error && (
              <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-syracuse-ink">{error}</p>
            )}
          </div>
        );
      })}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      {status === 'error' && (
        <p role="alert" className="mb-4 font-medium text-syracuse-ink">{contactCopy.error}</p>
      )}
      <button type="submit" disabled={status === 'sending'} className={ctaPrimary}>
        {status === 'sending' ? contactCopy.sending : contactCopy.submit}
      </button>
    </form>
  );
}
