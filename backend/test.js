// test.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Test: Διάβασμα JSON
function loadQuestions() {
  try {
    const filePath = path.join(__dirname, 'data/capitals/europe.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(data);
    
    console.log('✅ JSON loaded successfully!');
    console.log(`📊 Total questions: ${questions.length}`);
    return questions;
  } catch (error) {
    console.error('❌ Error loading JSON:', error);
    return [];
  }
}

// 2. Test: Φιλτράρισμα ανά difficulty
function filterByDifficulty(questions, difficulty) {
  const filtered = questions.filter(q => q.difficulty === difficulty);
  console.log(`🔍 ${difficulty.toUpperCase()}: ${filtered.length} questions`);
  return filtered;
}

// Run tests
console.log('=== TESTING JSON HANDLER ===\n');

const questions = loadQuestions();

if (questions.length > 0) {
  console.log('\n=== DIFFICULTY FILTERING ===');
  const easy = filterByDifficulty(questions, 'easy');
  const medium = filterByDifficulty(questions, 'medium');
  const hard = filterByDifficulty(questions, 'hard');
  
  console.log('\n=== SAMPLE QUESTIONS ===');
  console.log('Easy:', easy[0]?.question);
  console.log('Medium:', medium[0]?.question);
  console.log('Hard:', hard[0]?.question);
}