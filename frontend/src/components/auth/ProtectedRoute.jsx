import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Loading component - FIXED: Added return statement
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/70 text-lg">Loading...</p>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  //console.log('🛡️ ProtectedRoute - Loading:', loading, 'User:', user?.email || 'No user');

  // Show loading while checking auth status
  if (loading) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('🚫 ProtectedRoute - Redirecting to login, from:', location.pathname);
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // User is authenticated, render the protected component
  //console.log('✅ ProtectedRoute - User authenticated, rendering children');
  return children;
};

export default ProtectedRoute;