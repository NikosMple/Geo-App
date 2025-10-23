import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Animation variants for Framer Motion to keep the JSX clean.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const QuestionSection = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  correctAnswer,
  isRevealed,
  onAnswerSelect,
  onNextQuestion,
  gameMode = 'capitals',
  explanation = null,
}) => {
  // Helper to extract country name from a "What is the capital of X?" string
  const getCountryFromQuestion = (questionString) => {
    if (!questionString || !questionString.includes(' of ')) return '';
    const parts = questionString.match(/of\s(.*?)\?/);
    return parts ? parts[1].trim() : '';
  };

  // Determine the country name based on game mode
  const countryName =
    gameMode === 'capitals'
      ? getCountryFromQuestion(currentQuestion?.question)
      : correctAnswer || currentQuestion?.answer;

  // Focus the Next/Finish button when result is revealed
  const nextButtonRef = useRef(null);
  useEffect(() => {
    if (isRevealed && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [isRevealed]);

  // Keyboard shortcuts: A-D to select options; Enter/Space to continue when revealed
  useEffect(() => {
    const handler = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const key = e.key.toLowerCase();
      if (!isRevealed) {
        if (['a', 'b', 'c', 'd'].includes(key)) {
          const index = key.charCodeAt(0) - 'a'.charCodeAt(0);
          const option = currentQuestion?.options?.[index];
          if (option) {
            e.preventDefault();
            onAnswerSelect(option);
          }
        }
      } else {
        if (key === 'enter' || key === ' ') {
          e.preventDefault();
          onNextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRevealed, currentQuestion, onAnswerSelect, onNextQuestion]);

  // Dynamically determines the Tailwind CSS classes for each answer button based on the quiz state.
  const getButtonClass = (option) => {
    const isSelected = selectedAnswer === option;
    const isCorrect = correctAnswer === option;

    // Default state: not selected, not revealed
    let baseClass = 'bg-white/5 border-white/20 text-white hover:bg-white/10';

    if (isRevealed) {
      if (isCorrect) {
        // Correct answer revealed
        return 'bg-emerald-500/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-105';
      }
      if (isSelected && !isCorrect) {
        // Selected answer, but it's wrong
        return 'bg-red-500/30 border-red-400 text-white shadow-lg shadow-red-500/20';
      }
      // Unselected, non-correct answers
      return 'bg-white/5 border-white/10 text-white/50 opacity-60';
    }

    if (isSelected) {
      // Answer selected, but not yet revealed (pending state)
      return 'bg-white/20 border-white/40 animate-pulse';
    }

    // Time expired: highlight the correct answer
    if (selectedAnswer === 'TIME_EXPIRED' && isCorrect) {
      return 'bg-emerald-500/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20';
    }

    return baseClass;
  };

  // Generates the result message after an answer is revealed
  const getResultMessage = () => {
    if (selectedAnswer === 'TIME_EXPIRED')
      return `⏰ Time's up! The correct answer was ${correctAnswer}.`;
    if (selectedAnswer === correctAnswer) return '✅ Correct!';
    return `✖️ Wrong! The correct answer is ${correctAnswer}.`;
  };

  // Determines the color of the result message
  const getResultClass = () => {
    if (selectedAnswer === 'TIME_EXPIRED') return 'text-orange-400';
    if (selectedAnswer === correctAnswer) return 'text-emerald-400';
    return 'text-red-400';
  };

  // Renders the question card, adapting for 'flags' or 'capitals' game modes
  const renderQuestion = () => {
    if (gameMode === 'flags') {
      const rawCode = currentQuestion?.country_code || '';
      const code = rawCode.toLowerCase();
      const fiCode = code === 'uk' ? 'gb' : code; // normalize common exception

      return (
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Which country does this flag belong to?
          </h2>
          {rawCode ? (
            <div className="mx-auto my-6 inline-flex items-center justify-center rounded-xl border-2 border-white/20 bg-white/10 p-4">
              <span
                className={`fi fi-${fiCode}`}
                aria-label={`Flag of ${countryName || 'Unknown country'}`}
                title={countryName || 'Flag'}
                style={{ fontSize: '6rem', lineHeight: 1 }}
              />
            </div>
          ) : null}
        </motion.div>
      );
    }

    // For capitals mode, highlights the country name
    const questionText = currentQuestion?.question || '';
    const parts = countryName ? questionText.split(countryName) : [questionText, ''];
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {parts[0]}
          <span className="text-cyan-400 font-extrabold mx-2">{countryName}</span>
          {parts[1]}
        </h2>
      </motion.div>
    );
  };

  return (
    <motion.div
      key={currentQuestionIndex} // Animate each new question
      className="w-full max-w-3xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Progress Bar */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-center mb-2 font-medium">
          <span className="text-white/70 text-sm">Progress</span>
          <span className="text-white text-sm">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </motion.div>

      {/* Question Card */}
      {renderQuestion()}

      {/* Answer Options Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion?.options?.map((option, index) => {
          const buttonClass = getButtonClass(option);
          const isSelected = selectedAnswer === option;
          const isCorrect = correctAnswer === option;

          return (
            <motion.button
              key={option}
              onClick={() => onAnswerSelect(option)}
              disabled={isRevealed}
              className={`p-4 rounded-2xl font-semibold text-lg transition-all duration-300 border-2 flex items-center justify-between text-left
                ${buttonClass}
                ${!isRevealed ? 'cursor-pointer transform hover:-translate-y-1' : 'cursor-not-allowed'}
              `}
              aria-pressed={isSelected}
              aria-disabled={isRevealed}
              aria-label={`Answer ${String.fromCharCode(65 + index)}: ${option}`}
              whileHover={!isRevealed ? { scale: 1.03 } : {}}
              whileTap={!isRevealed ? { scale: 0.98 } : {}}
            >
              <span className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-black/20 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
              <AnimatePresence>
                {isRevealed && isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                    role="img"
                    aria-label="Correct"
                  >
                    ✅
                  </motion.span>
                )}
                {isRevealed && isSelected && !isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                    role="img"
                    aria-label="Wrong"
                  >
                    ✖️
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Result and Explanation Section */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={`text-xl font-bold ${getResultClass()}`} role="status" aria-live="polite">
              {getResultMessage()}
            </div>

            {explanation && (
              <div className="mt-4 bg-cyan-900/40 p-4 rounded-xl border border-cyan-500/30">
                <h3 className="text-cyan-300 font-semibold text-lg flex items-center justify-center gap-2 mb-2">
                  <span className="text-xl" role="img" aria-label="Light bulb">
                    💡
                  </span>
                  Fun fact
                </h3>
                <p className="text-white/90 text-center text-base">
                  <span className="font-bold text-cyan-400">{countryName}</span>: {explanation}
                </p>
              </div>
            )}

            <div className="mt-8">
              <motion.button
                onClick={onNextQuestion}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                ref={nextButtonRef}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentQuestionIndex >= totalQuestions - 1 ? 'Finish Quiz 🎉' : 'Next Question →'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionSection;
