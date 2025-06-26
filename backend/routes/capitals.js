import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// GET /capitals/continents
// Επιστρέφει λίστα με όλες τις διαθέσιμες ηπείρους
// Response: ["europe", "asia", "africa", "america", "oceania", "boss"]
// =============================================================================

router.get('/continents', async (req, res) => {
    try {
        const continentPath = path.join(__dirname, '../data/capitals/');
        const files = await fs.readdir(continentPath);
        const continents = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
        res.json(continents);
    } catch (error) {
        console.error('Error loading continents:', error);
        res.status(500).json({ error: 'Could not load continents' });
    }
});

// =============================================================================
// GET /capitals/:continent/:difficulty
// Επιστρέφει φιλτραρισμένες ερωτήσεις για συγκεκριμένη ήπειρο και difficulty
// Examples:
// - GET /capitals/america/medium → μόνο medium ερωτήσεις από America
// - GET /capitals/america/random → όλες οι ερωτήσεις από America ανακατεμένες
// =============================================================================

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
        const continentPath = path.join(__dirname, '../data/capitals', continent + '.json');
        const data = await fs.readFile(continentPath, 'utf8');
        const questions = JSON.parse(data);
        
        console.log(`Total questions loaded: ${questions.length}`);
        
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
// Body: {
//   continent: "america",
//   questionIndex: 0,
//   userAnswer: "Washington D.C."
// }
// Response: {
//   isCorrect: true,
//   correctAnswer: "Washington D.C.",
//   explanation: null
// }
// =============================================================================

router.post('/check', async (req, res) => {
    try {
        const { continent, questionIndex, userAnswer } = req.body;
        
        console.log('=== CHECKING ANSWER ===');
        console.log('Continent:', continent);
        console.log('Question Index:', questionIndex);
        console.log('User Answer:', userAnswer);
        
        // Validation
        if (!continent || questionIndex === undefined || !userAnswer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Load questions from JSON file
        const continentPath = path.join(__dirname, '../data/capitals', continent + '.json');
        const data = await fs.readFile(continentPath, 'utf8');
        const questions = JSON.parse(data);
        
        console.log(`Total questions in file: ${questions.length}`);
        
        // Get specific question by index
        const question = questions[questionIndex];
        if (!question) {
            return res.status(400).json({ error: 'Question not found' });
        }
        
        console.log('Question from backend:', {
            question: question.question,
            correctAnswer: question.answer,
            difficulty: question.difficulty
        });
        
        // Check if answer is correct
        const isCorrect = question.answer === userAnswer;
        
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
// GET /capitals/:continent
// Επιστρέφει όλες τις ερωτήσεις για μία ήπειρο (χωρίς difficulty filtering)
// =============================================================================

router.get('/:continent', async (req, res) => {
    try {
        const continent = req.params.continent;
        
        // Validation
        if (!/^[a-zA-Z]+$/.test(continent)) {
            return res.status(400).json({ error: 'Invalid continent name' });
        }
        
        // Load questions
        const continentPath = path.join(__dirname, '../data/capitals', continent + '.json');
        const data = await fs.readFile(continentPath, 'utf8');
        const questions = JSON.parse(data);

        let filteredQuestions = questions;

        // Optional filtering with query parameter ?difficulty=easy
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