import { describe, expect, it } from 'vitest';
import { leadFields } from '@/content/leadForm';
import { validateLead } from './validateLead';

const valid = {
  name: 'Pat Smith',
  email: 'pat@example.com',
  phone: '704-555-0100',
  message: 'Two bedrooms, carpet, next month.',
};

describe('validateLead', () => {
  it('returns no errors for a complete, valid submission', () => {
    expect(validateLead(valid, leadFields)).toEqual({});
  });
  it('flags every missing required field with its own message', () => {
    expect(validateLead({}, leadFields)).toEqual({
      name: 'Please enter your name.',
      email: 'Please enter your email address.',
      phone: 'Please enter your phone number.',
      message: 'Please tell David a little about your project.',
    });
  });
  it('treats whitespace-only as missing', () => {
    expect(validateLead({ ...valid, name: '   ' }, leadFields)).toEqual({ name: 'Please enter your name.' });
  });
  it('rejects a malformed email', () => {
    expect(validateLead({ ...valid, email: 'pat@example' }, leadFields)).toEqual({
      email: 'Please enter a valid email address.',
    });
  });
  it('rejects phone numbers with fewer than 10 digits', () => {
    expect(validateLead({ ...valid, phone: '555-0100' }, leadFields)).toEqual({
      phone: 'Please enter a valid phone number.',
    });
  });
  it('accepts formatted 10-digit and +1 numbers', () => {
    expect(validateLead({ ...valid, phone: '(704) 555-0100' }, leadFields)).toEqual({});
    expect(validateLead({ ...valid, phone: '+1 704 555 0100' }, leadFields)).toEqual({});
  });
  it('skips optional empty fields', () => {
    const fields = [...leadFields, { name: 'extra', label: 'Extra', kind: 'text' as const, required: false, requiredMessage: '' }];
    expect(validateLead(valid, fields)).toEqual({});
  });
});
