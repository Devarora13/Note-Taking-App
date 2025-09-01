import Logo from '@/assets/Logo';
import React from 'react';

interface LogoProps {
  className?: string;
  isLogoOnly?: boolean;
}

export const LogoWithName: React.FC<LogoProps> = ({ className = "" , isLogoOnly=false}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <Logo />
      {!isLogoOnly && <span className="text-xl font-semibold text-foreground">HD</span>}
    </div>
  );
};