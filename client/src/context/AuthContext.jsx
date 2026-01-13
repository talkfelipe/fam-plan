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
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Restore user data from localStorage
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      setUser(data.user);
      // Store user data in localStorage to persist across refreshes
      localStorage.setItem('user', JSON.stringify(data.user));
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
      // Store user data in localStorage to persist across refreshes
      localStorage.setItem('user', JSON.stringify(data.user));
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
      // Clear user data from localStorage
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local data even if API call fails
      setUser(null);
      localStorage.removeItem('user');
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
