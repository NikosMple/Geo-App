import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const CapitalsQuiz = () => {
  // =============================================================================
  // URL PARAMETERS & NAVIGATION
  // Παίρνει continent και difficulty από το URL path
  // π.χ. /quiz/capitals/america/medium → continent="america", difficulty="medium"
  // =============================================================================
  const { continent, difficulty } = useParams();
  const navigate = useNavigate(); // Για navigation μεταξύ σελίδων

  // =============================================================================
  // COMPONENT STATE
  // Όλα τα state variables που χρειάζεται το component
  // =============================================================================
  const [questions, setQuestions] = useState([]);              // Array με όλες τις ερωτήσεις από το API
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Ποια ερώτηση δείχνουμε τώρα (0, 1, 2...)
  const [score, setScore] = useState(0);                       // Πόσες σωστές απαντήσεις έχει ο χρήστης
  const [loading, setLoading] = useState(true);                // Αν φορτώνουμε ακόμα τις ερωτήσεις
  const [gameFinished, setGameFinished] = useState(false);     // Αν τελείωσε το quiz
  const [selectedAnswer, setSelectedAnswer] = useState(null);  // Ποια απάντηση επέλεξε ο χρήστης
  const [correctAnswer, setCorrectAnswer] = useState(null);    // Η σωστή απάντηση (έρχεται από backend)
  const [mounted, setMounted] = useState(false);               // Για animations

  // =============================================================================
  // CURRENT QUESTION HELPER
  // Η τρέχουσα ερώτηση βάσει του currentQuestionIndex
  // π.χ. αν currentQuestionIndex=0 → πρώτη ερώτηση, αν =1 → δεύτερη κτλ
  // =============================================================================
  const currentQuestion = questions[currentQuestionIndex];

  // =============================================================================
  // FETCH QUESTIONS FROM BACKEND
  // Όταν φορτώνει το component, κάνει API call για να πάρει τις ερωτήσεις
  // URL: http://localhost:3000/capitals/america/medium
  // =============================================================================
  useEffect(() => {
    console.log(`=== FETCHING QUESTIONS ===`);
    console.log(`Continent: ${continent}, Difficulty: ${difficulty}`);
    
    fetch(`http://localhost:3000/capitals/${continent}/${difficulty}`)
      .then(res => res.json())
      .then(data => {
        console.log(`Received ${data.length} questions from backend`);
        console.log('First question:', data[0]);
        setQuestions(data);        // Αποθηκεύει τις ερωτήσεις στο state
        setLoading(false);         // Σταματά το loading
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        setLoading(false);
      });
  }, [continent, difficulty]); // Τρέχει όταν αλλάζει continent ή difficulty

  // Animation mounting effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // =============================================================================
  // HANDLE ANSWER SELECTION
  // Όταν ο χρήστης πατάει μια απάντηση, αυτή η function τρέχει
  // =============================================================================
  const handleAnswerSelect = async (answer) => {
    console.log('=== USER SELECTED ANSWER ===');
    console.log('Selected answer:', answer);
    console.log('Current question:', currentQuestion);
    console.log('Question index:', currentQuestionIndex);
    console.log('Continent:', continent);
    
    // Αποθηκεύει την επιλογή του χρήστη
    setSelectedAnswer(answer);
    
    try {
      // ==========================================================================
      // API CALL TO CHECK ANSWER
      // Στέλνει POST request στο backend για να ελέγξει αν η απάντηση είναι σωστή
      // ==========================================================================
      console.log('Sending answer to backend for checking...');
      
      const response = await fetch('http://localhost:3000/capitals/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          continent,                    // Ποια ήπειρος
          questionIndex: currentQuestionIndex,  // Ποια ερώτηση (0, 1, 2...)
          userAnswer: answer            // Τι απάντησε ο χρήστης
        })
      });
      
      const result = await response.json();
      console.log('Backend response:', result);
      
      // ==========================================================================
      // UPDATE SCORE IF CORRECT
      // Αν η απάντηση είναι σωστή, αυξάνει το score
      // ==========================================================================
      if (result.isCorrect) {
        console.log('✅ Correct answer! Increasing score...');
        setScore(score + 1);
      } else {
        console.log('❌ Wrong answer!');
      }
      
      // Αποθηκεύει τη σωστή απάντηση για το feedback UI
      setCorrectAnswer(result.correctAnswer);
      
      // ==========================================================================
      // AUTO-ADVANCE TO NEXT QUESTION
      // Μετά από 1.5 δευτερόλεπτα, πάει στην επόμενη ερώτηση
      // ==========================================================================
      setTimeout(() => {
        console.log('Moving to next question...');
        nextQuestion();
      }, 1500);
      
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  // =============================================================================
  // MOVE TO NEXT QUESTION
  // Πηγαίνει στην επόμενη ερώτηση ή τελειώνει το quiz
  // =============================================================================
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Υπάρχουν ακόμα ερωτήσεις
      console.log(`Moving from question ${currentQuestionIndex + 1} to ${currentQuestionIndex + 2}`);
      setCurrentQuestionIndex(currentQuestionIndex + 1);  // Επόμενη ερώτηση
      setSelectedAnswer(null);      // Reset την επιλογή
      setCorrectAnswer(null);       // Reset τη σωστή απάντηση
    } else {
      // Τελείωσαν οι ερωτήσεις
      console.log('Quiz finished! Final score:', score + 1, 'out of', questions.length);
      setGameFinished(true);
    }
  };

  // =============================================================================
  // RESTART QUIZ
  // Επαναφέρει όλα τα state στην αρχική κατάσταση
  // =============================================================================
  const restartQuiz = () => {
    console.log('Restarting quiz...');
    setCurrentQuestionIndex(0);   // Πρώτη ερώτηση
    setScore(0);                  // Μηδενίζει το score
    setGameFinished(false);       // Ξεκινάει πάλι το quiz
    setSelectedAnswer(null);      // Καμία επιλογή
    setCorrectAnswer(null);       // Καμία σωστή απάντηση
  };

  // =============================================================================
  // LOADING SCREEN
  // Όσο φορτώνουν οι ερωτήσεις από το backend
  // =============================================================================
  if (loading) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading {continent} {difficulty} questions...
        </div>
      </div>
    );
  }

  // =============================================================================
  // GAME FINISHED SCREEN
  // Όταν τελειώσει το quiz, δείχνει το final score
  // =============================================================================
  if (gameFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    console.log(`Quiz completed! Score: ${score}/${questions.length} (${percentage}%)`);
    
    return (
      <div className="app-background min-h-screen">
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
              {score}/{questions.length}
            </p>
            <p className="text-xl text-white/70 mb-8">
              {percentage}% Correct
            </p>
            
            <div className="flex gap-4 justify-center">
              {/* Restart το ίδιο quiz */}
              <button 
                onClick={restartQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Try Again
              </button>
              {/* Πήγαινε πίσω στην επιλογή difficulty */}
              <Link 
                to={`/difficulty/${continent}`}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 no-underline"
              >
                Choose Difficulty
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // MAIN QUIZ SCREEN
  // Η κύρια οθόνη του quiz με την ερώτηση και τις επιλογές
  // =============================================================================
  console.log(`=== RENDERING QUIZ ===`);
  console.log(`Question ${currentQuestionIndex + 1} of ${questions.length}`);
  console.log(`Current question:`, currentQuestion);
  console.log(`Score: ${score}/${questions.length}`);

  return (
    <div className={`app-background min-h-screen ${mounted ? 'mounted' : ''}`}>
      {/* Background Effects */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>  
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 sm:p-8 max-w-4xl mx-auto min-h-screen">
        
        {/* =======================================================================
             HEADER - Back button, Score display, Quiz info
             ======================================================================= */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Back to Difficulty Selection */}
          <Link 
            to={`/difficulty/${continent}`}
            className="inline-flex items-center gap-2 text-white bg-white/10 border border-white/20 px-6 py-3 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-lg text-base no-underline hover:bg-white/20 hover:-translate-y-1"
          >
            <span className="text-xl">←</span>
            <span>Back to Difficulty</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Current Score Display */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-full text-white font-medium">
              <span className="text-emerald-400 font-bold">{score}</span>
              <span className="text-white/70"> / {questions.length}</span>
            </div>
            
            {/* Quiz Info (Continent + Difficulty) */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full text-white font-medium">
              <span className="text-xl">🏛️</span>
              <span className="ml-2 capitalize">{continent} - {difficulty}</span>
            </div>
          </div>
        </header>

        {/* =======================================================================
             PROGRESS BAR - Shows how many questions completed
             ======================================================================= */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Progress</span>
            <span className="text-white/70 text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          {/* Progress bar που γεμίζει καθώς προχωράει το quiz */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* =======================================================================
             MAIN QUIZ CONTENT - Question and Answer Options
             ======================================================================= */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            
            {/* Question Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                {currentQuestion?.question}
              </h2>
            </div>

            {/* =================================================================
                 ANSWER OPTIONS GRID
                 4 buttons σε 2x2 grid με dynamic styling βάσει state
                 ================================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null} // Disable μετά την επιλογή
                  className={`
                    p-4 rounded-2xl font-medium text-lg transition-all duration-300 border-2
                    ${
                      // =============================================================
                      // DYNAMIC STYLING LOGIC
                      // Αλλάζει χρώματα βάσει του state του quiz
                      // =============================================================
                      selectedAnswer === null 
                        ? // BEFORE SELECTION: Normal hover state
                          'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-lg' 
                        : selectedAnswer === option
                          ? // USER'S SELECTION: Show if correct (green) or wrong (red)
                            correctAnswer && option === correctAnswer
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' // Correct
                              : correctAnswer && option !== correctAnswer
                                ? 'bg-red-500/20 border-red-400 text-red-300'           // Wrong
                                : 'bg-white/5 border-white/20 text-white'               // Waiting for result
                          : // OTHER OPTIONS: Highlight correct answer, dim others
                            correctAnswer && option === correctAnswer
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' // Show correct
                              : 'bg-white/5 border-white/10 text-white/50'              // Dim others
                    }
                    ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-center gap-3">
                    {/* A, B, C, D labels */}
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* =================================================================
                 ANSWER FEEDBACK
                 Δείχνει "Correct!" ή "Wrong! The answer is..." μετά την επιλογή
                 ================================================================= */}
            {selectedAnswer && correctAnswer && (
              <div className="mt-6 text-center">
                <div className={`text-lg font-medium ${
                  selectedAnswer === correctAnswer 
                    ? 'text-emerald-400'   // Green for correct
                    : 'text-red-400'       // Red for wrong
                }`}>
                  {selectedAnswer === correctAnswer 
                    ? '✅ Correct!' 
                    : `❌ Wrong! The answer is ${correctAnswer}`
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalsQuiz;