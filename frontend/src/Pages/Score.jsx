import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Score = () => {
  const location = useLocation();
  const { score, totalQuestions, continent, difficulty } = location.state || {};

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className={`app-background min-h-screen ${mounted ? 'mounted' : ''}`}>
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="relative z-10 p-8 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete! 🎉</h1>
          <p className="text-2xl text-white/80 mb-2">Your Score:</p>
          <p className="text-6xl font-black text-emerald-400 mb-6">
            {score}/{totalQuestions}
          </p>
          <p className="text-xl text-white/70 mb-8">
            {percentage}% Correct
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={`/quiz/capitals/${continent}/${difficulty}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 no-underline"
            >
              Try Again
            </Link>
            <Link 
              to={`/difficulty/${continent}`}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 no-underline"
            >
              Choose Difficulty
            </Link>
            <Link 
              to="/"
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 no-underline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
