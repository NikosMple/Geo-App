import { useState, useEffect, useContext, createContext } from 'react';
import {
  registerUser,
  loginUser,
  loginAnonymously,
  logoutUser,
  onAuthStateChange,
  getUserProfile,
  loginWithGoogle as firebaseLoginWithGoogle,
  handleGoogleRedirectResult 
} from '../services/firebaseService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('🔄 Initializing auth system...');
      
      // First set up the auth state listener
      const unsubscribe = onAuthStateChange(async (firebaseUser) => {
        if (!mounted) return;
        
        console.log('🔥 Auth state changed:', firebaseUser?.email || firebaseUser?.uid || 'No user');
        setLoading(true);
        setError(null);

        if (firebaseUser) {
          try {
            console.log('👤 Fetching user profile for:', firebaseUser.uid);
            
            // Set user immediately, then try to get profile
            if (mounted) {
              setUser(firebaseUser);
              setUserProfile(null); // Clear previous profile
            }
            
            const profile = await getUserProfile(firebaseUser.uid);
            console.log('✅ User profile fetched:', profile?.displayName || 'No profile found');
            
            if (mounted) {
              setUserProfile(profile);
            }
          } catch (err) {
            console.error('❌ Error fetching user profile:', err);
            if (mounted) {
              setError(err.message);
              // Still set the user even if profile fetch fails
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
        
        if (mounted) {
          setLoading(false);
        }
      });

      // Then handle any pending redirect result
      try {
        console.log('🔍 Checking for Google redirect result...');
        const redirectResult = await handleGoogleRedirectResult();
        if (redirectResult) {
          console.log('🎉 Google redirect result found:', redirectResult.email);
        } else {
          console.log('ℹ️ No pending redirect result');
        }
      } catch (err) {
        console.error('❌ Error handling Google redirect result:', err);
        if (mounted) {
          setError(err.message);
        }
      }

      return unsubscribe;
    };

    let unsubscribe;
    initializeAuth().then(unsub => {
      unsubscribe = unsub;
    });

    // Cleanup function
    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📝 Registering user:', email);
      const user = await registerUser(email, password, displayName);
      console.log('✅ User registered:', user.email);
      return user;
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.message);
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
      console.log('✅ User logged in:', user.email);
      return user;
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message);
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
      console.log('✅ Guest logged in:', user.uid);
      return user;
    } catch (err) {
      console.error('❌ Guest login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      console.log('🚀 Starting Google redirect authentication...');
      await firebaseLoginWithGoogle();
      console.log('⚠️ This line should never execute - redirect should happen above');
    } catch (err) {
      console.error('❌ Google login error:', err);
      setError(err.message);
      throw err;
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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

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
    isAnonymous: user?.isAnonymous || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};