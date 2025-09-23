import { useState, useEffect } from 'react';
import { onAuthStateChange, loginAnonymously, logoutUser } from '../services/firebaseService';

const FirebaseTest = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'User logged out');
    });

    return () => unsubscribe();
  }, []);

  const handleAnonymousLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginAnonymously();
      console.log('Anonymous login successful!');
    } catch (err) {
      setError(err.message);
      console.error('Anonymous login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logoutUser();
      console.log('Logout successful!');
    } catch (err) {
      setError(err.message);
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 rounded-lg">
        <p>Loading Firebase connection...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">🔥 Firebase Connection Test</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {user ? (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p><strong>✅ Connected to Firebase!</strong></p>
            <p><strong>User ID:</strong> {user.uid}</p>
            <p><strong>Email:</strong> {user.email || 'Anonymous'}</p>
            <p><strong>Display Name:</strong> {user.displayName || 'Guest User'}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
            <p>Not connected to Firebase</p>
          </div>
          
          <button 
            onClick={handleAnonymousLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Test Anonymous Login'}
          </button>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Project ID:</strong> geo-app-50f28</p>
        <p><strong>Auth Domain:</strong> geo-app-50f28.firebaseapp.com</p>
      </div>
    </div>
  );
};

export default FirebaseTest;