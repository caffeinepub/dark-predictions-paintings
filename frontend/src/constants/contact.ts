// Default fallback contact email. The live contact email is now editable via the
// admin panel and sourced from backend site content in most components.
export const CONTACT_EMAIL = 'offgridsecrets@gmail.com';

export function buildMailtoLink(subject: string, body: string): string {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}
