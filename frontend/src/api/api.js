import apiClient from "@/api/apiClient";

const api = {
  getContinents: async () => {
    try {
      const response = await apiClient.get("/api/continents");
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  //-----------------------------------------------------------------------------------------------//

  // Player stats: save a finished game
  saveStats: async ({
    userId,
    gameType,
    score,
    totalQuestions,
    correctAnswers,
    durationSec,
    metadata,
  }) => {
    try {
      const response = await apiClient.post("/api/stats", {
        userId,
        gameType,
        score,
        totalQuestions,
        correctAnswers,
        durationSec,
        metadata,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  //-----------------------------------------------------------------------------------------------//

  // Player stats: fetch latest per game type (optionally include history)
  getUserStats: async (
    userId,
    { includeHistory = false, historyLimit = 10 } = {}
  ) => {
    try {
      const response = await apiClient.get(`/api/stats/${userId}`, {
        params: { includeHistory, historyLimit },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  // Add this method for getting available difficulties for a continent
  getContinentQuestions: async (continent) => {
    try {
      const response = await apiClient.get(`/api/${continent}`);
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  //-----------------------------------------------------------------------------------------------//

  getCapitalsQuizQuestions: async (continent, difficulty) => {
    try {
      const response = await apiClient.get(
        `/api/capitals/${continent}/${difficulty}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  //-----------------------------------------------------------------------------------------------//

  checkAnswer: async (continent, questionText, userAnswer) => {
    try {
      const response = await apiClient.post("/api/capitals/check", {
        continent,
        question: questionText,
        userAnswer,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  //-----------------------------------------------------------------------------------------------//

  getContinents: async () => {
    try {
      const response = await apiClient.get("/api/continents");
      console.log("Continents API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Continents API error:", error);
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  //-----------------------------------------------------------------------------------------------//

  getFlagsQuizQuestions: async (continent, difficulty) => {
    try {
      const response = await apiClient.get(
        `/api/flags/${continent}/${difficulty}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },

  //-----------------------------------------------------------------------------------------------//

  checkFlagAnswer: async (continent, country_code, userAnswer) => {
    try {
      const response = await apiClient.post("/api/flags/check", {
        continent,
        country_code,
        userAnswer,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `HTTP error! status: ${error.response?.status || "Network Error"}`
      );
    }
  },
};

export default api;
