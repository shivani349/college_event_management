import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await authService.getCurrentUser();
        setCurrentUser(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      localStorage.setItem('token', response.data.token);
      
      // Get user data
      const userResponse = await authService.getCurrentUser();
      setCurrentUser(userResponse.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.data.token);
      
      // Get user data
      const userResponse = await authService.getCurrentUser();
      setCurrentUser(userResponse.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;