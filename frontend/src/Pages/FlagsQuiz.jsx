import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import api from '../services/api';
import Timer from '../components/Timer';

const FlagsQuiz = () => {
  const { continent, difficulty } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const getTimerExpiry = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 10);
    return time;
  };

  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: getTimerExpiry(),
    onExpire: () => {
      handleTimeExpired();
    }
  });

  const handleTimeExpired = async () => {
    if (selectedAnswer !== null) return;
    
    pause();
    setSelectedAnswer('TIME_EXPIRED');
    
    try {
      const result = await api.checkFlagAnswer(continent, currentQuestion.country_code, null);
      setCorrectAnswer(result.correctAnswer);
    } catch (error) {
      console.error('Error getting correct answer after time expiry:', error);
      setCorrectAnswer(currentQuestion.answer);
    } finally {
      setIsRevealed(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    api.getFlagsQuizQuestions(continent, difficulty)
      .then(data => {
        if (data.length === 0) {
          setError(`No questions found for ${continent} - ${difficulty}`);
        } else {
          setQuestions(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to load questions: ${err.message}`);
        setLoading(false);
      });
  }, [continent, difficulty]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && questions.length > 0 && currentQuestionIndex < questions.length && !selectedAnswer) {
      const newExpiry = getTimerExpiry();
      restart(newExpiry);
      setTimerKey(prev => prev + 1);
    }
  }, [currentQuestionIndex, loading, questions.length, restart, selectedAnswer]);

  const handleAnswerSelect = async (answer) => {
    if (selectedAnswer !== null) return;
    
    pause();
    setSelectedAnswer(answer);
    
    try {
      const result = await api.checkFlagAnswer(continent, currentQuestion.country_code, answer);
      
      if (result.isCorrect) {
        setScore(score + 1);
      }
      
      setCorrectAnswer(result.correctAnswer);
      
    } catch (error) {
      console.error("Error checking answer:", error);
      setCorrectAnswer(currentQuestion.answer);
    } finally {
      setIsRevealed(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setIsRevealed(false);
    } else {
      pause();
      navigate('/score', { 
        state: { 
          score: score, 
          totalQuestions: questions.length, 
          continent, 
          difficulty,
          gameMode: 'flags' // Pass gameMode to score page
        } 
      });
    }
  };

  const timeLeft = minutes * 60 + seconds;
  const isLowTime = timeLeft <= 10;
  const isVeryLowTime = timeLeft <= 5;

  if (loading) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Flag Quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-6">{error}</p>
          <Link 
            to={`/flags/difficulty/${continent}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 no-underline"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

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
      
      <div className="relative z-10 p-6 sm:p-8 max-w-4xl mx-auto min-h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <Link
          to={continent === 'boss' ? '/flags/choose-continent' : `/flags/difficulty/${continent}`}
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
              <span className="text-white/70"> / {questions.length}</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full text-white font-medium">
              <span className="text-xl">🏳️</span>
              <span className="ml-2 capitalize">{continent} - {difficulty}</span>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Progress</span>
            <span className="text-white/70 text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Which country does this flag belong to?
              </h2>
              {currentQuestion?.country_code && (
                <img 
                  src={`https://flagsapi.com/${currentQuestion.country_code}/shiny/64.png`} 
                  alt="Country Flag"
                  className="mx-auto h-24 w-auto object-contain my-4 border-2 border-white/20 rounded-lg p-2 bg-white/10"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = correctAnswer === option;

                let buttonClass = 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30';

                if (isSelected && !isRevealed) {
                  // Pending state while waiting for API response
                  buttonClass = 'bg-white/20 border-white/40 animate-pulse';
                } else if (isRevealed) {
                  // Result state
                  if (isCorrect) {
                    buttonClass = 'bg-emerald-500/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-500/30 border-red-400 text-white shadow-lg shadow-red-500/20';
                  } else {
                    buttonClass = 'bg-white/5 border-white/10 text-white/50';
                  }
                }
                
                if (selectedAnswer === 'TIME_EXPIRED' && isCorrect) {
                    buttonClass = 'bg-emerald-500/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null} // Disable all buttons once one is selected
                    className={`
                      p-4 rounded-2xl font-medium text-lg transition-all duration-300 border-2 flex items-center justify-between
                      ${buttonClass}
                      ${selectedAnswer === null ? 'cursor-pointer transform hover:-translate-y-1.5' : 'cursor-not-allowed'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-sm font-bold">  
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-semibold">{option}</span>
                    </div>
                    {isRevealed && isCorrect && (
                      <span className="text-2xl">✅</span>
                    )}
                    {isRevealed && isSelected && !isCorrect && (
                      <span className="text-2xl">❌</span>
                    )}
                  </button>
                );
              })}
            </div>

            {isRevealed && (
              <div className="mt-6 text-center">
                <div className={`text-lg font-medium ${
                  selectedAnswer === 'TIME_EXPIRED'
                    ? 'text-orange-400'
                    : selectedAnswer === correctAnswer 
                      ? 'text-emerald-400'
                      : 'text-red-400'
                }`}>
                  {selectedAnswer === 'TIME_EXPIRED'
                    ? `⏰ Time's up! The correct answer was: ${correctAnswer}`
                    : selectedAnswer === correctAnswer 
                      ? '✅ Correct!' 
                      : `❌ Wrong! The correct answer is ${correctAnswer}`
                  }
                </div>
              </div>
            )}

            {isRevealed && (
              <div className="mt-8 text-center">
                <button
                  onClick={nextQuestion}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🏁'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagsQuiz;