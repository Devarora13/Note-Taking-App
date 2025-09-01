import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; message: string }>;
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string; user?: User; token?: string }>;
  signIn: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const signUp = async (userData: Omit<User, 'id'>): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      await authAPI.requestOTP({
        name: userData.name,
        email: userData.email,
        dob: userData.dateOfBirth,
        mode: 'signup'
      });

      // Store user data temporarily for OTP verification
      localStorage.setItem('tempUserData', JSON.stringify(userData));

      setIsLoading(false);
      return { success: true, message: 'OTP sent to your email. Please verify to complete signup.' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      await authAPI.requestOTP({
        email,
        mode: 'login'
      });

      setIsLoading(false);
      return { success: true, message: `OTP sent to ${email}` };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> => {
    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otp);

      // Extract user and token from response
      const { user: userData, token: authToken, message } = response;

      if (authToken && userData) {
        // Store auth data
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          dateOfBirth: userData.dob
        }));
        localStorage.removeItem('tempUserData');

        // Update state
        setToken(authToken);
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          dateOfBirth: userData.dob
        });
        setIsAuthenticated(true);
      }

      setIsLoading(false);
      return { 
        success: true, 
        message: message || 'OTP verified successfully', 
        user: userData ? {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          dateOfBirth: userData.dob
        } : undefined,
        token: authToken 
      };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const signIn = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      await authAPI.requestOTP({
        email,
        mode: 'login'
      });

      setIsLoading(false);
      return { success: true, message: `OTP sent to ${email}` };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tempUserData');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    token,
    isLoading,
    signUp,
    sendOTP,
    verifyOTP,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
