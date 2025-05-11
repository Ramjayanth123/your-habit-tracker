import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getItem, setItem, removeItem } from '@/lib/local-storage';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = getItem<User | null>('user', null);
    const token = getItem<string | null>('auth_token', null);
    if (storedUser && token) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profileError) throw profileError;
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        name: profileData.name,
        createdAt: data.user.created_at,
      };
      setUser(userObj);
      setItem('user', userObj);
      setItem('auth_token', data.session.access_token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // 1. Sign up user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      // 2. Create profile in 'profiles' table
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: name || user.email?.split('@')[0],
          });
        if (profileError) throw profileError;
      }
      toast.success('Account created successfully. Please check your email to confirm your account.');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Signup failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    removeItem('user');
    removeItem('auth_token');
    removeItem('refresh_token');
    setUser(null);
    toast.info('Logged out successfully');
    navigate('/login');
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error: any) {
      toast.error(`Password reset failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user');
      const { error } = await supabase
        .from('profiles')
        .update({ name: data.name, email: data.email })
        .eq('id', user.id);
      if (error) throw error;
      const updatedUser = { ...user, ...data } as User;
      setItem('user', updatedUser);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Profile update failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
