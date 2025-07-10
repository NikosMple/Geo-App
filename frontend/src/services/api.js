import axios from 'axios';

const api = {
  getContinents: async () => {
    try {
      const response = await axios.get('/api/continents');
      return response.data;
    } catch (error) {
      throw new Error(`HTTP error! status: ${error.response?.status || 'Network Error'}`);
    }
  },

  getCapitalsQuizQuestions: async (continent, difficulty) => {
    try {
      const response = await axios.get(`/api/${continent}/${difficulty}`);
      return response.data;
    } catch (error) {
      throw new Error(`HTTP error! status: ${error.response?.status || 'Network Error'}`);
    }
  },

  checkAnswer: async (continent, questionText, userAnswer) => {
    try {
      const response = await axios.post('/api/check', {
        continent,
        question: questionText,
        userAnswer
      });
      return response.data;
    } catch (error) {
      throw new Error(`HTTP error! status: ${error.response?.status || 'Network Error'}`);
    }
  },

  getCountries: async () => {
    try{
      const response = await axios.get('api/countries');
      return response.data;
    } catch (error) {
      console.log('API Error:', error);
      throw new Error(`HTTP error! status: ${error.response?.status || 'Network Error'}`);
    }
  }
};

export default api;