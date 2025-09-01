import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { CalendarIcon, Loader2, Eye, EyeOff } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';

interface AuthFormProps {
  onModeChange?: (mode: 'signup' | 'signin') => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onModeChange }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [showOtpField, setShowOtpField] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: undefined as Date | undefined,
    otp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, signIn, verifyOTP, isLoading } = useAuth();
  const { toast } = useToast();

  // Notify parent of initial mode
  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let result;
      if (mode === 'signup') {
        result = await signUp({
          name: formData.name,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth!.toISOString().split('T')[0],
        });
      } else {
        result = await signIn(formData.email);
      }

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        setShowOtpField(true);
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
    
    if (!validateOTP()) {
      return;
    }

    try {
      const result = await verifyOTP(formData.email, formData.otp);

      if (result.success) {
        toast({
          title: "Welcome!",
          description: result.message,
        });
        // Navigation will be handled by the auth context
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

  return (
    <form onSubmit={showOtpField ? handleOtpSubmit : handleDetailsSubmit} className="space-y-6">
      <div className="space-y-4">
        {mode === 'signup' && (
          <>
            <div className="relative">
              <Label htmlFor="name" className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Jonas Khanwald"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`py-5 ${errors.name ? 'border-destructive' : ''}`}
                disabled={showOtpField}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="relative">
              <Label htmlFor="dateOfBirth" className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10">
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal py-5 ${errors.dateOfBirth ? 'border-destructive' : ''}`}
                    disabled={showOtpField}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {formData.dateOfBirth ? (
                      format(formData.dateOfBirth, "dd MMMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">11 December 1997</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => setFormData({ ...formData, dateOfBirth: date })}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{errors.dateOfBirth}</p>}
            </div>
          </>
        )}

        <div className="relative">
          <Label htmlFor="email" className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jonas.khanwald@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`py-5 ${errors.email ? 'border-destructive' : ''}`}
            disabled={showOtpField}
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div>

        {showOtpField && (
          <div>
            <div className="relative">
              <Label htmlFor="otp" className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10">
                OTP
              </Label>
              <div className="relative">
                <Input
                  id="otp"
                  type={showOtp ? "text" : "password"}
                  placeholder="OTP"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className={`py-5 pr-10 ${errors.otp ? 'border-destructive' : ''}`}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showOtp ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.otp && <p className="text-sm text-destructive mt-2">{errors.otp}</p>}
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={resendOTP}
                className="text-primary hover:underline text-sm"
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full btn-primary text-lg py-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {showOtpField ? 'Verifying...' : mode === 'signup' ? 'Creating Account...' : 'Sending OTP...'}
          </>
        ) : (
          showOtpField ? 'Verify & Continue' : 'Get OTP'
        )}
      </Button>

      <div className="text-center">
        <span className="text-muted-foreground">
          {mode === 'signup' ? 'Already have an account? ' : 'Need an account? '}
        </span>
        <button
          type="button"
          onClick={() => {
            const newMode = mode === 'signup' ? 'signin' : 'signup';
            setMode(newMode);
            setShowOtpField(false);
            setFormData({ name: '', email: '', dateOfBirth: undefined, otp: '' });
            setErrors({});
            onModeChange?.(newMode);
          }}
          className="text-primary hover:underline font-medium underline underline-offset-4"
        >
          {mode === 'signup' ? 'Sign in' : 'Create one'}
        </button>
      </div>
    </form>
  );
};