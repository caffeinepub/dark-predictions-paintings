import { useSiteContent } from '../../hooks/useQueries';
import { CONTACT_EMAIL } from '../../constants/contact';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: siteContent } = useSiteContent();
  const contactEmail = siteContent?.contactEmail ?? CONTACT_EMAIL;

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Dark Predictions Paintings</h3>
            <p className="text-sm text-muted-foreground">
              One-of-a-kind paintings supporting affordable housing in our community.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">
              For inquiries about purchasing artwork:
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-sm text-primary hover:underline"
            >
              {contactEmail}
            </a>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Mission</h3>
            <p className="text-sm text-muted-foreground">
              Proceeds support building affordable modern housing for our local community.
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Dark Predictions Paintings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
