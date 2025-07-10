import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const ChooseContinent = ({ gameMode = 'capitals', onContinentSelect }) => {
  const [continents, setContinents] = useState([]);
  const [bossLevel, setBossLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const navigate = useNavigate();

  const getIconForContinent = (continent) => {
    const icons = {
      europe: '/assets/europe.png',
      asia: '/assets/asia.png',
      africa: '/assets/africa.png',
      america: '/assets/america.png',
      oceania: '/assets/oceania.png',
      boss: '/assets/boss.png',
    };
    return icons[continent.toLowerCase()] || '🌍';
  };

  const getColorForContinent = (continent) => {
    const colors = {
      europe: '#4f46e5',
      asia: '#059669',
      africa: '#ea580c',
      america: '#7c3aed',
      oceania: '#0891b2',
      boss: '#dc2626'
    };
    return colors[continent.toLowerCase()] || '#6b7280';
  };

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        const data = await api.getContinents();
        if (Array.isArray(data)) {
          const formattedContinents = data.map(continent => ({
            name: continent.charAt(0).toUpperCase() + continent.slice(1),
            value: continent,
            icon: getIconForContinent(continent),
            color: getColorForContinent(continent),
            countries: []
          }));

          const regularContinents = formattedContinents.filter(c => c.value !== 'boss');
          const boss = formattedContinents.find(c => c.value === 'boss');

          setContinents(regularContinents);
          setBossLevel(boss);
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (err) {
        console.error('Error fetching continents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContinents();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContinentClick = (continent) => {
    setSelectedContinent(continent.name);
    setTimeout(() => {
      if (continent.value === 'boss') {
        navigate(`/quiz/capitals/boss/hard`);
      } else {
        navigate(`/difficulty/${continent.value}`);
      }
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

  if (loading) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading continents...</div>
      </div>
    );
  }

  return (
    <div className={`app-background ${mounted ? 'mounted' : ''}`}>
      <div className="bg-decoration">
        <div className="floating-globe pointer-events-none"></div>
        <div className="grid-pattern pointer-events-none"></div>
        <div className="gradient-orbs pointer-events-none">
          <div className="orb orb-1 pointer-events-none"></div>
          <div className="orb orb-2 pointer-events-none"></div>
          <div className="orb orb-3 pointer-events-none"></div>
        </div>
      </div>

      <div className="relative z-10 p-6 sm:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <Link
            to="/"
            className="back-arrow-link inline-flex items-center gap-2 text-white bg-white/10 border border-white/20 px-6 py-3 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-lg text-base no-underline hover:bg-white/20 hover:-translate-y-1 hover:text-white hover:shadow-lg hover:shadow-white/10"
          >
            <span className="back-arrow text-xl transition-transform duration-300">←</span>
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full text-white font-medium hover:bg-white/15 transition-all duration-300">
            <span className="text-xl animate-bounce">{gameInfo.icon}</span>
            <span>{gameInfo.title}</span>
          </div>
        </header>

        <section className="text-center mb-16 animate-slide-up animation-delay-200">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Choose Your Continent
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 font-light max-w-2xl mx-auto">
            {gameInfo.description}
          </p>
          <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <span className="text-lg">🌍</span>
              <span>5 Continents</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <span className="text-lg animate-pulse">🔥</span>
              <span>1 Boss Level</span>
            </div>
          </div>
        </section>

        <section className="animate-slide-up animation-delay-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {continents.map((continent, index) => (
              <div
                key={continent.value}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-4 hover:bg-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-black/30 transform hover:scale-[1.02] ${
                  selectedContinent === continent.name ? 'scale-95 bg-blue-500/20 border-blue-500/60' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleContinentClick(continent)}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl pointer-events-none"></div>
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-xl pointer-events-none"
                  style={{
                    background: `linear-gradient(45deg, ${continent.color}60, transparent)`
                  }}
                ></div>
                <div className="relative z-10 flex justify-center items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <img
                      src={continent.icon}
                      alt={continent.name}
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  </div>
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                    {continent.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 group-hover:text-white/80 transition-colors duration-300">
                    Explore capitals
                  </p>
                  <div className="flex justify-center items-center text-white/70 font-medium group-hover:text-white transition-colors duration-300">
                    <span className="text-sm">Start Quiz</span>
                    <span className="ml-2 text-lg transform transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(45deg, ${continent.color}20, transparent)`,
                    border: `1px solid ${continent.color}40`
                  }}
                ></div>
              </div>
            ))}

            {bossLevel && (
              <div
                className={`group relative bg-gradient-to-br from-red-900/20 to-yellow-900/20 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl p-6 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-4 hover:shadow-2xl hover:shadow-red-500/30 transform hover:scale-[1.02] ${
                  selectedContinent === bossLevel.name ? 'scale-95 bg-red-500/30 border-red-400/80' : ''
                }`}
                style={{ animationDelay: `${continents.length * 0.1}s` }}
                onClick={() => handleContinentClick(bossLevel)}
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br from-red-500 via-yellow-500 to-red-600 blur-xl pointer-events-none"></div>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent rounded-3xl pointer-events-none"></div>
                <div className="relative z-10 flex justify-center items-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <img
                      src={bossLevel.icon}
                      alt={bossLevel.name}
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  </div>
                </div>
                <div className="relative z-10 flex justify-center mb-3">
                  <div className="inline-flex items-center gap-1 bg-red-500/20 border border-red-400/40 px-2 py-1 rounded-full text-red-300 text-xs font-medium">
                    <span className="animate-pulse">⚠️</span>
                    <span>EXTREME</span>
                  </div>
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-red-400 via-yellow-400 to-red-500 bg-clip-text mb-2 group-hover:from-yellow-300 group-hover:to-red-400 transition-all duration-300">
                    {bossLevel.name} LEVEL
                  </h3>
                  <p className="text-white/60 text-sm mb-4 group-hover:text-white/80 transition-colors duration-300">
                    Ultimate challenge
                  </p>
                  <div className="flex justify-center items-center text-white/70 font-medium group-hover:text-yellow-300 transition-colors duration-300">
                    <span className="text-sm">Accept Challenge</span>
                    <span className="ml-2 text-lg transform transition-transform duration-300 group-hover:translate-x-1">
                      ⚡
                    </span>
                  </div>
                </div>
                <div
                  className="absolute inset-0 rounded-3xl border-2 border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(45deg, #dc262640, transparent)',
                    border: '1px solid #dc262660'
                  }}
                ></div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChooseContinent;
