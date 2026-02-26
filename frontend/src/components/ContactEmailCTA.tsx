import { Button } from '@/components/ui/button';
import { Mail, Ban } from 'lucide-react';
import { CONTACT_EMAIL, buildMailtoLink } from '../constants/contact';
import { useSiteContent } from '../hooks/useQueries';

interface ContactEmailCTAProps {
  paintingTitle?: string;
  paintingId?: string;
  disabled?: boolean;
}

export default function ContactEmailCTA({ paintingTitle, paintingId, disabled = false }: ContactEmailCTAProps) {
  const { data: siteContent } = useSiteContent();
  const contactEmail = siteContent?.contactEmail ?? CONTACT_EMAIL;

  const subject = paintingTitle ? `Inquiry about "${paintingTitle}"` : 'Painting Inquiry';
  const body = paintingTitle
    ? `Hello,\n\nI am interested in purchasing "${paintingTitle}" (ID: ${paintingId}).\n\nPlease provide more information.\n\nThank you.`
    : 'Hello,\n\nI am interested in purchasing one of your paintings.\n\nThank you.';

  const mailtoLink = `mailto:${contactEmail}?${new URLSearchParams({ subject, body }).toString()}`;

  if (disabled) {
    return (
      <div className="space-y-4">
        <div className="text-center p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Ban className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-semibold text-destructive">This painting has been sold</h3>
          </div>
          <p className="text-muted-foreground">
            This piece is no longer available for purchase. Browse our gallery for other available works.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Interested in this piece?</h3>
        <p className="text-muted-foreground mb-4">
          Contact us directly to discuss purchase and shipping details
        </p>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a href={mailtoLink}>
            <Mail className="mr-2 h-5 w-5" />
            Email {contactEmail}
          </a>
        </Button>
      </div>
    </div>
  );
}
