import type { LeadField } from '@/content/types';

export type LeadErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(values: Record<string, string>, fields: LeadField[]): LeadErrors {
  const errors: LeadErrors = {};
  for (const field of fields) {
    const value = (values[field.name] ?? '').trim();
    if (!value) {
      if (field.required) errors[field.name] = field.requiredMessage;
      continue;
    }
    if (field.kind === 'email' && !EMAIL.test(value)) {
      errors[field.name] = 'Please enter a valid email address.';
    }
    if (field.kind === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) errors[field.name] = 'Please enter a valid phone number.';
    }
  }
  return errors;
}
