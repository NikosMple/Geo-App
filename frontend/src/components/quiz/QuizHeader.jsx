import { Link } from 'react-router-dom';
import Timer from '@/components/ui/Timer';

const QuizHeader = ({ 
  continent, 
  difficulty, 
  minutes, 
  seconds, 
  isRunning, 
  isLowTime, 
  isVeryLowTime, 
  score, 
  totalQuestions,
  gameMode = 'capitals' 
}) => {
  const gameIcons = {
    capitals: '🏛️',
    flags: '🏳️'
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <Link
        to={continent === 'boss' ? `/${gameMode}/choose-continent` : `/${gameMode}/difficulty/${continent}`}
        className="inline-flex items-center gap-2 text-white bg-white/10 border border-white/20 px-6 py-3 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-lg text-base no-underline hover:bg-white/20 hover:-translate-y-1"
      >
        <span className="text-xl">←</span>
        <span>Back to {continent === 'boss' ? 'Continents' : 'Difficulty'}</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Timer 
          minutes={minutes}
          seconds={seconds}
          isRunning={isRunning}
          isLowTime={isLowTime}
          isVeryLowTime={isVeryLowTime}
        />
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-full text-white font-medium">
          <span className="text-emerald-400 font-bold">{score}</span>
          <span className="text-white/70"> / {totalQuestions}</span>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full text-white font-medium">
          <span className="text-xl">{gameIcons[gameMode]}</span>
          <span className="ml-2 capitalize">{continent} - {difficulty}</span>
        </div>
      </div>
    </header>
  );
};

export default QuizHeader;