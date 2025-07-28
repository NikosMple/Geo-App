import express from "express";
import {
  loadQuestions,
  getAvailableContinents,
  getAvailableCountries,
} from "../services/dataService.js";

const router = express.Router();

// -- Get all Continents --
router.get("/continents", async (req, res) => {
  try {
    const continents = await getAvailableContinents();
    res.json(continents);
  } catch (error) {
    console.error("Error loading continents:", error);
    res.status(500).json({ error: "Could not load continents" });
  }
});

// -- Get all Countries --
router.get("/countries", async (req, res) => {
  try {
    const countries = await getAvailableCountries();
    res.json(countries);
  } catch (error) {
    console.error("Error loading countries:", error);
    res.status(500).json({ error: "Could not load countries" });
  }
});

// -- Get specific difficulty for each continent --
router.get("/:continent/:difficulty", async (req, res) => {
  try {
    const { continent, difficulty } = req.params;

    console.log(`=== LOADING QUESTIONS ===`);
    console.log(`Continent: ${continent}, Difficulty: ${difficulty}`);

    // Validation
    if (!/^[a-zA-Z]+$/.test(continent)) {
      return res.status(400).json({ error: "Invalid continent name" });
    }

    const validDifficulties = ["easy", "medium", "hard", "random"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: "Invalid difficulty level" });
    }

    // Load questions from JSON file
    const questions = await loadQuestions(continent);

    //Filter Questions by Difficulty
    let filteredQuestions;

    if (difficulty === "random") {
      filteredQuestions = questions.sort(() => Math.random() - 0.5);
      console.log(
        `Random mode: shuffled all ${filteredQuestions.length} questions`
      );
    } else {
      filteredQuestions = questions.filter((q) => q.difficulty === difficulty);
      console.log(
        `Filtered to ${filteredQuestions.length} ${difficulty} questions`
      );
    }

    // Take only first 10 questions to avoid overwhelming the user
    filteredQuestions = filteredQuestions.slice(0, 10);

    // Debug: Show first question
    if (filteredQuestions.length > 0) {
      console.log(`First question:`, {
        question: filteredQuestions[0].question,
        difficulty: filteredQuestions[0].difficulty,
        answer: filteredQuestions[0].answer,
      });
    }

    res.json(filteredQuestions);
  } catch (error) {
    console.error("Error loading questions:", error);
    res.status(500).json({ error: "Could not load questions" });
  }
});

// -- Check the answer --
router.post("/check", async (req, res) => {
  try {
    const { continent, question: questionText, userAnswer } = req.body;

    console.log("=== CHECKING ANSWER ===");
    console.log("Continent:", continent);
    console.log("Question Text:", questionText);
    console.log("User Answer:", userAnswer);

    // Validation
    if (!continent || !questionText) {
      return res
        .status(400)
        .json({ error: "Missing required fields: continent and question" });
    }

    // Load questions from JSON file
    const questions = await loadQuestions(continent);

    console.log(`Total questions in file: ${questions.length}`);

    // Find the question by its text
    const question = questions.find((q) => q.question === questionText);
    if (!question) {
      console.log(
        "Available questions:",
        questions.map((q) => q.question)
      );
      return res.status(400).json({ error: "Question not found" });
    }

    console.log("Question from backend:", {
      question: question.question,
      correctAnswer: question.answer,
      difficulty: question.difficulty,
    });

    // Handle case where user didn't answer (time expired)
    if (!userAnswer || userAnswer === null) {
      console.log("No user answer provided (time expired)");
      return res.json({
        isCorrect: false,
        correctAnswer: question.answer,
        explanation: question.explanation || null,
      });
    }

    // Check if answer is correct (case-insensitive comparison)
    const isCorrect =
      question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

    console.log(
      `User answer "${userAnswer}" is ${isCorrect ? "CORRECT" : "WRONG"}`
    );
    console.log(`Correct answer: "${question.answer}"`);

    // Return result
    res.json({
      isCorrect,
      correctAnswer: question.answer,
      explanation: question.explanation || null,
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).json({ error: "Could not check answer" });
  }
});

// -- Specific continent --
router.get("/:continent", async (req, res) => {
  try {
    const continent = req.params.continent;

    if (!/^[a-zA-Z]+$/.test(continent)) {
      return res.status(400).json({ error: "Invalid continent name" });
    }

    const questions = await loadQuestions(continent);

    let filteredQuestions = questions;

    if (req.query.difficulty) {
      filteredQuestions = questions.filter(
        (q) => q.difficulty === req.query.difficulty
      );
    }
    res.json(filteredQuestions);
  } catch (error) {
    console.error("Error loading questions:", error);
    res.status(500).json({ error: "Could not load questions" });
  }
});

export default router;