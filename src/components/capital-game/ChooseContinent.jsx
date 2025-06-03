import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChooseContinent = ({ onContinentSelect, continents }) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredContinent, setHoveredContinent] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={mounted ? 'premium-dashboard mounted' : 'premium-dashboard'}>
      {/* Enhanced Animated Background */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4" style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            top: '70%',
            right: '15%',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '3s'
          }}></div>
        </div>
        
        {/* Floating particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: 'rgba(0, 245, 255, 0.6)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animation: `floatUp 4s linear infinite`
              }}
            />
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        {/* Enhanced Header */}
        <div className="hero-section" style={{ 
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 10
        }}>
          <Link 
            to="/" 
            className="hero-badge" 
            style={{ 
              textDecoration: 'none', 
              display: 'inline-flex',
              transition: 'all 0.3s ease',
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0, 245, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            }}
          >
            <span className="hero-badge-icon" style={{ 
              fontSize: '1.2rem',
              transition: 'transform 0.3s ease' 
            }}>←</span>
            <span style={{ fontWeight: '600' }}>Back to Dashboard</span>
          </Link>
          
          <h1 className="hero-title" style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1.5rem',
            position: 'relative'
          }}>
            <span className="title-line-1" style={{
              background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }}>CAPITAL</span>
            <span className="title-line-2" style={{
              background: 'linear-gradient(135deg, #00f5ff, #ff6b6b, #ffd93d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }}>
              <span className="title-globe" style={{ 
                fontSize: '1.2em',
                filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.6))',
                animation: 'pulse 2s ease-in-out infinite'
              }}>🏛️</span>
              QUEST
            </span>
          </h1>

          <div style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '400',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Embark on a journey to discover the world's capitals
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⏱️</span>
              <span>5 Questions per Region</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              <span>Multiple Choice</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🏆</span>
              <span>Instant Results</span>
            </div>
          </div>
        </div>

        {/* Enhanced Continent Selection */}
        <div className="continent-selection-section">
          <h2 className="section-title" style={{
            fontSize: '2.5rem',
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            <span className="section-icon" style={{ 
              fontSize: '2rem',
              marginRight: '1rem',
              filter: 'drop-shadow(0 0 15px rgba(0, 245, 255, 0.5))'
            }}>🌍</span>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff, #00f5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Choose Your Adventure</span>
          </h2>
          
          <div className="continents-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {continents.map((continent, index) => (
              <div
                key={continent.name}
                className={`continent-card ${hoveredContinent === continent.name ? 'hovered' : ''}`}
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  cursor: 'pointer',
                  position: 'relative',
                  background: hoveredContinent === continent.name 
                    ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(255, 107, 107, 0.15))'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: hoveredContinent === continent.name 
                    ? '2px solid rgba(0, 245, 255, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2rem',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredContinent === continent.name ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredContinent === continent.name 
                    ? '0 20px 60px rgba(0, 245, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    : '0 10px 30px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden'
                }}
                onClick={() => onContinentSelect(continent.name)}
                onMouseEnter={() => setHoveredContinent(continent.name)}
                onMouseLeave={() => setHoveredContinent(null)}
              >
                {/* Animated background gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: hoveredContinent === continent.name 
                    ? 'linear-gradient(45deg, rgba(0, 245, 255, 0.1), rgba(255, 107, 107, 0.1), rgba(255, 217, 61, 0.1))'
                    : 'transparent',
                  opacity: hoveredContinent === continent.name ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                  backgroundSize: '400% 400%',
                  animation: hoveredContinent === continent.name ? 'gradientShift 3s ease infinite' : 'none'
                }} />

                <div className="continent-card-inner" style={{ position: 'relative', zIndex: 2 }}>
                  <div className="continent-header" style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <span 
                      className="continent-icon" 
                      style={{ 
                        fontSize: '4rem',
                        display: 'block',
                        marginBottom: '1rem',
                        filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.4))',
                        transition: 'all 0.3s ease',
                        transform: hoveredContinent === continent.name ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
                      }}
                    >
                      {continent.icon}
                    </span>
                  </div>
                  
                  <h3 className="continent-name" style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    background: hoveredContinent === continent.name 
                      ? 'linear-gradient(135deg, #00f5ff, #ff6b6b)'
                      : 'linear-gradient(135deg, #ffffff, #e0e7ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transition: 'all 0.3s ease',
                    // Fix for hover issue - ensure text is always visible
                    color: hoveredContinent === continent.name ? 'transparent' : '#ffffff',
                    textShadow: hoveredContinent === continent.name ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>
                    {continent.name}
                  </h3>
                  
                  <p className="continent-description" style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    {continent.countries.length} fascinating capitals to explore
                  </p>

                  {/* Progress indicators */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    {[...Array(continent.countries.length)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: hoveredContinent === continent.name 
                            ? 'rgba(0, 245, 255, 0.8)' 
                            : 'rgba(255, 255, 255, 0.3)',
                          transition: 'all 0.3s ease',
                          transform: hoveredContinent === continent.name ? 'scale(1.2)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="continent-action" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: hoveredContinent === continent.name ? '#00f5ff' : 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease'
                  }}>
                    <span>Begin Journey</span>
                    <span 
                      className="action-arrow" 
                      style={{
                        transition: 'transform 0.3s ease',
                        transform: hoveredContinent === continent.name ? 'translateX(5px)' : 'translateX(0)'
                      }}
                    >
                      →
                    </span>
                  </div>
                </div>
                
                <div className="continent-card-glow" style={{
                  opacity: hoveredContinent === continent.name ? 1 : 0,
                  transition: 'opacity 0.4s ease'
                }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional styling for animations */}
        <style jsx>{`
          @keyframes floatUp {
            0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-10px) rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChooseContinent;