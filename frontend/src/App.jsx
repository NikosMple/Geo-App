import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages
import LoginScreen from './Pages/LoginScreen';
import Dashboard from './Pages/Dashboard';
import ChooseContinent from './Pages/setup/ChooseContinent';
import DifficultyLevels from './Pages/setup/DifficultyLevels';
import CapitalsQuiz from './Pages/quiz/CapitalsQuiz';
import FlagsQuiz from './Pages/quiz/FlagsQuiz';
import Score from './Pages/setup/Score';``

// // Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
      <p className="text-white text-xl">Loading Geography Quiz...</p>
    </div>
  </div>
);

// Protected routes component
const ProtectedRoutes = () => {
  // const { user, loading } = useAuth();

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  // if (!user) {
  //   return <LoginScreen />;
  // }

  return (
    <Routes>
      {/* Main & Score Routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/score" element={<Score />} />
       
      {/* Capitals Game Routes */}
      <Route path="/capitals/choose-continent" element={<ChooseContinent gameMode="capitals" />} />
      <Route path="/capitals/difficulty/:continent" element={<DifficultyLevels gameMode="capitals" />} />
      <Route path="/quiz/capitals/:continent/:difficulty" element={<CapitalsQuiz />} />
       
      {/* Flags Game Routes */}
      <Route path="/flags/choose-continent" element={<ChooseContinent gameMode="flags" />} />
      <Route path="/flags/difficulty/:continent" element={<DifficultyLevels gameMode="flags" />} />
      <Route path="/quiz/flags/:continent/:difficulty" element={<FlagsQuiz />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ProtectedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;