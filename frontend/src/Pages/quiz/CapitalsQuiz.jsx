import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import api from '../../services/api';
import QuizHeader from '../../components/quiz/QuizHeader';
import QuestionSection from '../../components/quiz/QuestionSection';

const CapitalsQuiz = () => {
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
  const [explanation, setExplanation] = useState(null);
  
  const [mounted, setMounted] = useState(false);

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
      const result = await api.checkAnswer(continent, currentQuestion.question, null);
      setCorrectAnswer(result.correctAnswer);
      setExplanation(result.explanation || null);
    } catch (error) {
      console.error('Error getting correct answer after time expiry:', error);
      setCorrectAnswer(currentQuestion.answer);
    } finally {
      setIsRevealed(true);
    }
  };

  const handleAnswerSelect = async (answer) => {
    if (selectedAnswer !== null) return;
    
    pause();
    setSelectedAnswer(answer);
    
    try {
      const result = await api.checkAnswer(continent, currentQuestion.question, answer);
      
      if (result.isCorrect) {
        setScore(score + 1);
      }
      
      setCorrectAnswer(result.correctAnswer);
      setExplanation(result.explanation || null);
      
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
      setExplanation(null);
    } else {
      pause();
      navigate('/score', { 
        state: { 
          score: score, 
          totalQuestions: questions.length, 
          continent, 
          difficulty,
          gameMode: 'capitals'
        } 
      });
    }
  };

  // Fetch questions
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    api.getCapitalsQuizQuestions(continent, difficulty)
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

  // Restart timer for new questions
  useEffect(() => {
    if (!loading && questions.length > 0 && currentQuestionIndex < questions.length && !selectedAnswer) {
      const newExpiry = getTimerExpiry();
      restart(newExpiry);
    }
  }, [currentQuestionIndex, loading, questions.length, restart, selectedAnswer]);

  const timeLeft = minutes * 60 + seconds;
  const isLowTime = timeLeft <= 10;
  const isVeryLowTime = timeLeft <= 5;

  if (loading) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading {continent} {difficulty} questions...
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            {questions.length === 0 ? '⚠️ No Questions' : '❌ Error'}
          </h2>
          <p className="text-white mb-6">
            {error || `No questions available for ${continent} - ${difficulty}`}
          </p>
          <Link 
            to={`/capitals/difficulty/${continent}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 no-underline"
          >
            {questions.length === 0 ? 'Choose Different Difficulty' : 'Try Again'}
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
        <QuizHeader 
          continent={continent}
          difficulty={difficulty}
          minutes={minutes}
          seconds={seconds}
          isRunning={isRunning}
          isLowTime={isLowTime}
          isVeryLowTime={isVeryLowTime}
          score={score}
          totalQuestions={questions.length}
          gameMode="capitals"
        />

        <QuestionSection
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          isRevealed={isRevealed}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={nextQuestion}
          gameMode="capitals"
          explanation={explanation}
        />
      </div>
    </div>
  );
};

export default CapitalsQuiz;