import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginScreen from './Pages/LoginScreen';
import Dashboard from './Pages/Dashboard';
import ChooseContinent from './Pages/setup/ChooseContinent';
import DifficultyLevels from './Pages/setup/DifficultyLevels';
import CapitalsQuiz from './Pages/quiz/CapitalsQuiz';
import FlagsQuiz from './Pages/quiz/FlagsQuiz';
import Score from './Pages/setup/Score';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* PUBLIC ROUTES - No authentication required */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginScreen />} />
            
            {/* PROTECTED ROUTES - Authentication required */}
            <Route 
              path="/score" 
              element={
                <ProtectedRoute>
                  <Score />
                </ProtectedRoute>
              } 
            />
             
            {/* Capitals Game Routes - All Protected */}
            <Route 
              path="/capitals/choose-continent" 
              element={
                <ProtectedRoute>
                  <ChooseContinent gameMode="capitals" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/capitals/difficulty/:continent" 
              element={
                <ProtectedRoute>
                  <DifficultyLevels gameMode="capitals" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/capitals/:continent/:difficulty" 
              element={
                <ProtectedRoute>
                  <CapitalsQuiz />
                </ProtectedRoute>
              } 
            />
             
            {/* Flags Game Routes - All Protected */}
            <Route 
              path="/flags/choose-continent" 
              element={
                <ProtectedRoute>
                  <ChooseContinent gameMode="flags" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/flags/difficulty/:continent" 
              element={
                <ProtectedRoute>
                  <DifficultyLevels gameMode="flags" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/flags/:continent/:difficulty" 
              element={
                <ProtectedRoute>
                  <FlagsQuiz />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all route */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;