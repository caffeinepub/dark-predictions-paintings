export const CONTACT_EMAIL = 'offgridsecrets@gmail.com';

export function buildMailtoLink(subject: string, body: string): string {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}
