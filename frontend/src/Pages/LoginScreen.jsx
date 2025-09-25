import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../services/firebase";  // Import auth for testing
import { signInAnonymously } from "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register, loginWithGoogle, loginAsGuest, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from navigation state
  const from = location.state?.from || "/";

  // Enhanced debugging
  console.log("🖥️ LoginScreen Render - User:", user?.email || "No user", "Auth Loading:", authLoading);
  console.log("🖥️ LoginScreen Render - From path:", from);

  // Watch for user changes with immediate navigation
  useEffect(() => {
    console.log('🔄 LoginScreen useEffect - User changed:', user?.email || 'No user');
    console.log('🔄 LoginScreen useEffect - Auth Loading:', authLoading);
    
    if (user && !authLoading) {
      console.log('🚀 LoginScreen - User authenticated, navigating to:', from);
      // Use setTimeout to ensure navigation happens after current render
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 0);
    }
  }, [user, authLoading, navigate, from]);

  const testFirebaseConnection = async () => {
    console.log('🔧 Testing Firebase connection...');
    console.log('Auth instance:', auth);
    console.log('Current user:', auth.currentUser);
    console.log('Firebase config check:', {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing',
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
    });
    
    try {
      console.log('🔧 Attempting anonymous sign-in...');
      const result = await signInAnonymously(auth);
      console.log('✅ Firebase connection works! User:', result.user.uid);
      
      // Clean up - sign out the anonymous user
      await auth.signOut();
      console.log('🔧 Anonymous user signed out');
    } catch (err) {
      console.error('❌ Firebase connection failed:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error("Display name is required");
        }
        await register(email, password, displayName.trim());
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    console.log('🚀 LoginScreen - Starting Google login...');
    
    try {
      await loginWithGoogle();
      console.log('⚠️ LoginScreen - This should not execute (redirect should happen)');
    } catch (err) {
      console.error('❌ LoginScreen - Google login error:', err);
      setError(err.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginAsGuest();
    } catch (err) {
      setError(err.message || "Guest login failed");
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🌍 Geography Master
          </h1>
          <p className="text-white/70">
            {isSignUp ? "Create your account" : "Welcome back!"}
          </p>

          {/* Show intended destination if redirected */}
          {from !== "/" && (
            <div className="mt-3 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-blue-200 text-sm">
                🎯 Sign in to continue to your quiz
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading || authLoading}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading || authLoading ? 'Loading...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-transparent px-2 text-white/50">Or</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                placeholder="Your name"
                required
                disabled={loading || authLoading}
              />
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="your.email@example.com"
              required
              disabled={loading || authLoading}
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="••••••••"
              required
              disabled={loading || authLoading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </span>
            ) : (
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
            )}
          </button>
        </form>

        {/* Guest Login */}
        <div className="mt-4">
          <button
            onClick={handleGuestLogin}
            disabled={loading || authLoading}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white/80 font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as Guest
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-white/70">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={toggleMode}
              disabled={loading || authLoading}
              className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            disabled={loading || authLoading}
            className="text-white/50 hover:text-white/70 text-sm disabled:opacity-50"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;