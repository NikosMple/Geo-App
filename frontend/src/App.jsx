import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './Pages/Dashboard'
import ChooseContinent from './Pages/ChooseContinent';
import CapitalsQuiz from './Pages/CapitalsQuiz';
import DifficultyLevels from './Pages/DifficultyLevels';
import ScorePage from './Pages/Score';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/choose-continent" element={<ChooseContinent />} />
          <Route path="/difficulty/:continent" element={<DifficultyLevels />} />
          <Route path="/quiz/capitals/:continent/:difficulty" element={<CapitalsQuiz />} />
          <Route path="/score" element={<ScorePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;