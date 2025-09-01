import React from "react";
import { LogoWithName } from "../ui/logo";
// import sideImage from "../../assets/right-column.jpg";
import sideImage from "../../assets/side-image.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="md:text-left text-center">
            <LogoWithName className="mb-8 md:absolute left-5 top-5 justify-center" />
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-2xl m-2"
          style={{ backgroundImage: `url(${sideImage})` }}
        ></div>
      </div>
    </div>
  );
};
