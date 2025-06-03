import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './components/Dashboard.jsx'
import Capitals from './components/Capitals.jsx'

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/choose-continent' element={<Capitals />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;