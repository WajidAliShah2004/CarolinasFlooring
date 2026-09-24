export function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, '')}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}
