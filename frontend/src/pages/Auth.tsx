import React, { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const getTitle = () => {
    return authMode === 'signup' ? 'Sign up' : 'Sign in';
  };

  const getSubtitle = () => {
    return authMode === 'signup' 
      ? 'Sign up to enjoy the feature of HD' 
      : 'Please login to continue to your account.';
  };

  return (
    <AuthLayout
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      <AuthForm onModeChange={setAuthMode} />
    </AuthLayout>
  );
};