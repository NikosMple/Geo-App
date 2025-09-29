import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('capitals');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="app-background min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const categoryStats = userProfile?.categoryStats || {
    capitals: { totalGames: 0, totalScore: 0, bestScore: 0, averageScore: 0, continentStats: {} },
    flags: { totalGames: 0, totalScore: 0, bestScore: 0, averageScore: 0, continentStats: {} }
  };

  const currentCategoryStats = categoryStats[selectedCategory];
  const continentStats = currentCategoryStats?.continentStats || {};

  const getCategoryIcon = (category) => {
    return category === 'capitals' ? '🏛️' : '🏳️';
  };

  const getStatCard = (title, value, subtitle, colorClass = 'text-white') => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5">
      <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</p>
      {subtitle && <p className="text-white/50 text-sm">{subtitle}</p>}
    </div>
  );

  const getContinentFlag = (continent) => {
    const flags = {
      europe: '🇪🇺',
      asia: '🌏',
      africa: '🌍',
      america: '🌎',
      oceania: '🇦🇺',
      boss: '👑'
    };
    return flags[continent.toLowerCase()] || '🌍';
  };

  return (
    <div className={`app-background min-h-screen ${mounted ? 'mounted' : ''}`}>
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
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-3 text-white bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
              {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-white">
              <p className="font-bold text-lg">{userProfile?.displayName || 'User'}</p>
              <p className="text-white/60 text-sm">Level {userProfile?.level || 1}</p>
            </div>
          </div>
        </header>

        {/* Overall Stats Summary */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Geography Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {getStatCard('Total Games', userProfile?.totalGames || 0, 'All categories', 'text-blue-400')}
            {getStatCard('Total Score', userProfile?.totalScore || 0, 'Points earned', 'text-emerald-400')}
            {getStatCard('Average Score', 
              userProfile?.totalGames > 0 ? 
                Math.round(((userProfile?.totalScore || 0) / (userProfile?.totalGames || 1)) * 100) / 100 : 0, 
              'Per game', 'text-yellow-400')}
            {getStatCard('Profile Level', userProfile?.level || 1, 'Current level', 'text-purple-400')}
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex gap-2">
              {Object.keys(categoryStats).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                    selectedCategory === category
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <span className="capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category-Specific Stats */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-3xl">{getCategoryIcon(selectedCategory)}</span>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Statistics
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            {getStatCard('Total Games', currentCategoryStats?.totalGames || 0, selectedCategory, 'text-cyan-400')}
            {getStatCard('Total Score', currentCategoryStats?.totalScore || 0, 'Points earned', 'text-emerald-400')}
            {getStatCard('Best Score', `${currentCategoryStats?.bestScore || 0}%`, 'Best percentage', 'text-yellow-400')}
            {getStatCard('Average Score', currentCategoryStats?.averageScore || 0, 'Per game average', 'text-purple-400')}
          </div>
        </div>

        {/* Continent Breakdown */}
        {Object.keys(continentStats).length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Continent Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(continentStats).map(([continent, stats]) => (
                <div
                  key={continent}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{getContinentFlag(continent)}</span>
                    <h4 className="text-lg font-bold text-white capitalize">{continent}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Games Played:</span>
                      <span className="text-white font-medium">{stats.totalGames || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Score:</span>
                      <span className="text-emerald-400 font-medium">{stats.totalScore || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Best Score:</span>
                      <span className="text-yellow-400 font-medium">{stats.bestScore || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Average:</span>
                      <span className="text-purple-400 font-medium">{stats.averageScore || 0}</span>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  {stats.difficulties && Object.keys(stats.difficulties).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-white/60 text-sm mb-2">Difficulty Breakdown:</p>
                      <div className="space-y-2">
                        {Object.entries(stats.difficulties).map(([difficulty, diffStats]) => (
                          <div key={difficulty} className="flex items-center justify-between text-sm">
                            <span className="text-white/70 capitalize">{difficulty}:</span>
                            <div className="flex gap-2">
                              <span className="text-white/60">{diffStats.totalGames}g</span>
                              <span className="text-yellow-400">{diffStats.bestScore}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {Object.keys(continentStats).length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{getCategoryIcon(selectedCategory)}</div>
            <h3 className="text-2xl font-bold text-white mb-4">No {selectedCategory} data yet</h3>
            <p className="text-white/60 mb-8">Start playing {selectedCategory} quizzes to see your statistics here!</p>
            <button
              onClick={() => navigate(`/${selectedCategory}/choose-continent`)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/40"
            >
              Start Playing {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center pt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/${selectedCategory}/choose-continent`)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40"
            >
              Play {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </button>
            <button
              onClick={() => navigate('/')}
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