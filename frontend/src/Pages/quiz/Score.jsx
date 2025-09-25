import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LaunchButton from '@/components/ui/LaunchButton';

const Score = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    score = 0,
    totalQuestions = 10,
    continent = 'world',
    difficulty = 'normal',
    gameMode = 'capitals'
  } = location.state || {};

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This timeout ensures the score circle animation is visible
    // and gives the main card time to fully appear.
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100); // Small delay to trigger the main card's opacity/transform transition

    return () => clearTimeout(timer);
  }, []);

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getScoreMessage = () => {
    if (percentage === 100) return { text: "Perfect Score! You're a geography master!", color: "text-emerald-400" };
    if (percentage >= 80) return { text: "Excellent! You really know your stuff.", color: "text-blue-400" };
    if (percentage >= 60) return { text: "Great job! A very respectable score.", color: "text-yellow-400" };
    if (percentage >= 40) return { text: "Good effort! Keep practicing.", color: "text-orange-400" };
    return { text: "Keep learning! Every master starts somewhere.", color: "text-red-400" };
  };

  // New function to dynamically set the circle stroke color
  const getCircleColorClass = () => {
    if (percentage === 100) return "text-emerald-400";
    if (percentage >= 80) return "text-blue-400";
    if (percentage >= 60) return "text-yellow-400";
    if (percentage >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const scoreMessage = getScoreMessage();
  const circleColorClass = getCircleColorClass(); // Get the dynamic color class
  const strokeDashoffset = 283 * (1 - percentage / 100);

  return (
    <div className={`app-background min-h-screen ${mounted ? 'mounted' : ''}`}>
      <div className="bg-decoration">
        {/* Removed animate-spin-slow */}
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          {/* Removed animate-pulse-slow and animation-delay */}
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-8 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <div
          // Card still has a simple fade-in and slide-up transition
          className={`w-full bg-white/5 backdrop-blur-3xl border-2 border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-black/30 transition-all duration-700 ease-out
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >

          {/* Quiz Complete Heading */}
          <div className="mb-8">
            {/* Removed animate-fade-in-up */}
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text mb-3">
              Quiz Complete!
            </h1>
            {/* Removed animate-fade-in animation-delay-300 */}
            <p className={`text-lg sm:text-xl font-semibold ${scoreMessage.color}`}>
              {scoreMessage.text}
            </p>
          </div>

          {/* Circular Score Display */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-8 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-white/10"
                stroke="currentColor"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
              <circle
                // Dynamic color applied here, animation is purely on strokeDashoffset
                className={`${circleColorClass} transition-all duration-1000 ease-out`}
                stroke="currentColor"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={mounted ? strokeDashoffset : 283} // Animated on mount
                transform="rotate(-90 50 50)"
              />
            </svg>
            {/* Removed animate-pop-in animation-delay-500 */}
            <div className="flex flex-col">
              <span className="text-5xl sm:text-6xl font-black text-white">
                {score}
                <span className="text-3xl sm:text-4xl text-white/50">/{totalQuestions}</span>
              </span>
              <span className="text-lg sm:text-xl font-medium text-white/70 mt-1">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {/* Continent Card */}
            {/* Removed animate-fade-in-up animation-delay-600 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-blue-400/30">
              <p className="text-sm text-white/60 uppercase tracking-wider">Continent</p>
              <p className="text-lg font-bold text-white capitalize">{continent}</p>
            </div>
            {/* Difficulty Card */}
            {/* Removed animate-fade-in-up animation-delay-700 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-yellow-400/30">
              <p className="text-sm text-white/60 uppercase tracking-wider">Difficulty</p>
              <p className="text-lg font-bold text-white capitalize">{difficulty}</p>
            </div>
            {/* Correct Score Card */}
            {/* Removed animate-fade-in-up animation-delay-800 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-emerald-400/30">
              <p className="text-sm text-white/60 uppercase tracking-wider">Correct</p>
              <p className="text-lg font-bold text-emerald-400">{score}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {/* Removed animate-fade-in-up animation-delay-900 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LaunchButton
              text="Try Again"
              variant="info"
              onClick={() => navigate(`/quiz/${gameMode}/${continent}/${difficulty}`)}
            />
            {continent !== 'boss' && (
              <LaunchButton
                text="Change Difficulty"
                variant="dark"
                onClick={() => navigate(`/${gameMode}/difficulty/${continent}`)}
              />
            )}
            <LaunchButton
              text="New Game"
              variant="purple"
              onClick={() => navigate('/')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;