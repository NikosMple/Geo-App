import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import api from '@/api/api';
import QuizHeader from '@/components/quiz/QuizHeader';
import QuestionSection from '@/components/quiz/QuestionSection';

// Generic quiz page used by both capitals and flags
const QuizPage = ({ gameMode }) => {
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

  const { seconds, minutes, isRunning, pause, restart } = useTimer({
    expiryTimestamp: getTimerExpiry(),
    onExpire: () => {
      handleTimeExpired();
    }
  });

  const getQuestionKey = (q) => {
    // For capitals use the text question; for flags use country_code
    return gameMode === 'flags' ? q?.country_code : q?.question;
  };

  const handleTimeExpired = async () => {
    if (selectedAnswer !== null) return;

    pause();
    setSelectedAnswer('TIME_EXPIRED');

    try {
      let result;
      if (gameMode === 'flags') {
        result = await api.checkFlagAnswer(continent, getQuestionKey(currentQuestion), null);
      } else {
        result = await api.checkAnswer(continent, getQuestionKey(currentQuestion), null);
      }
      setCorrectAnswer(result.correctAnswer);
      setExplanation(result.explanation || null);
    } catch (error) {
      console.error('Error getting correct answer after time expiry:', error);
      setCorrectAnswer(currentQuestion?.answer);
    } finally {
      setIsRevealed(true);
    }
  };

  const handleAnswerSelect = async (answer) => {
    if (selectedAnswer !== null) return;

    pause();
    setSelectedAnswer(answer);

    try {
      let result;
      if (gameMode === 'flags') {
        result = await api.checkFlagAnswer(continent, getQuestionKey(currentQuestion), answer);
      } else {
        result = await api.checkAnswer(continent, getQuestionKey(currentQuestion), answer);
      }

      if (result.isCorrect) {
        setScore((s) => s + 1);
      }

      setCorrectAnswer(result.correctAnswer);
      setExplanation(result.explanation || null);
    } catch (error) {
      console.error('Error checking answer:', error);
      setCorrectAnswer(currentQuestion?.answer);
    } finally {
      setIsRevealed(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setIsRevealed(false);
      setExplanation(null);
    } else {
      pause();
      navigate('/score', {
        state: {
          score,
          totalQuestions: questions.length,
          continent,
          difficulty,
          gameMode,
        }
      });
    }
  };

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        gameMode === 'flags'
          ? await api.getFlagsQuizQuestions(continent, difficulty)
          : await api.getCapitalsQuizQuestions(continent, difficulty);

      if (!data || data.length === 0) {
        setError(`No questions found for ${continent} - ${difficulty}`);
        setQuestions([]);
      } else {
        setQuestions(data);
      }
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [continent, difficulty, gameMode]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-white/10 rounded-2xl animate-pulse" />
          </div>

          {/* Question skeleton */}
          <div className="bg-white/10 border border-white/20 rounded-3xl p-8 mb-8 animate-pulse">
            <div className="h-8 bg-white/20 rounded w-3/4 mx-auto" />
            <div className="h-24 bg-white/10 rounded mt-6" />
          </div>

          {/* Options skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border-2 border-white/20 bg-white/5 h-16 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    const basePath = gameMode === 'flags' ? '/flags' : '/capitals';
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            {questions.length === 0 ? 'No Questions' : 'Error loading quiz'}
          </h2>
          <p className="text-white/90 mb-6">
            {error || `No questions available for ${continent} - ${difficulty}`}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchQuestions}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
            >
              Retry
            </button>
            <Link
              to={`${basePath}/difficulty/${continent}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 no-underline"
            >
              Change Difficulty
            </Link>
          </div>
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
          gameMode={gameMode}
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
          gameMode={gameMode}
          explanation={explanation}
        />
      </div>
    </div>
  );
};

export default QuizPage;
