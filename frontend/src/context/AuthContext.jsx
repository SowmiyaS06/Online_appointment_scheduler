import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage on authentication error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user: userData, token } = response.data.data;
      
      // Ensure role is included in user data
      const userWithRole = {
        ...userData,
        role: userData.role || 'patient'  // Default to patient if no role is provided
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      setUser(userWithRole);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (name, email, password, role = 'patient') => {
    try {
      const response = await axios.post('/auth/register', { 
        name, 
        email, 
        password, 
        role 
      });
      const { user: userData, token } = response.data.data;
      
      // Ensure role is included in user data
      const userWithRole = {
        ...userData,
        role: userData.role || role  // Use provided role or default to patient
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      setUser(userWithRole);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Google login callback
  const handleGoogleCallback = (token, userData) => {
    try {
      // Ensure role is included in user data
      const userWithRole = {
        ...userData,
        role: userData.role || 'patient'  // Default to patient if no role is provided
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      setUser(userWithRole);
      setIsAuthenticated(true);
      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Google callback error:', error);
      return { success: false, message: 'Google login failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    handleGoogleCallback,
    hasRole,
    hasAnyRole,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};