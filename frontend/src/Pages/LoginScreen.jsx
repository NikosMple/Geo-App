import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft } from "lucide-react";
import "@/styles/index.css";

import { useAuth } from "@/hooks/useAuth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    login,
    register,
    loginWithGoogle,
    loginAsGuest,
    user,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) throw new Error("Display name is required");
        await register(email, password, displayName.trim());
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 sm:p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10 bg-white/5 border border-white/10">
        {/* Left Branding */}
        <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden">
          <img
            src="/3d-rendering-planet-earth.jpg"
            alt="Earth"
            className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-blue-900/50 to-emerald-800/60 animate-gradient-shift" />

          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Geography Master
            </h1>
            <p className="text-white/80 mt-4 text-lg">
              Sharpen your knowledge, conquer the quiz.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-12 bg-slate-900/60 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <button
            onClick={loginWithGoogle}
            disabled={loading || authLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 px-4 rounded-lg shadow hover:bg-gray-200 transition-all duration-300 mb-6 transform hover:scale-102"
          >
            <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-emerald-800 transition-opacity duration-700 ease-out ${
                  imageLoaded ? "opacity-0" : "opacity-100 animate-pulse"
                }`}
              />

              <img
                src="/3d-rendering-planet-earth.jpg"
                alt="Earth"
                onLoad={() => setImageLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-[2000ms] ease-out
      ${
        imageLoaded
          ? "opacity-100 scale-100 animate-slow-zoom"
          : "opacity-0 scale-105"
      }`}
              />
            </div>

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>
              {loading || authLoading ? "Loading..." : "Continue with Google"}
            </span>
          </button>

          <div className="relative mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-800 px-3 text-white/50 text-sm">
                Or
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative animate-fade-in">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-shadow duration-300"
                  disabled={loading || authLoading}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-shadow duration-300"
                disabled={loading || authLoading}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-shadow duration-300"
                disabled={loading || authLoading}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
            </button>
          </form>

          <button
            onClick={loginAsGuest}
            disabled={loading || authLoading}
            className="mt-4 w-full py-2 px-4 rounded-lg border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-colors duration-300 disabled:opacity-50"
          >
            Continue as Guest
          </button>

          <p className="mt-6 text-center text-white/70">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              disabled={loading || authLoading}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-white/50 hover:text-white/70 text-sm flex items-center gap-1 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
