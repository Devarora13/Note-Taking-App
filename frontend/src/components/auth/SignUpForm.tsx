import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';

interface SignUpFormProps {
  onSuccess: () => void;
  onSignInClick: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onSignInClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: undefined as Date | undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, isLoading } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth!.toISOString().split('T')[0],
      });

      if (result.success) {
        toast({
          title: "Success!",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Your Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Jonas Khanwald"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`form-input ${errors.name ? 'border-destructive' : ''}`}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
            Date of Birth
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal form-input ${errors.dateOfBirth ? 'border-destructive' : ''}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
            Creating Account...
          </>
        ) : (
          'Get OTP'
        )}
      </Button>

      <div className="text-center">
        <span className="text-muted-foreground">Already have an account? </span>
        <button
          type="button"
          onClick={onSignInClick}
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};