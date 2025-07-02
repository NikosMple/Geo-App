import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Component για την επιλογή δυσκολίας του quiz
const DifficultyLevels = () => {
  // ===== HOOKS & STATE =====
  const { continent } = useParams(); // Παίρνουμε την ήπειρο από το URL
  const navigate = useNavigate(); // Hook για navigation
  const [mounted, setMounted] = useState(false); // Για animations
  const [selectedDifficulty, setSelectedDifficulty] = useState(null); // Επιλεγμένη δυσκολία

  // ===== EFFECTS =====
  // Animation effect - σημαίνει ότι το component έχει φορτώσει
  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== EVENT HANDLERS =====
  // Χειρισμός κλικ σε επίπεδο δυσκολίας
  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty); // Σημείωση της επιλογής

    // Μικρή καθυστέρηση για animation και μετά navigation στο quiz
    setTimeout(() => {
      navigate(`/quiz/capitals/${continent}/${difficulty}`);
    }, 300);
  };

  // ===== STATIC DATA =====
  // Διαθέσιμα επίπεδα δυσκολίας
  const difficultyOptions = [
    {
      id: 'easy', // Unique identifier
      title: 'Easy', // Τίτλος
      icon: '🟢', // Εικονίδιο
      description: 'Perfect for beginners', // Περιγραφή
      points: 5, // Πόντοι που δίνει
      color: 'from-emerald-500 to-green-600', // Gradient χρώματα
      borderColor: 'border-emerald-400/30', // Χρώμα περιγράμματος
      hoverColor: 'hover:border-emerald-400/60', // Χρώμα hover
      bgColor: 'from-emerald-900/20 to-green-900/20', // Background gradient
    },
    {
      id: 'medium',
      title: 'Medium',
      icon: '🟡',
      description: 'Good challenge level',
      points: 10,
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-400/30',
      hoverColor: 'hover:border-yellow-400/60',
      bgColor: 'from-yellow-900/20 to-orange-900/20',
    },
    {
      id: 'hard',
      title: 'Hard',
      icon: '🔴',
      description: 'For geography experts',
      points: 15,
      color: 'from-red-500 to-red-600',
      borderColor: 'border-red-400/30',
      hoverColor: 'hover:border-red-400/60',
      bgColor: 'from-red-900/20 to-red-900/20',
    },
    {
      id: 'random',
      title: 'Random',
      icon: '🌈',
      description: 'Mix of all difficulty levels',
      points: 'Varies', // Μεταβλητοί πόντοι
      color: 'from-purple-500 via-pink-500 to-red-500',
      borderColor: 'border-purple-400/30',
      hoverColor: 'hover:border-purple-400/60',
      bgColor: 'from-purple-900/20 to-pink-900/20',
    },
  ];

  // ===== MAIN RENDER =====
  return (
    <div className={`app-background min-h-screen ${mounted ? 'mounted' : ''}`}>
      {/* ===== BACKGROUND DECORATIONS ===== */}
      <div className="bg-decoration">
        <div className="floating-globe"></div> {/* Floating globe animation */}
        <div className="grid-pattern"></div> {/* Grid pattern overlay */}
        <div className="gradient-orbs">
          {' '}
          {/* Floating colored orbs */}
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 p-6 sm:p-8 max-w-6xl mx-auto min-h-screen">
        {/* ===== HEADER SECTION ===== */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          {/* Back Button */}
          <Link
            to="/choose-continent"
            className="inline-flex items-center gap-2 text-white bg-white/10 border border-white/20 px-6 py-3 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-lg text-base no-underline hover:bg-white/20 hover:-translate-y-1 hover:text-white hover:shadow-lg hover:shadow-white/10"
          >
            <span className="text-xl transition-transform duration-300">←</span>
            <span>Back to Continents</span>
          </Link>

          {/* Current Selection Indicator */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full text-white font-medium hover:bg-white/15 transition-all duration-300">
            <span className="text-xl">🏛️</span>
            <span className="capitalize">{continent} Capitals</span>{' '}
            {/* Δείχνει την επιλεγμένη ήπειρο */}
          </div>
        </header>

        {/* ===== TITLE SECTION ===== */}
        <section className="text-center mb-16 animate-slide-up animation-delay-200">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Choose Difficulty Level
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/80 mb-8 font-light max-w-2xl mx-auto">
            Select your preferred challenge level for {continent} capitals
          </p>

          {/* Info Badges */}
          <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <span className="text-lg">🎯</span>
              <span>4 Difficulty Levels</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <span className="text-lg">⭐</span>
              <span>Earn Points</span>
            </div>
          </div>
        </section>

        {/* ===== DIFFICULTY CARDS GRID ===== */}
        <section className="animate-slide-up animation-delay-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Render κάθε επίπεδο δυσκολίας */}
            {difficultyOptions.map((option, index) => (
              <div
                key={option.id}
                className={`group relative bg-gradient-to-br ${
                  option.bgColor
                } backdrop-blur-xl border-2 ${option.borderColor} ${
                  option.hoverColor
                } rounded-3xl p-8 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-4 hover:shadow-2xl hover:shadow-black/30 transform hover:scale-[1.02] ${
                  selectedDifficulty === option.id ? 'scale-95 opacity-75' : '' // Styling για επιλεγμένη κάρτα
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`, // Staggered animation για κάθε κάρτα
                }}
                onClick={() => handleDifficultyClick(option.id)}
              >
                {/* Shimmer Effect - Λαμπερό εφέ που περνάει από την κάρτα */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl pointer-events-none"></div>

                {/* Glow Effect - Φωτεινό εφέ γύρω από την κάρτα */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-lg bg-gradient-to-r ${option.color} pointer-events-none`}
                ></div>

                {/* ===== CARD CONTENT ===== */}
                <div className="relative z-10 text-center">
                  {/* Difficulty Icon */}
                  <div className="text-6xl mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {option.icon}
                  </div>

                  {/* Difficulty Title */}
                  <h3
                    className={`text-2xl font-black mb-3 bg-gradient-to-r ${option.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
                  >
                    {option.title}
                  </h3>

                  {/* Difficulty Description */}
                  <p className="text-white/70 text-base mb-4 group-hover:text-white/90 transition-colors duration-300">
                    {option.description}
                  </p>

                  {/* Points Badge */}
                  <div
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${option.color} bg-opacity-20 border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-6`}
                  >
                    <span>⭐</span>
                    <span>{option.points} Points</span>
                  </div>

                  {/* Call to Action */}
                  <div className="flex justify-center items-center text-white/80 font-medium group-hover:text-white transition-colors duration-300">
                    <span className="text-lg">Start Challenge</span>
                    <span className="ml-2 text-xl transform transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

                {/* Animated Border - Περίγραμμα που εμφανίζεται στο hover */}
                <div
                  className={`absolute inset-0 rounded-3xl border-2 border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${option.color} p-[2px] pointer-events-none`}
                >
                  <div
                    className={`w-full h-full rounded-3xl bg-gradient-to-br ${option.bgColor} backdrop-blur-xl`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== INFO SECTION ===== */}
        <section className="mt-16 animate-slide-up animation-delay-600">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            {/* Section Title */}
            <h3 className="text-2xl font-bold text-white mb-4">How it works</h3>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/70">
              {/* Step 1: Choose Level */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <span className="font-medium">Choose your level</span>
              </div>

              {/* Step 2: Answer Questions */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                  📝
                </div>
                <span className="font-medium">Answer questions</span>
              </div>

              {/* Step 3: Earn Points */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
                  🏆
                </div>
                <span className="font-medium">Earn points</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DifficultyLevels;