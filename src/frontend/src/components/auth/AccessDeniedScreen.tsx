import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';

interface AccessDeniedScreenProps {
  isAuthenticated: boolean;
}

export default function AccessDeniedScreen({ isAuthenticated }: AccessDeniedScreenProps) {
  const { login } = useInternetIdentity();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            {isAuthenticated
              ? 'You do not have administrator privileges to access this area.'
              : 'You must be logged in as an administrator to access this area.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated && (
            <Button onClick={login} className="w-full" size="lg">
              Login to Continue
            </Button>
          )}
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Return to Gallery
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
