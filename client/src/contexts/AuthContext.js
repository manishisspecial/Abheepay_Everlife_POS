import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userType) => {
    try {
      const response = await authAPI.login(email, password, userType);
      const { token, user: userData } = response;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response;
      
      localStorage.setItem('token', token);
      setUser(newUser);
      
      toast.success('Registration successful!');
      return newUser;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Password change failed');
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Profile update failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 