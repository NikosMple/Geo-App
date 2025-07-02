const API_BASE_URL = 'http://localhost:3001';

const api = {
  getContinents: async () => {
    const response = await fetch(`${API_BASE_URL}/capitals/continents`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getCapitalsQuizQuestions: async (continent, difficulty) => {
    const response = await fetch(`${API_BASE_URL}/capitals/${continent}/${difficulty}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  checkAnswer: async (continent, questionText, userAnswer) => {
    const response = await fetch(`${API_BASE_URL}/capitals/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ continent, question: questionText, userAnswer }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

export default api;