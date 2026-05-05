import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'seeker' | 'recruiter' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (data: any) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage');
      }
    }
  }, []);

  const handleAuthSuccess = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (credentials: any): Promise<User> => {
    const response = await authAPI.login(credentials);
    const { user: userData, access_token } = response.data.data;
    handleAuthSuccess(userData, access_token);
    return userData;
  };

  const register = async (userData: any): Promise<User> => {
    const response = await authAPI.register(userData);
    const { user: newUser, access_token } = response.data.data;
    handleAuthSuccess(newUser, access_token);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
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
