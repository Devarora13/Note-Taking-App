import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// Mock API calls - replace with actual backend later
const signUp = async (userData: Omit<User, 'id'>): Promise<{ success: boolean; message: string }> => {
setIsLoading(true);

// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 1000));

try {
// Mock validation
if (!userData.name.trim()) {
throw new Error('Name is required');
}
if (!userData.email.includes('@')) {
throw new Error('Invalid email format');
}
if (!userData.dateOfBirth) {
throw new Error('Date of birth is required');
}

// Store user data temporarily for OTP verification
localStorage.setItem('tempUserData', JSON.stringify(userData));

setIsLoading(false);
return { success: true, message: 'Account created successfully. Please verify your email.' };
} catch (error) {
setIsLoading(false);
return { success: false, message: (error as Error).message };
}
};

const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
setIsLoading(true);

await new Promise(resolve => setTimeout(resolve, 800));

try {
if (!email.includes('@')) {
throw new Error('Invalid email format');
}

// Mock OTP generation (in real app, this would be sent via email)
const mockOTP = '123456';
localStorage.setItem('mockOTP', mockOTP);
localStorage.setItem('otpEmail', email);

setIsLoading(false);
return { success: true, message: `OTP sent to ${email}. Use 123456 for demo.` };
} catch (error) {
setIsLoading(false);
return { success: false, message: (error as Error).message };
}
};

const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> => {
setIsLoading(true);

await new Promise(resolve => setTimeout(resolve, 1000));

try {
const storedOTP = localStorage.getItem('mockOTP');
const storedEmail = localStorage.getItem('otpEmail');

if (!storedOTP || !storedEmail) {
throw new Error('No OTP session found. Please request a new OTP.');
}

if (email !== storedEmail) {
throw new Error('Email mismatch. Please use the same email you used to request OTP.');
}

if (otp !== storedOTP) {
throw new Error('Invalid OTP. Please try again.');
}

// Get user data
const tempUserData = localStorage.getItem('tempUserData');
let userObj: User;

if (tempUserData) {
// New signup flow
const userData = JSON.parse(tempUserData);
userObj = {
id: Date.now().toString(),
...userData,
};
localStorage.removeItem('tempUserData');
} else {
// Existing user sign in
const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
const existingUser = existingUsers.find((u: User) => u.email === email);

if (!existingUser) {
throw new Error('No account found with this email.');
}

userObj = existingUser;
}

// Generate mock JWT token
const newToken = `mock_jwt_${userObj.id}_${Date.now()}`;

// Store user in local storage (simulate database)
const users = JSON.parse(localStorage.getItem('users') || '[]');
const userIndex = users.findIndex((u: User) => u.email === userObj.email);
if (userIndex === -1) {
users.push(userObj);
} else {
users[userIndex] = userObj;
}
localStorage.setItem('users', JSON.stringify(users));
localStorage.setItem('token', newToken);

// Clean up OTP data
localStorage.removeItem('mockOTP');
localStorage.removeItem('otpEmail');

setUser(userObj);
setToken(newToken);
setIsAuthenticated(true);
setIsLoading(false);

return { success: true, message: 'Successfully signed in!', user: userObj, token: newToken };
} catch (error) {
setIsLoading(false);
return { success: false, message: (error as Error).message };
}
};

const signIn = async (email: string): Promise<{ success: boolean; message: string }> => {
setIsLoading(true);

await new Promise(resolve => setTimeout(resolve, 800));

try {
if (!email.includes('@')) {
throw new Error('Invalid email format');
}

// Check if user exists
const users = JSON.parse(localStorage.getItem('users') || '[]');
const existingUser = users.find((u: User) => u.email === email);

if (!existingUser) {
throw new Error('No account found with this email. Please sign up first.');
}

// Send OTP for existing user
const mockOTP = '123456';
localStorage.setItem('mockOTP', mockOTP);
localStorage.setItem('otpEmail', email);

setIsLoading(false);
return { success: true, message: `OTP sent to ${email}. Use 123456 for demo.` };
} catch (error) {
setIsLoading(false);
return { success: false, message: (error as Error).message };
}
};

const logout = () => {
localStorage.removeItem('token');
setUser(null);
setToken(null);
setIsAuthenticated(false);
setIsLoading(false);
};

// Initialize auth state from localStorage on app start
React.useEffect(() => {
const storedToken = localStorage.getItem('token');
if (storedToken && storedToken.startsWith('mock_jwt_')) {
const userId = storedToken.split('_')[2];
const users = JSON.parse(localStorage.getItem('users') || '[]');
const storedUser = users.find((u: User) => u.id === userId);

if (storedUser) {
setUser(storedUser);
setToken(storedToken);
setIsAuthenticated(true);
} else {
logout();
}
}
}, []);

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