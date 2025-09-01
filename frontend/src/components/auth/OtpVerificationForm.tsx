import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface OtpVerificationFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email,
  onSuccess,
  onBack,
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { verifyOTP, sendOTP, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    try {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        onSuccess();
      } else {
        setError(result.message);
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = "Something went wrong. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resendOTP = async () => {
    try {
      const result = await sendOTP(email);
      if (result.success) {
        toast({
          title: "OTP Resent!",
          description: result.message,
        });
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
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="otp" className="text-sm font-medium text-foreground">
            Enter OTP sent to {email}
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={`form-input text-center text-lg tracking-widest ${error ? 'border-destructive' : ''}`}
            maxLength={6}
            autoFocus
          />
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>

        <div className="text-center">
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

      <Button
        type="submit"
        className="w-full btn-primary text-lg py-6"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify OTP'
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Change email address
        </button>
      </div>
    </form>
  );
};