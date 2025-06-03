import React, { useState, useEffect } from 'react';

const QuizOptions = ({ 
  questionData, 
  currentQuestion, 
  totalQuestions, 
  score, 
  onAnswerSelect, 
  onNextQuestion 
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Animate question entrance
    const timer = setTimeout(() => setShowQuestion(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Reset animation when question changes
  useEffect(() => {
    setShowQuestion(false);
    const timer = setTimeout(() => setShowQuestion(true), 150);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return; // Prevent multiple selections
    
    const correct = answer === questionData.capital;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Pass the result back to parent
    onAnswerSelect(correct);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setShowQuestion(false);
    setTimeout(() => onNextQuestion(), 300);
  };

  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

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
        
        {/* Dynamic background particles based on question */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={`${currentQuestion}-${i}`}
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                background: `hsl(${180 + (currentQuestion * 60)}, 70%, 60%)`,
                borderRadius: '50%',
                left: `${20 + (i * 10)}%`,
                top: `${10 + (i * 15)}%`,
                animation: `sparkle 2s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                boxShadow: `0 0 10px hsl(${180 + (currentQuestion * 60)}, 70%, 60%)`
              }}
            />
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quiz-section">
          {/* Enhanced Progress Section */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00f5ff, #ff6b6b, #ffd93d)',
                borderRadius: '4px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)'
              }}>
                {/* Progress glow effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '20px',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6))',
                  animation: 'shimmer 2s ease-in-out infinite'
                }} />
              </div>
            </div>

            {/* Question Counter and Score */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div className="hero-badge" style={{ 
                background: 'rgba(0, 245, 255, 0.2)',
                border: '1px solid rgba(0, 245, 255, 0.3)'
              }}>
                <span className="hero-badge-icon">📍</span>
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#22c55e'
                }}>
                  <span>🎯</span>
                  <span>{score} Correct</span>
                </div>
                <div style={{
                  width: '1px',
                  height: '20px',
                  background: 'rgba(255, 255, 255, 0.3)'
                }} />
                <div style={{
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {Math.round((score / Math.max(currentQuestion, 1)) * 100)}% Accuracy
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Question Display */}
          <div 
            className="question-section" 
            style={{
              textAlign: 'center',
              marginBottom: '4rem',
              transform: showQuestion ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              opacity: showQuestion ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '1rem',
              letterSpacing: '0.5px'
            }}>
              What is the capital of
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #00f5ff, #ff6b6b, #ffd93d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              marginBottom: '0.5rem',
              position: 'relative',
              display: 'inline-block'
            }}>
              {questionData.country}
              <span style={{
                fontSize: '0.6em',
                marginLeft: '0.3em'
              }}>?</span>
              
              {/* Underline effect */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: showQuestion ? '100%' : '0%',
                height: '3px',
                background: 'linear-gradient(90deg, #00f5ff, #ff6b6b)',
                borderRadius: '2px',
                transition: 'width 0.8s ease 0.3s'
              }} />
            </h1>

            {/* Country flag hint */}
            <div style={{
              fontSize: '2rem',
              marginTop: '1rem',
              opacity: 0.6
            }}>
              {/* You could add country flag emojis here based on questionData.country */}
            </div>
          </div>

          {/* Enhanced Answer Options */}
          <div 
            className="answers-grid" 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              maxWidth: '900px',
              margin: '0 auto',
              marginBottom: '3rem'
            }}
          >
            {questionData.options.map((option, index) => {
              let isCorrectOption = option === questionData.capital;
              let isSelectedWrong = option === selectedAnswer && !isCorrect;
              let shouldHighlight = showFeedback && (isCorrectOption || isSelectedWrong);
              
              const baseStyle = {
                cursor: showFeedback ? 'default' : 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: showQuestion ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                opacity: showQuestion ? 1 : 0,
                transitionDelay: `${index * 0.1 + 0.3}s`,
                position: 'relative',
                overflow: 'hidden'
              };

              let dynamicStyle = { ...baseStyle };

              if (showFeedback) {
                if (isCorrectOption) {
                  dynamicStyle = {
                    ...dynamicStyle,
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))',
                    borderColor: '#22c55e',
                    boxShadow: '0 10px 40px rgba(34, 197, 94, 0.3), 0 0 0 2px rgba(34, 197, 94, 0.5)',
                    transform: 'translateY(-5px) scale(1.02)'
                  };
                } else if (isSelectedWrong) {
                  dynamicStyle = {
                    ...dynamicStyle,
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
                    borderColor: '#ef4444',
                    boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3), 0 0 0 2px rgba(239, 68, 68, 0.5)',
                    animation: 'shake 0.5s ease-in-out'
                  };
                } else {
                  dynamicStyle = {
                    ...dynamicStyle,
                    opacity: 0.4,
                    transform: 'scale(0.95)'
                  };
                }
              }

              return (
                <div
                  key={index}
                  className="continent-card"
                  style={dynamicStyle}
                  onClick={() => handleAnswerSelect(option)}
                  onMouseEnter={(e) => {
                    if (!showFeedback) {
                      e.target.style.transform = 'translateY(-3px) scale(1.02)';
                      e.target.style.boxShadow = '0 15px 50px rgba(0, 245, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showFeedback) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                >
                  {/* Option background animation */}
                  {!showFeedback && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.1), transparent)',
                      transition: 'left 0.6s ease',
                    }} />
                  )}

                  <div className="continent-card-inner" style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '1.5rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.4rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: shouldHighlight ? '1rem' : '0',
                      color: isCorrectOption && showFeedback ? '#22c55e' : 
                             isSelectedWrong && showFeedback ? '#ef4444' : '#ffffff'
                    }}>
                      {option}
                    </h3>
                    
                    {showFeedback && isCorrectOption && (
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: '#22c55e', 
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        animation: 'bounceIn 0.6s ease'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>✓</span>
                        <span>Correct!</span>
                      </div>
                    )}
                    
                    {showFeedback && isSelectedWrong && (
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: '#ef4444', 
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        animation: 'bounceIn 0.6s ease'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>✗</span>
                        <span>Try Again</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Feedback Section */}
          {showFeedback && (
            <div style={{ 
              textAlign: 'center',
              animation: 'slideUpFade 0.6s ease',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
            }}>
              {/* Main feedback message */}
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                {isCorrect ? (
                  <>
                    <span style={{ 
                      fontSize: '2.5rem',
                      animation: 'bounce 1s ease infinite'
                    }}>🎉</span>
                    <span style={{ color: '#22c55e' }}>Excellent!</span>
                  </>
                ) : (
                  <>
                    <span style={{ 
                      fontSize: '2.5rem',
                      animation: 'wobble 1s ease'
                    }}>💡</span>
                    <span style={{ color: '#ffd93d' }}>Learning Moment</span>
                  </>
                )}
              </div>

              {/* Correct answer reveal */}
              {!isCorrect && (
                <div style={{
                  fontSize: '1.3rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(0, 245, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 245, 255, 0.3)'
                }}>
                  The capital of <strong style={{ color: '#00f5ff' }}>{questionData.country}</strong> is{' '}
                  <strong style={{ 
                    color: '#22c55e',
                    fontSize: '1.4em'
                  }}>{questionData.capital}</strong>
                </div>
              )}
              
              {/* Updated score display */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>📊</span>
                  <span>Score: <strong style={{ color: '#00f5ff' }}>{score}/{currentQuestion + 1}</strong></span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>🎯</span>
                  <span>Accuracy: <strong style={{ color: '#22c55e' }}>{Math.round((score / (currentQuestion + 1)) * 100)}%</strong></span>
                </div>
              </div>

              {/* Enhanced Next Button */}
              <button
                onClick={handleNext}
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #0099cc)',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '1rem 2.5rem',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(0, 245, 255, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0, 245, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(0, 245, 255, 0.3)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'View Results'} →
                </span>
                
                {/* Button shine effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shine 2s ease infinite'
                }} />
              </button>
            </div>
          )}
        </div>

        {/* Enhanced CSS animations */}
        <style jsx>{`
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-20px);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateX(20px);
              opacity: 0;
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideUpFade {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translateY(0);
            }
            40%, 43% {
              transform: translateY(-10px);
            }
            70% {
              transform: translateY(-5px);
            }
            90% {
              transform: translateY(-2px);
            }
          }

          @keyframes wobble {
            0% { transform: rotate(0deg); }
            15% { transform: rotate(-5deg); }
            30% { transform: rotate(3deg); }
            45% { transform: rotate(-3deg); }
            60% { transform: rotate(2deg); }
            75% { transform: rotate(-1deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default QuizOptions;