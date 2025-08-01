import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './Pages/Dashboard';
import ChooseContinent from './Pages/ChooseContinent';
import CapitalsQuiz from './Pages/CapitalsQuiz';
import FlagsQuiz from './Pages/FlagsQuiz';
import DifficultyLevels from './Pages/DifficultyLevels';
import ScorePage from './Pages/Score';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main & Score Routes */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/score" element={<ScorePage />} />

          {/* Capitals Game Routes */}
          <Route path="/capitals/choose-continent" element={<ChooseContinent gameMode="capitals" />} />
          <Route path="/capitals/difficulty/:continent" element={<DifficultyLevels gameMode="capitals" />} />
          <Route path="/quiz/capitals/:continent/:difficulty" element={<CapitalsQuiz />} />

          {/* Flags Game Routes */}
          <Route path="/flags/choose-continent" element={<ChooseContinent gameMode="flags" />} />
          <Route path="/flags/difficulty/:continent" element={<DifficultyLevels gameMode="flags" />} />
          <Route path="/quiz/flags/:continent/:difficulty" element={<FlagsQuiz />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;