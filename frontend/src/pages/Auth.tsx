import React from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout
      title="Sign up"
      subtitle="Sign up to enjoy the feature of HD"
    >
      <AuthForm />
    </AuthLayout>
  );
};