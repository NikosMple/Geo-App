import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/api/api.js';

const GAME_MODES = [
  {
    name: 'Capitals Quiz',
    icon: '🏛️',
    path: '/capitals/choose-continent',
    description: 'Test your knowledge of world capitals across all continents',
    longDescription: 'Challenge yourself with capital cities from Europe, Asia, Africa, Americas, and Oceania',
    color: 'from-blue-500 to-indigo-600',
    accentColor: 'from-blue-400 to-cyan-400',
    shadow: 'shadow-blue-500/30',
    features: ['Multiple Difficulties', 'Timed Challenges']
  },
  {
    name: 'Flags Quiz',
    icon: '🏳️',
    path: '/flags/choose-continent',
    description: 'Identify countries by their unique national flags',
    longDescription: 'From simple designs to complex emblems, master the world of flags',
    color: 'from-red-500 to-rose-600',
    accentColor: 'from-red-400 to-orange-400',
    shadow: 'shadow-red-500/30',
    features: ['World Flags', 'Visual Recognition']
  }
];

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [countriesCount, setCountriesCount] = useState(0);
  const navigate = useNavigate();
  const { user, userProfile, loading, logout } = useAuth(); // Add logout and userProfile

  // Refs for magnetic effect
  const cardRefs = useRef([]);
  cardRefs.current = []; 

  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Length of Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await api.getCountries();
        setCountriesCount(countries.length);
      } catch (error) {
        console.log('Failed to load countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Magnetic spotlight effect handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const rotationFactor = 15;
        const rotateX = ((y / rect.height) - 0.5) * rotationFactor;
        const rotateY = ((x / rect.width) - 0.5) * -rotationFactor;

        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auth-aware game launch handler
  const handleGameLaunch = (path) => {
    if (user) {
      // User is authenticated, navigate to game
      navigate(path);
    } else {
      // User not authenticated, redirect to login with intended destination
      navigate('/login', { state: { from: path } });
    }
  };

  // Auth-aware start playing handler
  const handleStartPlaying = () => {
    if (user) {
      // Scroll to game modes
      document.getElementById('game-modes')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/login');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      // User will be redirected automatically via auth state change
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const statsData = [
    {
      icon: '🌍',
      number: countriesCount > 0 ? countriesCount.toString() : '...',
      label: 'Countries',
      color: 'from-emerald-400 to-teal-500',
      description: 'Ready to explore',
      suffix: ''
    },
    {
      icon: '🎯',
      number: '2',
      label: 'Game Modes',
      color: 'from-purple-400 to-pink-500',
      description: 'Unique challenges',
      suffix: ''
    },
    {
      icon: '⚡',
      number: '10',
      label: 'Seconds',
      color: 'from-yellow-400 to-orange-500',
      description: 'Per question',
      suffix: 's'
    }
  ];

  // Auth status badge component
  const AuthStatusBadge = () => {
    if (loading) return (
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-sm font-medium text-white/90 mb-8">
        <div className="animate-spin rounded-full h-3 w-3 border border-white/50 border-t-white"></div>
        <span>Loading...</span>
      </div>
    );
    
    if (user) {
      // Use userProfile displayName first, then fallback to user displayName or email
      const displayName = userProfile?.displayName || user.displayName || user.email?.split('@')[0];
      const isGuest = user.isAnonymous || userProfile?.isAnonymous;
      
      return (
        <div className={`inline-flex items-center gap-2 backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium mb-8 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
          isGuest 
            ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:shadow-blue-500/20'
            : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:shadow-emerald-500/20'
        }`}>
          <span className="relative">
            <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${
              isGuest ? 'bg-blue-400' : 'bg-emerald-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isGuest ? 'bg-blue-500' : 'bg-emerald-500'
            }`}></span>
          </span>
          <span>
            {isGuest ? `Playing as ${displayName}` : `Welcome back, ${displayName}!`}
          </span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-sm font-medium text-white/90 mb-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
        <span className="relative">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Ultimate Geography Challenge</span>
      </div>
    );
  };

  return (
    <div className={`premium-dashboard ${mounted ? 'mounted' : ''}`}>
      {/* Your Original Background */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">

          {/* Auth-aware Navigation */}
          <div className="absolute top-8 right-8 z-20">
            {!loading && (
              user ? (
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white/90 hover:bg-white/20 transition-all duration-300"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/20 backdrop-blur-md border border-red-400/30 px-4 py-2 rounded-full text-red-300 hover:bg-red-500/30 transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white/90 hover:bg-white/20 transition-all duration-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-emerald-500/80 backdrop-blur-md border border-emerald-400/30 px-4 py-2 rounded-full text-white hover:bg-emerald-500 transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )
            )}
          </div>

          {/* ===== HERO SECTION ===== */}
          <div className="pt-8 pb-20 text-center animate-slide-up-large">
            {/* Auth Status Badge */}
            <AuthStatusBadge />

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight mb-6 tracking-tight font-['Orbitron',_sans-serif]">
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-title-shimmer">
                GEOGRAPHY
              </span>
              <span className="text-white flex items-center justify-center -mt-2" style={{textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'}}>
                <span className="inline-block mx-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl animate-globe-rotate">🌍</span>
                MASTER
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/70 mb-12 font-light max-w-4xl mx-auto leading-relaxed">
              Master world geography through interactive quizzes. Challenge yourself with
              <span className="text-cyan-400 font-semibold drop-shadow"> capitals </span>
              and
              <span className="text-red-400 font-semibold drop-shadow"> flags </span>
              from every corner of the globe.
            </p>

            {/* Auth-aware CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartPlaying}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 transform -rotate-2 hover:rotate-0"
              >
                <span>{user ? 'Start Playing' : 'Sign In to Play'}</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {user ? '🚀' : '🔒'}
                </span>
              </button>
              
              {!user && (
                <p className="text-white/50 text-sm max-w-xs">
                  Create a free account to save your progress and compete on leaderboards
                </p>
              )}
            </div>
          </div>

          {/* ===== STATISTICS SECTION ===== */}
          <div className="mb-24 animate-slide-up-large animation-delay-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/5 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-30`}></div>
                      <div className="relative w-full h-full bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 transform group-hover:scale-105 transition-transform duration-300">
                        <span className="text-4xl">{stat.icon}</span>
                      </div>
                    </div>
                    <div className={`text-5xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.number}{stat.suffix}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{stat.label}</h3>
                    <p className="text-white/60">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== GAME MODES SECTION ===== */}
          <div id="game-modes" className="mb-24 animate-slide-up-large animation-delay-400">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Choose Your Adventure
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                {user 
                  ? "Two exciting ways to test your geographical knowledge"
                  : "Sign in to unlock these exciting geography challenges"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {GAME_MODES.map((gameMode, index) => (
                <div
                  key={gameMode.name}
                  ref={addCardRef}
                  className={`group relative cursor-pointer game-mode-card ${!user ? 'opacity-75' : ''}`}
                  onClick={() => handleGameLaunch(gameMode.path)}
                >
                  <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-105 transform group-hover:[transform:rotateY(var(--rotate-y))_rotateX(var(--rotate-x))_scale(1.05)] shadow-lg hover:shadow-2xl" style={{ perspective: '1000px' }}>

                    <div className="absolute inset-0 rounded-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 [background:radial-gradient(300px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.1),transparent_40%)]"></div>

                    <div className="relative p-8 z-10">
                      <div className="flex items-start justify-between mb-8">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${gameMode.color} rounded-2xl blur-xl opacity-50`}></div>
                          <div className="relative w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
                            <span className="text-4xl">{gameMode.icon}</span>
                          </div>
                        </div>

                        {/* Auth-aware Status Badge */}
                        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                          user 
                            ? 'bg-emerald-500/20 border border-emerald-500/30' 
                            : 'bg-orange-500/20 border border-orange-500/30'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            user 
                              ? 'bg-emerald-400 animate-pulse' 
                              : 'bg-orange-400'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            user ? 'text-emerald-300' : 'text-orange-300'
                          }`}>
                            {user ? 'Ready' : 'Login Required'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-3xl font-bold mb-4 text-white">
                          {gameMode.name}
                        </h3>

                        <p className="text-lg text-white/70 mb-2">
                          {gameMode.description}
                        </p>

                        <p className="text-white/50 mb-8">
                          {gameMode.longDescription}
                        </p>

                        <div className="flex flex-wrap gap-3 mb-8">
                          {gameMode.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm text-white/70"
                            >
                              {feature}
                            </div>
                          ))}
                        </div>

                        {/* Auth-aware Action Button */}
                        <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${gameMode.color} text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 ${gameMode.shadow} group-hover:translate-y-0.5 group-hover:shadow-xl ${!user ? 'opacity-60' : ''}`}>
                          <span className="font-bold text-lg">
                            {user ? 'Play Now' : 'Sign In to Play'}
                          </span>
                          <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">
                            {user ? '→' : '🔒'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== FEATURES SECTION ===== */}
          <div className="pb-24 animate-slide-up-large animation-delay-600">
            <div className="text-center mb-12">
              <p className="text-white/60 text-lg font-light">Built for learners, designed for fun</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: '⚡',
                  title: 'Lightning Fast',
                  desc: 'Instant feedback and real-time scoring system',
                  color: 'from-yellow-400 to-orange-500'
                },
                {
                  icon: '🏆',
                  title: 'Track Progress',
                  desc: user 
                    ? 'Monitor your improvement across all difficulty levels'
                    : 'Sign in to track your improvement and compete',
                  color: 'from-purple-400 to-pink-500'
                },
                {
                  icon: '🌐',
                  title: 'Global Coverage',
                  desc: 'Every continent, every country, comprehensive content',
                  color: 'from-emerald-400 to-teal-500'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/5 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-20 flex items-center justify-center flex-shrink-0 border border-white/20 transform group-hover:scale-105 transition-transform duration-300`}>
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-white/60">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-16 text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} Geography Master. All rights reserved.</p>
            <p className="mt-2">Made with 💙 for learning.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;