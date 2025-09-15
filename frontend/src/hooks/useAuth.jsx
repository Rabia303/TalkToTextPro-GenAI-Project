// src/hooks/useAuth.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize axios base URL
  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }, []);

  // Function to set auth token in headers
  const setAuthToken = useCallback((token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, []);

  // Function to set user data
  const setUser = useCallback((user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  // Check for existing token and user on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setAuthToken(token);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If user data is invalid, try to get it from the server
        axios.get('/api/auth/me')
          .then(response => {
            setUser(response.data.user);
          })
          .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuthToken(null);
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      }
      setLoading(false);
    } else if (token) {
      setAuthToken(token);
      // Verify token is still valid and get user data
      axios.get('/api/auth/me')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [setAuthToken, setUser]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [setAuthToken, setUser]);

  const signup = useCallback(async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, [setAuthToken, setUser]);

  const requestPasswordReset = useCallback(async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [setAuthToken, setUser]);

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyOTP,
    setAuthToken,
    setUser
  }), [currentUser, login, signup, logout, requestPasswordReset, resetPassword, verifyOTP, setAuthToken, setUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}