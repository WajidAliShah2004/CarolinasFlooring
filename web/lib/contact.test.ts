import { describe, expect, it } from 'vitest';
import { mailtoHref, telHref } from './contact';

describe('contact helpers', () => {
  it('builds a tel: link with country code and digits only', () => {
    expect(telHref('704-614-1200')).toBe('tel:+17046141200');
  });
  it('builds a mailto: link', () => {
    expect(mailtoHref('david@carolinasflooring.com')).toBe('mailto:david@carolinasflooring.com');
  });
});
