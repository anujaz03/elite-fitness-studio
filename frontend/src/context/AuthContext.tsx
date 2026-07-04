'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: 'guest' | 'member' | 'trainer' | 'admin' | 'super-admin';
  status: 'active' | 'inactive' | 'suspended';
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('[AuthContext]: Logout request failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (active) {
        checkSession();
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
