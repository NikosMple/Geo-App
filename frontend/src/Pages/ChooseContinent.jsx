import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const continentsData = [
  {
    name: 'Europe',
    icon: '🇪🇺',
    color: '#4f46e5',
    difficulty: 'Medium',
    countries: [
      { country: 'France', capital: 'Paris', flag: '🇫🇷' },
      { country: 'Germany', capital: 'Berlin', flag: '🇩🇪' },
      { country: 'Italy', capital: 'Rome', flag: '🇮🇹' },
      { country: 'Spain', capital: 'Madrid', flag: '🇪🇸' },
      { country: 'United Kingdom', capital: 'London', flag: '🇬🇧' },
      { country: 'Greece', capital: 'Athens', flag: '🇬🇷' },
      { country: 'Portugal', capital: 'Lisbon', flag: '🇵🇹' },
      { country: 'Netherlands', capital: 'Amsterdam', flag: '🇳🇱' },
      { country: 'Sweden', capital: 'Stockholm', flag: '🇸🇪' },
      { country: 'Norway', capital: 'Oslo', flag: '🇳🇴' }
    ]
  },
  {
    name: 'Asia',
    icon: '🌏',
    color: '#059669',
    difficulty: 'Hard',
    countries: [
      { country: 'Japan', capital: 'Tokyo', flag: '🇯🇵' },
      { country: 'China', capital: 'Beijing', flag: '🇨🇳' },
      { country: 'India', capital: 'New Delhi', flag: '🇮🇳' },
      { country: 'South Korea', capital: 'Seoul', flag: '🇰🇷' },
      { country: 'Thailand', capital: 'Bangkok', flag: '🇹🇭' },
      { country: 'Vietnam', capital: 'Hanoi', flag: '🇻🇳' },
      { country: 'Malaysia', capital: 'Kuala Lumpur', flag: '🇲🇾' },
      { country: 'Singapore', capital: 'Singapore', flag: '🇸🇬' },
      { country: 'Indonesia', capital: 'Jakarta', flag: '🇮🇩' },
      { country: 'Philippines', capital: 'Manila', flag: '🇵🇭' }
    ]
  },
  {
    name: 'North America',
    icon: '🇺🇸',
    color: '#dc2626',
    difficulty: 'Easy',
    countries: [
      { country: 'United States', capital: 'Washington D.C.', flag: '🇺🇸' },
      { country: 'Canada', capital: 'Ottawa', flag: '🇨🇦' },
      { country: 'Mexico', capital: 'Mexico City', flag: '🇲🇽' },
      { country: 'Guatemala', capital: 'Guatemala City', flag: '🇬🇹' },
      { country: 'Cuba', capital: 'Havana', flag: '🇨🇺' },
      { country: 'Jamaica', capital: 'Kingston', flag: '🇯🇲' },
      { country: 'Costa Rica', capital: 'San José', flag: '🇨🇷' },
      { country: 'Panama', capital: 'Panama City', flag: '🇵🇦' },
      { country: 'Nicaragua', capital: 'Managua', flag: '🇳🇮' },
      { country: 'Honduras', capital: 'Tegucigalpa', flag: '🇭🇳' }
    ]
  },
  {
    name: 'South America',
    icon: '🇧🇷',
    color: '#7c3aed',
    difficulty: 'Medium',
    countries: [
      { country: 'Brazil', capital: 'Brasília', flag: '🇧🇷' },
      { country: 'Argentina', capital: 'Buenos Aires', flag: '🇦🇷' },
      { country: 'Chile', capital: 'Santiago', flag: '🇨🇱' },
      { country: 'Peru', capital: 'Lima', flag: '🇵🇪' },
      { country: 'Colombia', capital: 'Bogotá', flag: '🇨🇴' },
      { country: 'Venezuela', capital: 'Caracas', flag: '🇻🇪' },
      { country: 'Ecuador', capital: 'Quito', flag: '🇪🇨' },
      { country: 'Uruguay', capital: 'Montevideo', flag: '🇺🇾' },
      { country: 'Paraguay', capital: 'Asunción', flag: '🇵🇾' },
      { country: 'Bolivia', capital: 'La Paz', flag: '🇧🇴' }
    ]
  },
  {
    name: 'Africa',
    icon: '🌍',
    color: '#ea580c',
    difficulty: 'Hard',
    countries: [
      { country: 'Nigeria', capital: 'Abuja', flag: '🇳🇬' },
      { country: 'Egypt', capital: 'Cairo', flag: '🇪🇬' },
      { country: 'South Africa', capital: 'Cape Town', flag: '🇿🇦' },
      { country: 'Kenya', capital: 'Nairobi', flag: '🇰🇪' },
      { country: 'Morocco', capital: 'Rabat', flag: '🇲🇦' },
      { country: 'Ghana', capital: 'Accra', flag: '🇬🇭' },
      { country: 'Ethiopia', capital: 'Addis Ababa', flag: '🇪🇹' },
      { country: 'Tanzania', capital: 'Dodoma', flag: '🇹🇿' },
      { country: 'Algeria', capital: 'Algiers', flag: '🇩🇿' },
      { country: 'Tunisia', capital: 'Tunis', flag: '🇹🇳' }
    ]
  },
  {
    name: 'Oceania',
    icon: '🇦🇺',
    color: '#0891b2',
    difficulty: 'Easy',
    countries: [
      { country: 'Australia', capital: 'Canberra', flag: '🇦🇺' },
      { country: 'New Zealand', capital: 'Wellington', flag: '🇳🇿' },
      { country: 'Fiji', capital: 'Suva', flag: '🇫🇯' },
      { country: 'Papua New Guinea', capital: 'Port Moresby', flag: '🇵🇬' },
      { country: 'Samoa', capital: 'Apia', flag: '🇼🇸' },
      { country: 'Tonga', capital: 'Nuku\'alofa', flag: '🇹🇴' },
      { country: 'Vanuatu', capital: 'Port Vila', flag: '🇻🇺' },
      { country: 'Solomon Islands', capital: 'Honiara', flag: '🇸🇧' },
      { country: 'Palau', capital: 'Ngerulmud', flag: '🇵🇼' },
      { country: 'Micronesia', capital: 'Palikir', flag: '🇫🇲' }
    ]
  }
];

const ChooseContinent = ({ 
  gameMode = 'capitals', 
  onContinentSelect, 
  onBack 
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [hoveredContinent, setHoveredContinent] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContinentClick = (continentName) => {
    setSelectedContinent(continentName);
    
    setTimeout(() => {
      onContinentSelect && onContinentSelect(continentName);
    }, 300);
  };

  const getGameModeInfo = () => {
    const modes = {
      capitals: {
        title: 'Capitals Quiz',
        icon: '🏛️',
        description: 'Test your knowledge of world capitals',
        color: '#3b82f6'
      },
      flags: {
        title: 'Flags Quiz',
        icon: '🏳️',
        description: 'Identify countries by their flags',
        color: '#ef4444'
      }
    };
    return modes[gameMode] || modes.capitals;
  };

  const gameInfo = getGameModeInfo();

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-green-500 bg-green-500/20 border-green-500/40',
      'Medium': 'text-yellow-500 bg-yellow-500/20 border-yellow-500/40',
      'Hard': 'text-red-500 bg-red-500/20 border-red-500/40'
    };
    return colors[difficulty] || 'text-gray-500 bg-gray-500/20 border-gray-500/40';
  };

  return (
    <div className={`app-background ${mounted ? 'mounted' : ''}`}>
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

      {/* Content */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <Link 
            to='/' 
            className="back-arrow-link inline-flex items-center gap-2 text-white bg-white/10 border border-white/20 px-6 py-3 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-lg text-base no-underline hover:bg-white/20 hover:-translate-y-1 hover:text-white"
            onClick={() => console.log('Clicking back to dashboard')}
          >
            <span className="back-arrow text-xl transition-transform duration-300">←</span>
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full text-white font-medium">
            <span className="text-xl">{gameInfo.icon}</span>
            <span>{gameInfo.title}</span>
          </div>
        </header>

        {/* Title Section */}
        <section className="text-center mb-16 animate-slide-up animation-delay-200">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Choose Your Continent
          </h1>
          <p className="text-xl text-white/80 mb-8 font-light">
            {gameInfo.description}
          </p>
          
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-lg">🌍</span>
              <span>6 Continents</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-lg">🎯</span>
              <span>15 Questions</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-lg">⏱️</span>
              <span>30s Each</span>
            </div>
          </div>
        </section>

        {/* Continents Grid */}
        <section className="animate-slide-up animation-delay-400">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
            {continentsData.map((continent, index) => (
              <div
                key={continent.name}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-3 hover:bg-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-black/20 ${
                  selectedContinent === continent.name ? 'scale-95 bg-blue-500/20 border-blue-500/60' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => handleContinentClick(continent.name)}
                onMouseEnter={() => setHoveredContinent(continent.name)}
                onMouseLeave={() => setHoveredContinent(null)}
              >
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(45deg, ${continent.color}40, transparent)`
                  }}
                ></div>

                {/* Card Header */}
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="text-5xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    {continent.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-2xl text-xs font-bold uppercase tracking-wider border backdrop-blur-sm ${getDifficultyColor(continent.difficulty)}`}>
                    {continent.difficulty}
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                    {continent.name}
                  </h3>
                  <p className="text-white/70 text-base mb-4 group-hover:text-white/90 transition-colors duration-300">
                    {continent.countries.length} countries to explore
                  </p>

                  {/* Preview Countries */}
                  <div className="flex items-center gap-3 mb-4">
                    {continent.countries.slice(0, 3).map((country, idx) => (
                      <span 
                        key={idx} 
                        className="text-2xl transform transition-all duration-300 hover:scale-125" 
                        title={country.country}
                      >
                        {country.flag}
                      </span>
                    ))}
                    <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full font-medium">
                      +{continent.countries.length - 3}
                    </span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="relative z-10 flex justify-between items-center text-white/80 font-semibold group-hover:text-white transition-colors duration-300">
                  <span className="text-lg">Start Quiz</span>
                  <span className="text-2xl transform transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChooseContinent;