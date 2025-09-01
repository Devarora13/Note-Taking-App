import Logo from '@/assets/Logo';
import React from 'react';

interface LogoProps {
  className?: string;
}

export const LogoWithName: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <Logo />
      <span className="text-xl font-semibold text-foreground">HD</span>
    </div>
  );
};