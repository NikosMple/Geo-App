import { useState, useEffect } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const ChooseContinent = ({ gameMode }) => {
  const [continents, setContinents] = useState([]);
  const [bossLevel, setBossLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const navigate = useNavigate();

  const getIconForContinent = (continent) => {
    const icons = {
      europe: "/assets/europe.png",
      asia: "/assets/asia.png",
      africa: "/assets/africa.png",
      america: "/assets/america.png",
      oceania: "/assets/oceania.png",
      boss: "/assets/boss.png",
    };
    return icons[continent.toLowerCase()] || "🌍";
  };

  const getColorForContinent = (continent) => {
    const colors = {
      europe: "#4f46e5",
      asia: "#059669",
      africa: "#ea580c",
      america: "#7c3aed",
      oceania: "#0891b2",
      boss: "#dc2626",
    };
    return colors[continent.toLowerCase()] || "#6b7280";
  };

  useEffect(() => {
    const fetchContinents = async () => {
      try {
        const data = await api.getContinents();
        if (Array.isArray(data)) {
          const formattedContinents = data.map((continent) => ({
            name: continent.charAt(0).toUpperCase() + continent.slice(1),
            value: continent,
            icon: getIconForContinent(continent),
            color: getColorForContinent(continent),
          }));
          const regularContinents = formattedContinents.filter(
            (c) => c.value !== "boss"
          );
          const boss = formattedContinents.find((c) => c.value === "boss");
          setContinents(regularContinents);
          setBossLevel(boss);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Error fetching continents:", err);
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
      if (continent.value === "boss") {
        navigate(`/quiz/${gameMode}/boss/hard`);
      } else {
        navigate(`/${gameMode}/difficulty/${continent.value}`);
      }
    }, 300);
  };

  const getGameModeInfo = () => {
    const modes = {
      capitals: {
        title: "Capitals Quiz",
        icon: "🏛️",
        description: "Test your knowledge of world capitals",
      },
      flags: {
        title: "Flags Quiz",
        icon: "🏳️",
        description: "Identify countries by their national flag",
      },
    };
    return modes[gameMode] || modes.capitals;
  };

  const gameInfo = getGameModeInfo();

  // ## CHANGE: Combine continents and boss level into a single array for mapping. ##
  const allLevels = [...continents, ...(bossLevel ? [bossLevel] : [])];

  if (loading) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading continents...
        </div>
      </div>
    );
  }

  return (
    <div className={`app-background ${mounted ? "mounted" : ""}`}>
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
        <header className="flex flex-col md:flex-row justify-between items-center pt-8 pb-12 gap-6">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 text-white bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 no-underline"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl">
            <div className="relative">
              <span className="text-2xl">{gameInfo.icon}</span>
              <span className="absolute -top-1 -right-1 text-sm">
                {gameInfo.emoji}
              </span>
            </div>
            <div className="text-white">
              <span className="font-bold">{gameInfo.title}</span>
            </div>
          </div>
        </header>

        <section className="text-center mb-16 animate-slide-up animation-delay-200">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white font-righteous">Choose your </span>
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent">
                Arena
              </span>
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              {gameInfo.description}. Choose a continent to explore or dare to
              face the
              <span className="text-red-400 font-semibold">
                {" "}
                ultimate challenge
              </span>
            </p>
          </div>
        </section>

        {/* ## CHANGE: A single grid section to render all cards. ## */}
        <section className="animate-slide-up animation-delay-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allLevels.map((level, index) => {
              // Check if the current item is the boss level
              const isBoss = level.value === "boss";

              if (isBoss) {
                // ## RENDER BOSS CARD ##
                return (
                  <div
                    key={level.value}
                    className={`group relative overflow-hidden bg-gradient-to-br from-red-900/40 to-yellow-900/40 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl p-6 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/30 transform ${
                      selectedContinent === level.name
                        ? "scale-95 bg-red-500/30 border-red-400"
                        : "hover:border-red-400/80"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleContinentClick(level)}
                  >
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent transform group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                        <img
                          src={level.icon}
                          alt={level.name}
                          className="w-full h-full object-contain filter drop-shadow-xl"
                        />
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-400/40 px-3 py-1 rounded-full text-red-300 text-xs font-medium mb-3">
                        <span className="animate-pulse">⚠️</span>
                        <span>EXTREME</span>
                      </div>
                      <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-red-400 via-yellow-300 to-red-500 bg-clip-text mb-2 group-hover:from-yellow-300 group-hover:to-red-400 transition-all duration-300">
                        {level.name} Level
                      </h3>
                      <div className="mt-2 inline-flex items-center justify-center px-5 py-2 text-yellow-300/80 font-semibold rounded-full transition-all duration-300 group-hover:text-yellow-200">
                        <span>Accept</span>
                        <span className="ml-2 text-xl transform transition-transform duration-300 group-hover:translate-x-1">
                          ⚡
                        </span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // ## RENDER CONTINENT CARD ##
                return (
                  <div
                    key={level.value}
                    className={`group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 transform ${
                      selectedContinent === level.name
                        ? "scale-95 bg-blue-500/20 border-blue-500"
                        : "hover:border-white/20"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleContinentClick(level)}
                  >
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <img
                          src={level.icon}
                          alt={level.name}
                          className="w-full h-full object-contain filter drop-shadow-lg"
                        />
                      </div>
                      <h3
                        className="text-2xl font-bold text-white mb-2 transition-colors duration-300"
                        style={{ textShadow: `0 0 15px ${level.color}50` }}
                      >
                        {level.name}
                      </h3>
                      <p className="text-white/60 text-sm mb-4 group-hover:text-white/80 transition-colors duration-300">
                        Explore {gameMode}
                      </p>
                      <div
                        className="mt-2 inline-flex items-center justify-center px-5 py-2 text-white/80 font-semibold rounded-full transition-all duration-300 group-hover:text-white"
                        style={{
                          background: `${level.color}40`,
                          border: `1px solid ${level.color}80`,
                        }}
                      >
                        <span>Start Quiz</span>
                        <span className="ml-2 text-lg transform transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChooseContinent;
