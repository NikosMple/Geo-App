import express from 'express';
import { loadQuestions, getAvailableContinents } from '../services/dataService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/continents', async (req, res) => {
    try {
        const continents = await getAvailableContinents();
        res.json(continents);
    } catch (error) {
        console.error('Error loading continents:', error);
        res.status(500).json({ error: 'Could not load continents' });
    }
});

router.get('/:continent/:difficulty', async (req, res) => {
    try {
        const { continent, difficulty } = req.params;
        
        console.log(`=== LOADING QUESTIONS ===`);
        console.log(`Continent: ${continent}, Difficulty: ${difficulty}`);
        
        // Validation
        if (!/^[a-zA-Z]+$/.test(continent)) {
            return res.status(400).json({ error: 'Invalid continent name' });
        }
        
        const validDifficulties = ['easy', 'medium', 'hard', 'random'];
        if (!validDifficulties.includes(difficulty)) {
            return res.status(400).json({ error: 'Invalid difficulty level' });
        }
        
        // Load questions from JSON file
        const questions = await loadQuestions(continent);
        
        let filteredQuestions;
        
        if (difficulty === 'random') {
            // Shuffle all questions for random mode
            filteredQuestions = questions.sort(() => Math.random() - 0.5);
            console.log(`Random mode: shuffled all ${filteredQuestions.length} questions`);
        } else {
            // Filter by specific difficulty
            filteredQuestions = questions.filter(q => q.difficulty === difficulty);
            console.log(`Filtered to ${filteredQuestions.length} ${difficulty} questions`);
        }
        
        // Take only first 10 questions to avoid overwhelming the user
        filteredQuestions = filteredQuestions.slice(0, 10);
        
        // Debug: Show first question
        if (filteredQuestions.length > 0) {
            console.log(`First question:`, {
                question: filteredQuestions[0].question,
                difficulty: filteredQuestions[0].difficulty,
                answer: filteredQuestions[0].answer
            });
        }
        
        res.json(filteredQuestions);
        
    } catch (error) {
        console.error('Error loading questions:', error);
        res.status(500).json({ error: 'Could not load questions' });
    }
});

// =============================================================================
// POST /capitals/check
// Ελέγχει αν η απάντηση του χρήστη είναι σωστή
// =============================================================================
router.post('/check', async (req, res) => {
    try {
        const { continent, question: questionText, userAnswer } = req.body;

        console.log('=== CHECKING ANSWER ===');
        console.log('Continent:', continent);
        console.log('Question Text:', questionText);
        console.log('User Answer:', userAnswer);

        // Validation
        if (!continent || !questionText) {
            return res.status(400).json({ error: 'Missing required fields: continent and question' });
        }

        // Load questions from JSON file
        const questions = await loadQuestions(continent);

        console.log(`Total questions in file: ${questions.length}`);

        // Find the question by its text
        const question = questions.find(q => q.question === questionText);
        if (!question) {
            console.log('Available questions:', questions.map(q => q.question));
            return res.status(400).json({ error: 'Question not found' });
        }

        console.log('Question from backend:', {
            question: question.question,
            correctAnswer: question.answer,
            difficulty: question.difficulty
        });

        // Handle case where user didn't answer (time expired)
        if (!userAnswer || userAnswer === null) {
            console.log('No user answer provided (time expired)');
            return res.json({
                isCorrect: false,
                correctAnswer: question.answer,
                explanation: question.explanation || null
            });
        }

        // Check if answer is correct (case-insensitive comparison)
        const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

        console.log(`User answer "${userAnswer}" is ${isCorrect ? 'CORRECT' : 'WRONG'}`);
        console.log(`Correct answer: "${question.answer}"`);

        // Return result
        res.json({
            isCorrect,
            correctAnswer: question.answer,
            explanation: question.explanation || null
        });

    } catch (error) {
        console.error('Error checking answer:', error);
        res.status(500).json({ error: 'Could not check answer' });
    }
});

// =============================================================================
// LEGACY ROUTE - For backward compatibility
// =============================================================================
router.get('/:continent', async (req, res) => {
    try {
        const continent = req.params.continent;
        
        if (!/^[a-zA-Z]+$/.test(continent)) {
            return res.status(400).json({ error: 'Invalid continent name' });
        }
        
        const questions = await loadQuestions(continent);

        let filteredQuestions = questions;

        if (req.query.difficulty) {
            filteredQuestions = questions.filter(q => q.difficulty === req.query.difficulty);
        }

        res.json(filteredQuestions);
        
    } catch (error) {
        console.error('Error loading questions:', error);
        res.status(500).json({ error: 'Could not load questions' });
    }
});

export default router;