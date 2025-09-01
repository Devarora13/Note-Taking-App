import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface SignInFormProps {
  onSuccess: () => void;
  onCreateAccountClick: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSuccess, onCreateAccountClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    keepLoggedIn: false,
  });
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [showOtp, setShowOtp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, verifyOTP, isLoading } = useAuth();
  const { toast } = useToast();

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    try {
      const result = await signIn(formData.email);

      if (result.success) {
        toast({
          title: "OTP Sent!",
          description: result.message,
        });
        setStep('otp');
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOtp()) {
      return;
    }

    try {
      const result = await verifyOTP(formData.email, formData.otp);

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: result.message,
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resendOTP = async () => {
    try {
      const result = await signIn(formData.email);
      if (result.success) {
        toast({
          title: "OTP Resent!",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (step === 'email') {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jonas.khanwald@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`form-input ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full btn-primary text-lg py-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending OTP...
            </>
          ) : (
            'Continue'
          )}
        </Button>

        <div className="text-center">
          <span className="text-muted-foreground">Need an account? </span>
          <button
            type="button"
            onClick={onCreateAccountClick}
            className="text-primary hover:underline font-medium"
          >
            Create one
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="otp" className="text-sm font-medium text-foreground">
            OTP
          </Label>
          <div className="relative">
            <Input
              id="otp"
              type={showOtp ? "text" : "password"}
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              className={`form-input pr-10 ${errors.otp ? 'border-destructive' : ''}`}
              maxLength={6}
            />
            <button
              type="button"
              onClick={() => setShowOtp(!showOtp)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.otp && <p className="text-sm text-destructive mt-1">{errors.otp}</p>}
        </div>

        <button
          type="button"
          onClick={resendOTP}
          className="text-primary hover:underline text-sm"
          disabled={isLoading}
        >
          Resend OTP
        </button>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="keepLoggedIn"
            checked={formData.keepLoggedIn}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, keepLoggedIn: checked as boolean })
            }
          />
          <Label htmlFor="keepLoggedIn" className="text-sm text-muted-foreground">
            Keep me logged in
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full btn-primary text-lg py-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep('email')}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back to email
        </button>
      </div>
    </form>
  );
};