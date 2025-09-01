import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { authAPI } from "../../services/api";
import { Loader2, Eye, EyeOff, CalendarIcon } from "lucide-react";

interface AuthFormProps {
  onModeChange?: (mode: "signup" | "signin") => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onModeChange }) => {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: undefined as Date | undefined,
    otp: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, signIn, verifyOTP, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "signup") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
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
      if (mode === "signup") {
        result = await signUp({
          name: formData.name,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth!.toISOString().split("T")[0],
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
    <form
      onSubmit={showOtpField ? handleOtpSubmit : handleDetailsSubmit}
      className="space-y-6"
    >
      <div className="space-y-4">
        {mode === "signup" && (
          <>
            <div className="relative">
              <Label
                htmlFor="name"
                className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10"
              >
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Jonas Khanwald"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`py-5 ${errors.name ? "border-destructive" : ""}`}
                disabled={showOtpField}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div className="relative">
              <Label
                htmlFor="dateOfBirth"
                className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10"
              >
                Date of Birth
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={
                    formData.dateOfBirth
                      ? formData.dateOfBirth.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const dateValue = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    setFormData({ ...formData, dateOfBirth: dateValue });
                  }}
                  className={`py-5 pl-10 ${
                    errors.dateOfBirth ? "border-destructive" : ""
                  } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                  disabled={showOtpField}
                  max={new Date().toISOString().split("T")[0]}
                  min="1900-01-01"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive mt-1">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>
          </>
        )}

        <div className="relative">
          <Label
            htmlFor="email"
            className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jonas.khanwald@gmail.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`py-5 ${errors.email ? "border-destructive" : ""}`}
            disabled={showOtpField}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {showOtpField && (
          <div>
            <div className="relative">
              <Label
                htmlFor="otp"
                className="absolute -top-2 left-3 bg-background px-1 text-xs font-medium text-muted-foreground z-10"
              >
                OTP
              </Label>
              <div className="relative">
                <Input
                  id="otp"
                  type={showOtp ? "text" : "password"}
                  placeholder="OTP"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  className={`py-5 pr-10 ${
                    errors.otp ? "border-destructive" : ""
                  }`}
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
              {errors.otp && (
                <p className="text-sm text-destructive mt-2">{errors.otp}</p>
              )}
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
            {showOtpField
              ? "Verifying..."
              : mode === "signup"
              ? "Creating Account..."
              : "Sending OTP..."}
          </>
        ) : showOtpField ? (
          "Verify & Continue"
        ) : (
          "Get OTP"
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full py-6 text-lg"
        onClick={() => authAPI.initiateGoogleAuth()}
        disabled={isLoading}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="text-center">
        <span className="text-muted-foreground">
          {mode === "signup"
            ? "Already have an account? "
            : "Need an account? "}
        </span>
        <button
          type="button"
          onClick={() => {
            const newMode = mode === "signup" ? "signin" : "signup";
            setMode(newMode);
            setShowOtpField(false);
            setFormData({
              name: "",
              email: "",
              dateOfBirth: undefined,
              otp: "",
            });
            setErrors({});
            onModeChange?.(newMode);
          }}
          className="text-primary hover:underline font-medium underline underline-offset-4"
        >
          {mode === "signup" ? "Sign in" : "Create one"}
        </button>
      </div>
    </form>
  );
};
