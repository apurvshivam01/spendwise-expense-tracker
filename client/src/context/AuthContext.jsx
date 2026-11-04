import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('spendwise_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('spendwise_token') || null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          localStorage.setItem('spendwise_user', JSON.stringify(res.user));
          if (res.user.currency) {
            localStorage.setItem('spendwise_currency', res.user.currency);
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('spendwise_token', res.token);
      localStorage.setItem('spendwise_user', JSON.stringify(res.user));
      if (res.user.currency) {
        localStorage.setItem('spendwise_currency', res.user.currency);
      }
      toast.success(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password, currency, populateDemo = false) => {
    try {
      const res = await api.register({ name, email, password, currency, populateDemo });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('spendwise_token', res.token);
      localStorage.setItem('spendwise_user', JSON.stringify(res.user));
      if (res.user.currency) {
        localStorage.setItem('spendwise_currency', res.user.currency);
      }
      toast.success('Account created successfully!');
      return res.user;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('spendwise_token');
    localStorage.removeItem('spendwise_user');
    toast.info('You have been logged out');
  };

  const updateUserProfile = async (data) => {
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
      localStorage.setItem('spendwise_user', JSON.stringify(res.user));
      if (res.user.currency) {
        localStorage.setItem('spendwise_currency', res.user.currency);
      }
      toast.success('Profile updated successfully');
      return res.user;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
