import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LaunchButton from '../components/LaunchButton.jsx';
import api from '../services/api.js';

const Dashboard = () => {
  
  const [mounted, setMounted] = useState(false);                   
  const [hoveredGameMode, setHoveredGameMode] = useState(null);
  const [countriesCount, setCountriesCount] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    setMounted(true);
  }, []);

  const gameModes = [
    { 
      name: 'Capitals Quiz',           
      icon: '🏛️',                    
      path: '/choose-continent',       
      description: 'Guess the capital cities of countries',  
      features: ['Multiple Choice'],
      color: 'from-blue-500 to-blue-700',
      buttonVariant: 'default'
    },
    { 
      name: 'Flags Quiz', 
      icon: '🏳️', 
      path: '/quiz/flags',
      description: 'Identify countries by their flags',
      features: ['World Flags'],
      color: 'from-red-500 to-red-700',
      buttonVariant: 'danger'
    }
  ];

  //-- Fetch countries length --//
  useEffect(() => {
    const fetchCountries = async () => {
      try{
        const countries = await api.getCountries();
        setCountriesCount(countries.length);
      } catch (error) {
        console.log('Failed to load countries:', error);
      }
    };

    fetchCountries();
  },[]);

  // Handle game mode launch
  const handleGameLaunch = (path) => {
    navigate(path);
  };

  // ===== MAIN RENDER =====
  return (
    <div className={`premium-dashboard ${mounted ? 'mounted' : ''}`}>
      
      {/* ===== BACKGROUND DECORATIONS ===== */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>     
        <div className="grid-pattern"></div>       
        <div className="gradient-orbs">            
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* ===== HERO SECTION ===== */}
            <div className="text-center py-12 animate-slide-up-large animation-delay-200">
              
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/15 hover:-translate-y-1">
                  <span className="text-lg animate-sparkle">🌟</span>
                  <span>Ultimate Geography Challenge</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 tracking-tight font-orbitron">
                <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-title-shimmer">
                  GEOGRAPHY
                </span>
                <span className="text-white flex items-center justify-center" style={{textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'}}>
                  <span className="inline-block mx-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl animate-globe-rotate">🌍</span>
                  MASTER
                </span>
              </h1>
            
              <p className="text-lg sm:text-xl text-white/80 mb-4 font-normal max-w-2xl mx-auto">
                Test your knowledge with capitals and flags from around the world
              </p>

              <div className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto mb-8">
                Two exciting game modes to challenge your geography skills
              </div>
            </div>

            {/* ===== STATISTICS SECTION ===== */}
            <div className="my-12 animate-slide-up-large animation-delay-400">
              <div className="bg-gradient-to-r from-slate-800/20 to-slate-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-5xl mx-auto relative overflow-hidden">
                
                {/* Background Animation */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-white">Platform Statistics</h3>
                      <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-400 rounded-full"></div>
                    </div>
                    <p className="text-white/60 text-sm">Real-time data from Geography Master</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { 
                        icon: '🌍', 
                        number: countriesCount.toString(), 
                        label: 'Countries',
                        color: 'from-blue-500 to-cyan-500',
                        description: 'Ready to explore'
                      },    
                      { 
                        icon: '🎮', 
                        number: gameModes.length, 
                        label: 'Game Modes',
                        color: 'from-purple-500 to-pink-500',
                        description: 'Unique challenges'
                      },
                      { 
                        icon: '⏱️', 
                        number: '10s', 
                        label: 'Per Question',
                        color: 'from-emerald-500 to-teal-500',
                        description: 'Quick thinking!'
                      }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className="group relative text-center transition-all duration-500 hover:-translate-y-3"
                      >
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-110`}></div>
                        
                        {/* Main Card */}
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-2xl">
                          
                          {/* Icon Container */}
                          <div className="relative mb-4">
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500`}></div>
                            <div className="relative w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-500">
                              <span className="text-3xl group-hover:animate-bounce">{stat.icon}</span>
                            </div>
                          </div>
                          
                          {/* Number */}
                          <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                            {stat.number}
                          </div>
                          
                          {/* Label */}
                          <div className="text-white font-semibold mb-1">
                            {stat.label}
                          </div>
                          
                          {/* Description */}
                          <div className="text-white/50 text-xs group-hover:text-white/70 transition-colors duration-300">
                            {stat.description}
                          </div>
                          
                          {/* Animated Progress Line */}
                          <div className="mt-4 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out group-hover:w-full w-0`}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== GAME MODES SECTION ===== */}
            <div className="my-12 lg:my-16 animate-slide-up-large animation-delay-600">
              
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-blue-500 rounded-full"></div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">
                    Choose Your Adventure
                  </h2>
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-emerald-400 rounded-full"></div>
                </div>
                <p className="text-white/60 max-w-lg mx-auto">
                  Select your preferred way to explore world geography
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {gameModes.map((gameMode, index) => (
                  <div
                    key={gameMode.name}
                    className="group relative cursor-pointer"
                    style={{ animationDelay: `${index * 0.2}s` }} 
                    onMouseEnter={() => setHoveredGameMode(gameMode.name)}
                    onMouseLeave={() => setHoveredGameMode(null)}
                    onClick={() => handleGameLaunch(gameMode.path)}
                  >
                    {/* Main Card */}
                    <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-700 hover:-translate-y-4 hover:border-white/20 overflow-hidden">
                      
                      {/* Animated Background Effects */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gameMode.color} opacity-0 group-hover:opacity-15 transition-all duration-700 rounded-3xl`}></div>
                      
                      {/* Floating Particles */}
                      <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000"
                            style={{
                              left: `${15 + (i * 6)}%`,
                              top: `${15 + (i * 7)}%`,
                              animationDelay: `${i * 0.15}s`,
                              transform: `translateY(${Math.sin(i) * 10}px)`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="relative">
                            {/* Icon Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${gameMode.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500 scale-150`}></div>
                            <div className="relative w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center group-hover:border-white/40 transition-all duration-500">
                              <span className="text-4xl transition-all duration-700 group-hover:scale-125 group-hover:rotate-12">
                                {gameMode.icon}
                              </span>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-full">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-emerald-300 text-sm font-medium">Available</span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="mb-8">
                          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
                            {gameMode.name}
                          </h3>
                        
                          <p className="text-white/70 mb-6 text-base leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                            {gameMode.description}
                          </p>
                          
                          {/* Feature Tags */}
                          <div className="flex flex-wrap gap-3 mb-8">
                            {gameMode.features.map((feature, idx) => (
                              <div 
                                key={idx} 
                                className="group/tag flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                              >
                                <div className={`w-2 h-2 bg-gradient-to-r ${gameMode.color} rounded-full group-hover/tag:animate-pulse`}></div>
                                <span className="text-sm font-medium text-white/80 group-hover/tag:text-white">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Section */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-white/60">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                              <span className="text-sm font-medium">Ready to start</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Play Button */}
                            <div className={`group/btn flex items-center gap-3 bg-gradient-to-r ${gameMode.color} px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/25`}>
                              <span className="text-white font-semibold">Play Now</span>
                              <span className="text-white text-lg group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Outer Glow Effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${gameMode.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-25 transition-all duration-700 -z-10`}></div>
                      
                      {/* Border Animation */}
                      <div className="absolute inset-0 rounded-3xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-r ${gameMode.color} opacity-0 group-hover:opacity-20 transition-all duration-700`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== FEATURES SECTION ===== */}
            <div className="my-12 lg:my-16 animate-slide-up-large animation-delay-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                {[
                  { icon: '⚡', title: 'Lightning Fast', desc: 'Instant feedback & scoring' },
                  { icon: '🏆', title: 'Track Progress', desc: 'See your improvement over time' },
                  { icon: '🌐', title: 'Global Coverage', desc: 'Every continent, every country' }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 bg-white/3 backdrop-blur-sm border border-white/8 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/5 hover:border-white/15 hover:-translate-y-1"
                  >
                    <div className="text-xl sm:text-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-emerald-500/20 rounded-xl flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-sm sm:text-base font-semibold text-white mb-1">{feature.title}</h4>
                      <span className="text-xs sm:text-sm text-white/60">{feature.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;