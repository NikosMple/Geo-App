import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const DifficultyLevels = ({ gameMode }) => {
  const { continent } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setTimeout(() => {
      navigate(`/quiz/${gameMode}/${continent}/${difficulty}`);
    }, 300);
  };

  const difficultyOptions = [
    {
      id: 'easy',
      title: 'Easy',
      icon: '🟢',
      description: 'Perfect for beginners',
      longDescription: 'Start your journey with basic questions',
      color: 'from-emerald-400 to-green-500',
      shadowColor: 'shadow-emerald-500/25',
      bgColor: 'from-emerald-900/10 to-green-900/10',
      difficulty: '★☆☆☆'
    },
    {
      id: 'medium',
      title: 'Medium',
      icon: '🟡',
      description: 'Good challenge level',
      longDescription: 'Test your intermediate knowledge',
      color: 'from-yellow-400 to-orange-500',
      shadowColor: 'shadow-yellow-500/25',
      bgColor: 'from-yellow-900/10 to-orange-900/10',
      difficulty: '★★☆☆'
    },
    {
      id: 'hard',
      title: 'Hard',
      icon: '🔴',
      description: 'For geography experts',
      longDescription: 'Challenge yourself with tough questions',
      color: 'from-red-400 to-red-600',
      shadowColor: 'shadow-red-500/25',
      bgColor: 'from-red-900/10 to-red-900/10',
      difficulty: '★★★☆'
    },
    {
      id: 'random',
      title: 'Random',
      icon: '🎲',
      description: 'Mix of all difficulty levels',
      longDescription: 'Unpredictable mix for ultimate challenge',
      color: 'from-purple-400 via-pink-400 to-indigo-500',
      shadowColor: 'shadow-purple-500/25',
      bgColor: 'from-purple-900/10 to-pink-900/10',
      difficulty: '★★★★'
    },
  ];

  const gameInfo = {
    capitals: { title: 'Capitals', icon: '🏛️' },
    flags: { title: 'Flags', icon: '🏳️'}
  }[gameMode];

  return (
    <div className={`premium-dashboard ${mounted ? 'mounted' : ''}`}>
      {/* Background */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto min-h-screen">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center pt-8 pb-12 gap-6">
            <Link
              to={`/${gameMode}/choose-continent`}
              className="group inline-flex items-center gap-3 text-white bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 no-underline"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span className="font-medium">Back to Continents</span>
            </Link>

            <div className="flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl">
              <div className="relative">
                <span className="text-2xl">{gameInfo.icon}</span>
                <span className="absolute -top-1 -right-1 text-sm">{gameInfo.emoji}</span>
              </div>
              <div className="text-white">
                <span className="capitalize font-bold">{continent}</span>
                <span className="text-white/70 ml-2">{gameInfo.title}</span>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="text-center mb-16 animate-slide-up animation-delay-200">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-sm font-medium text-white/90 mb-6">
                <span className="relative">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>Choose Your Challenge Level</span>
              </div>
              
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white font-righteous">Difficulty </span>
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent">
                Selection
              </span>
            </h1>
              
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Choose the perfect challenge level for your 
                <span className="text-cyan-400 font-semibold"> {continent} {gameInfo.title.toLowerCase()} </span>
                adventure
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-6 flex-wrap mb-8">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl">
                <span className="text-lg">🎯</span>
                <span className="text-white/70 text-sm">4 Difficulty Levels</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl">
                <span className="text-lg">⏱️</span>
                <span className="text-white/70 text-sm">10 Seconds per Question</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl">
                <span className="text-lg">🏆</span>
                <span className="text-white/70 text-sm">Instant Scoring</span>
              </div>
            </div>
          </section>

          {/* Difficulty Cards */}
          <section className="animate-slide-up animation-delay-400 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {difficultyOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`group relative cursor-pointer transition-all duration-500 ${
                    selectedDifficulty === option.id ? 'scale-95 opacity-75' : 'hover:-translate-y-6 hover:scale-105'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleDifficultyClick(option.id)}
                >
                  {/* Card Background */}
                  <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group-hover:border-white/20 transition-all duration-500">
                    
                    {/* Animated Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.bgColor} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </div>

                    {/* Card Content */}
                    <div className="relative p-8">
                      {/* Icon */}
                      <div className="text-center mb-6">
                        <div className="relative inline-block">
                          <div className={`absolute inset-0 bg-gradient-to-r ${option.color} rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 scale-110`}></div>
                          <div className="relative w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <span className="text-4xl">{option.icon}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="text-center mb-6">
                        <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${option.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                          {option.title}
                        </h3>
                        <p className="text-white/70 text-base mb-2 group-hover:text-white/90 transition-colors duration-300">
                          {option.description}
                        </p>
                        <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors duration-300">
                          {option.longDescription}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-center items-center mb-6 text-sm">
                        <div className="text-center">
                          <div className="text-white/80">{option.difficulty}</div>
                          <div className="text-white/50">Difficulty</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="text-center">
                        <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${option.color} px-6 py-3 rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${option.shadowColor}`}>
                          <span className="text-white font-semibold">Start Challenge</span>
                          <span className="text-white text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                      </div>
                    </div>

                    {/* Outer Glow */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${option.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-700 -z-10`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DifficultyLevels;