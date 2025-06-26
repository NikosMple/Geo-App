import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Κύριο component για την αρχική σελίδα (Dashboard)
const Dashboard = () => {
  
  // ===== STATE VARIABLES =====
  const [mounted, setMounted] = useState(false);                    // Για animations
  const [hoveredGameMode, setHoveredGameMode] = useState(null);     // Ποιο game mode είναι hover

  // ===== EFFECTS =====
  // Animation effect - σημαίνει ότι το component έχει φορτώσει
  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== STATIC DATA =====
  // Διαθέσιμοι τρόποι παιχνιδιού
  const gameModes = [
    { 
      name: 'Capitals Quiz',           // Όνομα παιχνιδιού
      icon: '🏛️',                     // Εικονίδιο
      path: '/choose-continent',       // Διαδρομή για navigation
      description: 'Guess the capital cities of countries',  // Περιγραφή
      features: ['Multiple Choice'],   // Χαρακτηριστικά
      color: 'from-blue-500 to-blue-700'  // Gradient χρώματα
    },
    { 
      name: 'Flags Quiz', 
      icon: '🏳️', 
      path: '/quiz/flags',
      description: 'Identify countries by their flags',
      features: ['World Flags'],
      color: 'from-red-500 to-red-700'
    }
  ];

  // ===== MAIN RENDER =====
  return (
    <div className={`premium-dashboard ${mounted ? 'mounted' : ''}`}>
      
      {/* ===== BACKGROUND DECORATIONS ===== */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>     {/* Floating globe animation */}
        <div className="grid-pattern"></div>       {/* Grid pattern overlay */}
        <div className="gradient-orbs">            {/* Floating colored orbs */}
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        
        {/* ===== HERO SECTION ===== */}
        <div className="text-center py-16 pb-12 animate-slide-up-large animation-delay-200">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-sm font-medium text-white/90 mb-8 transition-all duration-300 hover:bg-white/15 hover:-translate-y-1">
            <span className="text-lg animate-sparkle">🌟</span>
            <span>Ultimate Geography Challenge</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black leading-tight mb-6 tracking-tight">
            {/* First Line - Gradient Text */}
            <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-title-shimmer">
              GEOGRAPHY
            </span>
            {/* Second Line - With Globe Icon */}
            <span className="block text-white" style={{textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'}}>
              <span className="inline-block mx-2 text-6xl md:text-7xl lg:text-8xl animate-globe-rotate">🌍</span>
              MASTER
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-white/80 mb-4 font-normal">
            Test your knowledge with capitals and flags from around the world
          </p>
          
          {/* Description */}
          <div className="text-base text-white/60 max-w-2xl mx-auto">
            Two exciting game modes to challenge your geography skills
          </div>
        </div>

        {/* ===== STATISTICS SECTION ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12 animate-slide-up-large animation-delay-400">
          {[
            { icon: '🌍', number: '140', label: 'Countries' },    // Στατιστικά του παιχνιδιού
            { icon: '🎮', number: '2', label: 'Game Modes' },
            { icon: '❓', number: '15', label: 'Questions' },
            { icon: '⏱️', number: '7s', label: 'Per Question' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 py-6 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/8 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20 overflow-hidden"
            >
              {/* Shimmer effect που περνάει όταν κάνεις hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              {/* Εικονίδιο */}
              <div className="text-4xl mb-4 block">{stat.icon}</div>
              {/* Αριθμός */}
              <div className="text-4xl font-bold text-emerald-400 block mb-2">{stat.number}</div>
              {/* Περιγραφή */}
              <div className="text-sm text-white/70 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ===== GAME MODES SECTION ===== */}
        <div className="my-16 animate-slide-up-large animation-delay-600">
          
          {/* Section Title */}
          <h2 className="text-4xl font-bold text-center mb-12 text-white flex items-center justify-center gap-4">
            <span className="text-3xl animate-icon-bounce">🎯</span>
            Choose Your Game Mode
          </h2>
          
          {/* Game Mode Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {gameModes.map((gameMode, index) => (
              <Link
                key={gameMode.name}
                to={gameMode.path}  // Navigation στη σωστή σελίδα
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 no-underline text-inherit transition-all duration-500 hover:-translate-y-3 hover:bg-white/8 hover:border-white/20 hover:shadow-2xl hover:shadow-black/30 overflow-hidden max-w-md mx-auto"
                style={{ animationDelay: `${index * 0.2}s` }}  // Staggered animation
                onMouseEnter={() => setHoveredGameMode(gameMode.name)}
                onMouseLeave={() => setHoveredGameMode(null)}
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${gameMode.color}`}></div>
                
                {/* Card Content */}
                <div className="relative z-10">
                  
                  {/* Card Header με εικονίδιο */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {gameMode.icon}
                    </span>
                  </div>
                  
                  {/* Card Title */}
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-200 transition-colors duration-300">
                    {gameMode.name}
                  </h3>
                  
                  {/* Card Description */}
                  <p className="text-white/70 mb-8 text-base group-hover:text-white/90 transition-colors duration-300">
                    {gameMode.description}
                  </p>
                  
                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {gameMode.features.map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="bg-white/10 border border-white/20 px-3 py-1 rounded-xl text-xs font-medium text-white/80 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Call to Action */}
                  <div className="flex justify-between items-center text-white/80 font-medium group-hover:text-white transition-colors duration-300">
                    <span>Start Playing</span>
                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>

                {/* Large Background Glow για πιο dramatic effect */}
                <div className={`absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-r ${gameMode.color} rounded-full filter blur-xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2 scale-150`}></div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== FEATURES SECTION ===== */}
        <div className="my-16 animate-slide-up-large animation-delay-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Instant feedback & scoring' },
              { icon: '🏆', title: 'Track Progress', desc: 'See your improvement over time' },
              { icon: '🌐', title: 'Global Coverage', desc: 'Every continent, every country' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 bg-white/3 backdrop-blur-sm border border-white/8 rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 hover:border-white/15 hover:-translate-y-1"
              >
                {/* Feature Icon */}
                <div className="text-2xl w-12 h-12 flex items-center justify-center bg-emerald-500/20 rounded-xl flex-shrink-0">
                  {feature.icon}
                </div>
                
                {/* Feature Content */}
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">{feature.title}</h4>
                  <span className="text-sm text-white/60">{feature.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;