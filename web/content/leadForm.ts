import type { LeadField } from './types';

// Spec §3.9 / N54. Add a field here and the form renders it — no layout changes.
export const leadFields: LeadField[] = [
  { name: 'name', label: 'Name', kind: 'text', required: true, requiredMessage: 'Please enter your name.', autoComplete: 'name' },
  { name: 'email', label: 'Email', kind: 'email', required: true, requiredMessage: 'Please enter your email address.', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', kind: 'tel', required: true, requiredMessage: 'Please enter your phone number.', autoComplete: 'tel' },
  {
    name: 'message',
    label: "What you're looking for",
    kind: 'textarea',
    required: true,
    requiredMessage: 'Please tell David a little about your project.',
    placeholder: "Which rooms, roughly how much space, what kind of flooring, and when you'd like it done.",
  },
];
