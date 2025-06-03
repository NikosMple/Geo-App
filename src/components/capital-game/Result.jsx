import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Result = ({ score, totalQuestions, onResetQuiz }) => {
  const [mounted, setMounted] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Animate score counting up
    const timer = setTimeout(() => {
      setAnimateScore(true);
      let current = 0;
      const increment = score / 20; // 20 steps
      const counter = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(counter);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 50);
    }, 800);

    return () => clearTimeout(timer);
  }, [score]);

  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getPerformanceData = () => {
    if (percentage === 100) {
      return {
        message: '🌟 PERFECT SCORE!',
        subtitle: 'You are a geography master!',
        color: '#ffd93d',
        emoji: '👑',
        bgGradient: 'linear-gradient(135deg, rgba(255, 217, 61, 0.3), rgba(255, 107, 107, 0.3))'
      };
    }
    if (percentage >= 80) {
      return {
        message: '🎉 EXCELLENT!',
        subtitle: 'Outstanding knowledge of world capitals!',
        color: '#22c55e',
        emoji: '🏆',
        bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(0, 245, 255, 0.3))'
      };
    }
    if (percentage >= 60) {
      return {
        message: '👍 GREAT JOB!',
        subtitle: 'You have solid geography skills!',
        color: '#00f5ff',
        emoji: '🎯',
        bgGradient: 'linear-gradient(135deg, rgba(0, 245, 255, 0.3), rgba(99, 102, 241, 0.3))'
      };
    }
    return {
      message: '💪 KEEP LEARNING!',
      subtitle: 'Practice makes perfect - try again!',
      color: '#ff6b6b',
      emoji: '📚',
      bgGradient: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(245, 101, 101, 0.3))'
    };
  };

  const performance = getPerformanceData();

  return (
    <div className="premium-dashboard mounted">
      {/* Enhanced Animated Background */}
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        
        {/* Celebration particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {percentage >= 80 && [...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                fontSize: '2rem',
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animation: `celebration 3s linear infinite`
              }}
            >
              {['🎉', '⭐', '🏆', '🎊', '✨'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        {/* Results Section */}
        <div className="results-section" style={{ 
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease'
        }}>
          {/* Header Badge */}
          <div 
            className="hero-badge" 
            style={{ 
              marginBottom: '2rem',
              background: performance.bgGradient,
              border: `2px solid ${performance.color}`,
              boxShadow: `0 10px 30px ${performance.color}30`,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <span className="hero-badge-icon" style={{ fontSize: '1.5rem' }}>
              {performance.emoji}
            </span>
            <span style={{ fontWeight: '700' }}>Quiz Complete!</span>
          </div>

          {/* Performance Message */}
          <div style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '800',
            color: performance.color,
            marginBottom: '1rem',
            textShadow: `0 0 30px ${performance.color}50`,
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>
            {performance.message}
          </div>

          <div style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '3rem',
            fontWeight: '500'
          }}>
            {performance.subtitle}
          </div>

          {/* Main Score Display */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(30px)',
            borderRadius: '30px',
            padding: '3rem',
            marginBottom: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: performance.bgGradient,
              opacity: 0.3,
              animation: 'shimmer 3s ease-in-out infinite'
            }} />

            <h2 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '2rem',
              position: 'relative',
              zIndex: 2
            }}>
              Your Final Score
            </h2>

            {/* Circular Progress */}
            <div style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              margin: '0 auto 2rem',
              zIndex: 2
            }}>
              {/* Background circle */}
              <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={performance.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
                  style={{
                    transition: 'stroke-dashoffset 2s ease-in-out 0.5s',
                    filter: `drop-shadow(0 0 10px ${performance.color})`
                  }}
                />
              </svg>
              
              {/* Score text in center */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  background: `linear-gradient(135deg, ${performance.color}, #ffffff)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1'
                }}>
                  {animateScore ? displayScore : 0}/{totalQuestions}
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '600',
                  marginTop: '0.5rem'
                }}>
                  {percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="stats-grid" style={{ 
            marginBottom: '4rem',
            gap: '2rem'
          }}>
            <div 
              className="stat-card" 
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                transform: animateScore ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                opacity: animateScore ? 1 : 0,
                transition: 'all 0.6s ease 0.8s'
              }}
            >
              <div className="stat-icon" style={{ fontSize: '2.5rem' }}>✅</div>
              <div className="stat-number" style={{ 
                color: '#22c55e',
                fontSize: '2.5rem',
                textShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
              }}>
                {score}
              </div>
              <div className="stat-label">Correct Answers</div>
            </div>
            
            <div 
              className="stat-card"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                transform: animateScore ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                opacity: animateScore ? 1 : 0,
                transition: 'all 0.6s ease 1s'
              }}
            >
              <div className="stat-icon" style={{ fontSize: '2.5rem' }}>❌</div>
              <div className="stat-number" style={{ 
                color: '#ef4444',
                fontSize: '2.5rem',
                textShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
              }}>
                {totalQuestions - score}
              </div>
              <div className="stat-label">Missed</div>
            </div>
            
            <div 
              className="stat-card"
              style={{
                background: 'rgba(0, 245, 255, 0.1)',
                border: '2px solid rgba(0, 245, 255, 0.3)',
                transform: animateScore ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                opacity: animateScore ? 1 : 0,
                transition: 'all 0.6s ease 1.2s'
              }}
            >
              <div className="stat-icon" style={{ fontSize: '2.5rem' }}>📊</div>
              <div className="stat-number" style={{ 
                color: '#00f5ff',
                fontSize: '2.5rem',
                textShadow: '0 0 20px rgba(0, 245, 255, 0.5)'
              }}>
                {percentage}%
              </div>
              <div className="stat-label">Accuracy</div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap'
          }}>
            <button
              onClick={onResetQuiz}
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #0099cc)',
                border: 'none',
                borderRadius: '20px',
                padding: '1.5rem 2.5rem',
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 15px 40px rgba(0, 245, 255, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                transform: animateScore ? 'translateY(0)' : 'translateY(20px)',
                opacity: animateScore ? 1 : 0,
                transitionDelay: '1.4s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 50px rgba(0, 245, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 15px 40px rgba(0, 245, 255, 0.3)';
              }}
            >
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.8rem',
                position: 'relative',
                zIndex: 2
              }}>
                <span style={{ fontSize: '1.5rem' }}>🌍</span>
                <span>Try Another Continent</span>
              </span>
              
              {/* Button shine effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                animation: 'shine 3s ease infinite'
              }} />
            </button>

            <Link
              to="/"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '1.5rem 2.5rem',
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#ffffff',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                backdropFilter: 'blur(10px)',
                transform: animateScore ? 'translateY(0)' : 'translateY(20px)',
                opacity: animateScore ? 1 : 0,
                transitionDelay: '1.6s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px) scale(1.05)';
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏠</span>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Enhanced CSS animations */}
        <style jsx>{`
          @keyframes celebration {
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

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes glow {
            0% {
              text-shadow: 0 0 20px currentColor;
            }
            100% {
              text-shadow: 0 0 30px currentColor, 0 0 40px currentColor;
            }
          }

          @keyframes shimmer {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.6;
            }
          }

          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
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

export default Result;