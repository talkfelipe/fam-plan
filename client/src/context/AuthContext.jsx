import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use auth context
// This makes it easy to access auth data in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Provider component that wraps your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could validate the token here by making an API call
      // For now, we'll just check if it exists
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const data = await authAPI.signup(userData);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Value that will be accessible to all components
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
