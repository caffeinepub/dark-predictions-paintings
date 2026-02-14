import { Heart } from 'lucide-react';
import { CONTACT_EMAIL } from '../../constants/contact';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'dark-predictions-paintings';

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
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-primary hover:underline"
            >
              {CONTACT_EMAIL}
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
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
