import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredGameMode, setHoveredGameMode] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const gameModes = [
    { 
      name: 'Capitals Quiz', 
      icon: '🏛️', 
      path: '/choose-continent',
      description: 'Guess the capital cities of countries',
      features: ['195+ Countries', 'Multiple Choice']
    },
    { 
      name: 'Flags Quiz', 
      icon: '🏳️', 
      path: '/quiz/flags',
      description: 'Identify countries by their flags',
      features: ['All World Flags', 'Visual Challenge']
    }
  ];

  return (
    <div className={mounted ? 'premium-dashboard mounted' : 'premium-dashboard'}>
      {/* Animated Background Elements */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">
            <span className="hero-badge-icon">🌟</span>
            <span>Ultimate Geography Challenge</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line-1">GEOGRAPHY</span>
            <span className="title-line-2">
              <span className="title-globe">🌍</span>
              MASTER
            </span>
          </h1>
          
          <p className="hero-subtitle">
            Test your knowledge with capitals and flags from around the world
          </p>
          
          <div className="hero-description">
            Two exciting game modes to challenge your geography skills
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-number">195+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-number">2</div>
            <div className="stat-label">Game Modes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❓</div>
            <div className="stat-number">15</div>
            <div className="stat-label">Questions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-number">7s</div>
            <div className="stat-label">Per Question</div>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="continent-selection-section">
          <h2 className="section-title">
            <span className="section-icon">🎯</span>
            Choose Your Game Mode
          </h2>
          
          <div className="continents-grid">
            {gameModes.map((gameMode, index) => {
              const gameModeClass = 'continent-card game-mode-' + gameMode.name.toLowerCase().replace(' ', '-');
              const hoverClass = hoveredGameMode === gameMode.name ? ' hovered' : '';
              const finalClass = gameModeClass + hoverClass;
              
              return (
                <Link
                  key={gameMode.name}
                  to={gameMode.path}
                  className={finalClass}
                  style={{ 
                    animationDelay: (index * 0.2) + 's'
                  }}
                  onMouseEnter={() => setHoveredGameMode(gameMode.name)}
                  onMouseLeave={() => setHoveredGameMode(null)}
                >
                  <div className="continent-card-inner">
                    <div className="continent-header">
                      <span className="continent-icon">{gameMode.icon}</span>
                      
                    </div>
                    
                    <h3 className="continent-name">{gameMode.name}</h3>
                    <p className="continent-description">{gameMode.description}</p>
                    
                    {/* Game Mode Features */}
                    <div className="game-mode-features">
                      {gameMode.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="continent-action">
                      <span>Start Playing</span>
                      <span className="action-arrow">→</span>
                    </div>
                  </div>
                  
                  <div className="continent-card-glow"></div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-content">
                <h4>Lightning Fast</h4>
                <span>Instant feedback & scoring</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <div className="feature-content">
                <h4>Track Progress</h4>
                <span>See your improvement over time</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌐</div>
              <div className="feature-content">
                <h4>Global Coverage</h4>
                <span>Every continent, every country</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;