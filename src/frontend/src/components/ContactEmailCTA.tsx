import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { CONTACT_EMAIL, buildMailtoLink } from '../constants/contact';

interface ContactEmailCTAProps {
  paintingTitle?: string;
  paintingId?: string;
}

export default function ContactEmailCTA({ paintingTitle, paintingId }: ContactEmailCTAProps) {
  const subject = paintingTitle ? `Inquiry about "${paintingTitle}"` : 'Painting Inquiry';
  const body = paintingTitle
    ? `Hello,\n\nI am interested in purchasing "${paintingTitle}" (ID: ${paintingId}).\n\nPlease provide more information.\n\nThank you.`
    : 'Hello,\n\nI am interested in purchasing one of your paintings.\n\nThank you.';

  const mailtoLink = buildMailtoLink(subject, body);

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
            Email {CONTACT_EMAIL}
          </a>
        </Button>
      </div>
    </div>
  );
}
