import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './Pages/Dashboard'
import ChooseContinent from './Pages/ChooseContinent';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/choose-continent" element={<ChooseContinent />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;