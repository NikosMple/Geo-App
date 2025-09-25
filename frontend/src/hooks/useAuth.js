import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  registerUser,
  loginUser,
  loginAnonymously,
  logoutUser,
  onAuthStateChange,
  getUserProfile,
  loginWithGoogle as firebaseLoginWithGoogle,
} from '@/services/firebaseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    console.log('🔄 Initializing auth system (popup flow)...');

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (!mounted) return;

      console.log('🔥 Auth state changed:', firebaseUser?.email || firebaseUser?.uid || 'No user');
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          console.log('👤 Fetching user profile for:', firebaseUser.uid);

          if (mounted) {
            setUser(firebaseUser);
            setUserProfile(null);
          }

          const profile = await getUserProfile(firebaseUser.uid);

          if (mounted) {
            setUserProfile(profile);
          }
        } catch (err) {
          console.error('❌ Error fetching user profile:', err);
          if (mounted) {
            setError(err.message || 'Failed to load profile');
            setUser(firebaseUser);
            setUserProfile(null);
          }
        }
      } else {
        console.log('🚫 No user - clearing state');
        if (mounted) {
          setUser(null);
          setUserProfile(null);
        }
      }

      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📝 Registering user:', email);
      const user = await registerUser(email, password, displayName);
      return user;
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔐 Logging in user:', email);
      const user = await loginUser(email, password);
      return user;
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('👤 Logging in as guest...');
      const user = await loginAnonymously();
      return user;
    } catch (err) {
      console.error('❌ Guest login error:', err);
      setError(err.message || 'Guest login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('🚀 Starting Google popup authentication...');
      await firebaseLoginWithGoogle();
      // popup resolves and auth state listener will pick up the user
    } catch (err) {
      console.error('❌ Google login error:', err);
      setError(err.message || 'Google sign-in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚪 Logging out user...');
      await logoutUser();
      console.log('✅ User logged out');
    } catch (err) {
      console.error('❌ Logout error:', err);
      setError(err.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    userProfile,
    loading,
    error,
    register,
    login,
    loginAsGuest,
    loginWithGoogle,
    logout,
    clearError,
    isAuthenticated: !!user,
    isAnonymous: user?.isAnonymous || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
