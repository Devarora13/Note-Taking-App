import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        toast({
          title: 'Authentication Failed',
          description: 'Google authentication failed. Please try again.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          
          // Store token and user data
          localStorage.setItem('token', token);
          setToken(token);
          setUser(user);

          toast({
            title: 'Welcome!',
            description: `Successfully signed in with Google!`,
          });

          navigate('/dashboard');
        } catch (error) {
          console.error('Error parsing user data:', error);
          toast({
            title: 'Authentication Error',
            description: 'Failed to process authentication data.',
            variant: 'destructive',
          });
          navigate('/auth');
        }
      } else {
        toast({
          title: 'Authentication Error',
          description: 'Missing authentication data.',
          variant: 'destructive',
        });
        navigate('/auth');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setToken, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};
