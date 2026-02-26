import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../../hooks/useQueries';
import { Shield } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const isAdmin = userRole === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-lg tracking-wide">Dark Predictions Paintings</span>
          </Link>

          <nav className="flex items-center gap-4">
            {identity && isAdmin && (
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/admin' })}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            <LoginButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
