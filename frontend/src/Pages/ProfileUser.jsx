import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/api";

const Profile = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("capitals");
  const [userStats, setUserStats] = useState(null);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.uid) return;
      try {
        const data = await api.getUserStats(user.uid, {
          includeHistory: true,
          historyLimit: 10,
        });
        setUserStats(data || {});
      } catch (e) {
        setStatsError("Failed to load stats");
      }
    };
    loadStats();
  }, [user?.uid]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const derived = useMemo(() => {
    if (!userStats) return null;
    const categories = {
      capitals: { continents: {} },
      flags: { continents: {} },
    };
    Object.entries(userStats)
      .filter(([key]) => !key.startsWith("_"))
      .forEach(([gameType, s]) => {
        const [category, continent] = String(gameType).split("_");
        if (!category || !continent) return;
        const cat = category === "flags" ? "flags" : "capitals";
        const totalQuestions =
          typeof s?.totalQuestions === "number" ? s.totalQuestions : null;
        const score = typeof s?.score === "number" ? s.score : null;
        const percentage =
          totalQuestions && score !== null && totalQuestions > 0
            ? Math.round((score / totalQuestions) * 100)
            : null;
        categories[cat].continents[continent] = {
          score,
          totalQuestions,
          updatedAt: s?.updatedAt || null,
          percentage,
        };
      });

    const history = Array.isArray(userStats._history) ? userStats._history : [];
    const totalGames = history.length;
    const totalScore = history.reduce(
      (acc, h) => acc + (typeof h.score === "number" ? h.score : 0),
      0
    );
    const averageScore =
      totalGames > 0 ? Math.round((totalScore / totalGames) * 100) / 100 : 0;
    return {
      categories,
      totals: { totalGames, totalScore, averageScore },
      history,
    };
  }, [userStats]);

  if (loading) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const currentCategoryData = derived?.categories?.[selectedCategory] || {
    continents: {},
  };
  const continentStats = currentCategoryData.continents;

  const getStatCard = (title, value, subtitle, colorClass = "text-white") => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5">
      <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</p>
      {subtitle && <p className="text-white/50 text-sm">{subtitle}</p>}
    </div>
  );

  const getCategoryIcon = (category) => (category === "capitals" ? "🌍" : "🚩");

  const getContinentFlag = (continent) => {
    const c = String(continent).toLowerCase();
    const map = {
      europe: "🇪🇺",
      asia: "🌏",
      africa: "🌍",
      america: "🌎",
      oceania: "🗺️",
      boss: "⭐",
    };
    return map[c] || "🗺️";
  };

  const formatDateTime = (iso) => {
    try {
      return iso ? new Date(iso).toLocaleString() : "";
    } catch {
      return "";
    }
  };

  return (
    <div className={`app-background min-h-screen ${mounted ? "mounted" : ""}`}>
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-3 text-white bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
              {userProfile?.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="text-white">
              <p className="font-bold text-lg">
                {userProfile?.displayName || "User"}
              </p>
              <p className="text-white/60 text-sm">
                Level {userProfile?.level || 1}
              </p>
            </div>
          </div>
        </header>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Your Geography Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {getStatCard(
              "Total Games",
              derived?.totals?.totalGames || 0,
              "All categories",
              "text-blue-400"
            )}
            {getStatCard(
              "Total Score",
              derived?.totals?.totalScore || 0,
              "Points earned",
              "text-emerald-400"
            )}
            {getStatCard(
              "Average Score",
              derived?.totals?.averageScore || 0,
              "Per game",
              "text-yellow-400"
            )}
            {getStatCard(
              "Profile Level",
              userProfile?.level || 1,
              "Current level",
              "text-purple-400"
            )}
          </div>
        </div>

        {/* Category Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex gap-2">
            {["capitals", "flags"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Continent Stats */}
        {Object.keys(continentStats).length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Continent Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(continentStats).map(([continent, s]) => (
                <div
                  key={continent}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">
                      {getContinentFlag(continent)}
                    </span>
                    <h4 className="text-lg font-bold text-white capitalize">
                      {continent}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Latest Score:</span>
                      <span className="text-white font-medium">
                        {s?.score ?? "-"}
                        {typeof s?.totalQuestions === "number"
                          ? ` / ${s.totalQuestions}`
                          : ""}
                      </span>
                    </div>
                    {typeof s?.percentage === "number" && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Accuracy:</span>
                        <span className="text-emerald-400 font-medium">
                          {s.percentage}%
                        </span>
                      </div>
                    )}
                    {s?.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Updated:</span>
                        <span className="text-white/70">
                          {formatDateTime(s.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(continentStats).length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {getCategoryIcon(selectedCategory)}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No {selectedCategory} data yet
            </h3>
            <p className="text-white/60 mb-8">
              Start playing {selectedCategory} quizzes to see your statistics
              here!
            </p>
            <button
              onClick={() => navigate(`/${selectedCategory}/choose-continent`)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/40"
            >
              Start Playing{" "}
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}
            </button>
          </div>
        )}

        {/* Recent Games */}
        {derived?.history && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">
              Recent Games
            </h3>
            {derived.history.length === 0 ? (
              <div className="text-white/70 text-center">
                No recent games yet.
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {derived.history.map((h) => {
                  const when = h.createdAt ? formatDateTime(h.createdAt) : "";
                  const outOf =
                    typeof h.totalQuestions === "number"
                      ? `/ ${h.totalQuestions}`
                      : "";
                  const label = String(h.gameType || "").replaceAll("_", " ");
                  const diff = h?.metadata?.difficulty
                    ? ` • ${h.metadata.difficulty}`
                    : "";
                  return (
                    <div
                      key={h.id}
                      className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-b-0"
                    >
                      <div className="text-white/80">
                        <div className="font-medium capitalize">
                          {label}
                          {diff}
                        </div>
                        <div className="text-xs text-white/50">{when}</div>
                      </div>
                      <div className="text-white font-semibold">
                        {typeof h.score === "number" ? h.score : "-"}
                        {outOf}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/${selectedCategory}/choose-continent`)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40"
            >
              Play{" "}
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
