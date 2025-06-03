import React, { useState } from 'react';
import ChooseContinent from './capital-game/ChooseContinent';
import QuizOptions from './capital-game/QuizOptions';
import Result from './capital-game/Result';

const Capital = () => {
  const [currentStep, setCurrentStep] = useState('continent'); // 'continent', 'quiz', 'results'
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  // Continental data with countries and capitals - Updated with proper icons
  const continents = [
    { 
      name: 'Africa', 
      icon: '🌍', 
      countries: [
        { country: 'Nigeria', capital: 'Abuja', options: ['Lagos', 'Abuja', 'Kano', 'Ibadan'] },
        { country: 'Egypt', capital: 'Cairo', options: ['Alexandria', 'Giza', 'Cairo', 'Luxor'] },
        { country: 'South Africa', capital: 'Cape Town', options: ['Johannesburg', 'Durban', 'Cape Town', 'Pretoria'] },
        { country: 'Kenya', capital: 'Nairobi', options: ['Mombasa', 'Nairobi', 'Kisumu', 'Nakuru'] },
        { country: 'Morocco', capital: 'Rabat', options: ['Casablanca', 'Marrakech', 'Fez', 'Rabat'] }
      ]
    },
    { 
      name: 'Europe', 
      icon: '🏰', 
      countries: [
        { country: 'France', capital: 'Paris', options: ['Lyon', 'Marseille', 'Paris', 'Nice'] },
        { country: 'Germany', capital: 'Berlin', options: ['Munich', 'Hamburg', 'Cologne', 'Berlin'] },
        { country: 'Italy', capital: 'Rome', options: ['Milan', 'Naples', 'Rome', 'Turin'] },
        { country: 'Spain', capital: 'Madrid', options: ['Barcelona', 'Valencia', 'Seville', 'Madrid'] },
        { country: 'Poland', capital: 'Warsaw', options: ['Krakow', 'Warsaw', 'Gdansk', 'Wroclaw'] }
      ]
    },
    { 
      name: 'Asia', 
      icon: '🏮', 
      countries: [
        { country: 'Japan', capital: 'Tokyo', options: ['Osaka', 'Tokyo', 'Kyoto', 'Yokohama'] },
        { country: 'China', capital: 'Beijing', options: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'] },
        { country: 'India', capital: 'New Delhi', options: ['Mumbai', 'Kolkata', 'Chennai', 'New Delhi'] },
        { country: 'Thailand', capital: 'Bangkok', options: ['Chiang Mai', 'Phuket', 'Bangkok', 'Pattaya'] },
        { country: 'South Korea', capital: 'Seoul', options: ['Busan', 'Seoul', 'Incheon', 'Daegu'] }
      ]
    },
    { 
      name: 'North America', 
      icon: '🗽', 
      countries: [
        { country: 'United States', capital: 'Washington D.C.', options: ['New York', 'Los Angeles', 'Chicago', 'Washington D.C.'] },
        { country: 'Canada', capital: 'Ottawa', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'] },
        { country: 'Mexico', capital: 'Mexico City', options: ['Guadalajara', 'Monterrey', 'Mexico City', 'Puebla'] },
        { country: 'Cuba', capital: 'Havana', options: ['Santiago', 'Havana', 'Camagüey', 'Holguín'] },
        { country: 'Jamaica', capital: 'Kingston', options: ['Montego Bay', 'Spanish Town', 'Kingston', 'Portmore'] }
      ]
    },
    { 
      name: 'South America', 
      icon: '🌎', 
      countries: [
        { country: 'Brazil', capital: 'Brasília', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'] },
        { country: 'Argentina', capital: 'Buenos Aires', options: ['Córdoba', 'Rosario', 'Buenos Aires', 'Mendoza'] },
        { country: 'Chile', capital: 'Santiago', options: ['Valparaíso', 'Concepción', 'Santiago', 'Antofagasta'] },
        { country: 'Peru', capital: 'Lima', options: ['Cusco', 'Arequipa', 'Lima', 'Trujillo'] },
        { country: 'Colombia', capital: 'Bogotá', options: ['Medellín', 'Cali', 'Barranquilla', 'Bogotá'] }
      ]
    },
    { 
      name: 'Oceania', 
      icon: '🏝️', 
      countries: [
        { country: 'Australia', capital: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'] },
        { country: 'New Zealand', capital: 'Wellington', options: ['Auckland', 'Christchurch', 'Hamilton', 'Wellington'] },
        { country: 'Fiji', capital: 'Suva', options: ['Nadi', 'Lautoka', 'Suva', 'Labasa'] },
        { country: 'Papua New Guinea', capital: 'Port Moresby', options: ['Lae', 'Mount Hagen', 'Port Moresby', 'Madang'] },
        { country: 'Samoa', capital: 'Apia', options: ['Apia', 'Salelologa', 'Leulumoega', 'Falefa'] }
      ]
    }
  ];

  // Get current continent data
  const getCurrentContinent = () => {
    return continents.find(c => c.name === selectedContinent);
  };

  // Get current question data
  const getCurrentQuestionData = () => {
    const continent = getCurrentContinent();
    return continent ? continent.countries[currentQuestion] : null;
  };

  // Handle continent selection
  const handleContinentSelect = (continentName) => {
    setSelectedContinent(continentName);
    setCurrentStep('quiz');
    setCurrentQuestion(0);
    setScore(0);
  };

  // Handle answer selection
  const handleAnswerSelect = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    const continent = getCurrentContinent();
    
    if (currentQuestion < continent.countries.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      setCurrentStep('results');
    }
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setCurrentStep('continent');
    setSelectedContinent(null);
    setCurrentQuestion(0);
    setScore(0);
  };

  // Render appropriate component based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'continent':
        return (
          <ChooseContinent 
            continents={continents}
            onContinentSelect={handleContinentSelect}
          />
        );
      
      case 'quiz':
        const continent = getCurrentContinent();
        const questionData = getCurrentQuestionData();
        
        if (!continent || !questionData) return null;
        
        return (
          <QuizOptions
            questionData={questionData}
            currentQuestion={currentQuestion}
            totalQuestions={continent.countries.length}
            score={score}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
          />
        );
      
      case 'results':
        const resultContinent = getCurrentContinent();
        
        if (!resultContinent) return null;
        
        return (
          <Result
            score={score}
            totalQuestions={resultContinent.countries.length}
            onResetQuiz={handleResetQuiz}
          />
        );
      
      default:
        return null;
    }
  };

  return renderCurrentStep();
};

export default Capital;