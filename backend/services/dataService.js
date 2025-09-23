import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- CACHES ------//
const dataCache = {}; // In-memory cache for loaded questions
const dataFlagCache = {};
let funFactsCache = null; // Cache for fun facts

// ----- CAPITALS ------//

export async function loadQuestions(continent) {
  if (dataCache[continent]) {
    return dataCache[continent];
  }

  try {
    const filePath = path.join(
      __dirname,
      "../data/capitals",
      `${continent}.json`
    );
    const data = await fs.readFile(filePath, "utf8");
    const questions = JSON.parse(data);
    dataCache[continent] = questions;
    return questions;
  } catch (error) {
    console.error(`Error loading questions for ${continent}:`, error);
    throw new Error(`Failed to load questions for ${continent}.`);
  }
}

export async function getAvailableContinents() {
  try {
    const continentPath = path.join(__dirname, "../data/capitals/");
    const files = await fs.readdir(continentPath);
    const continents = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""));
    return continents;
  } catch (error) {
    console.error("Error reading available continents:", error);
    throw new Error("Failed to retrieve available continents.");
  }
}

export async function getAvailableCountries() {
  try {
    const countriesPath = path.join(__dirname, "../all.json");
    const fileContent = await fs.readFile(countriesPath, "utf-8");
    const countries = JSON.parse(fileContent);
    return countries;
  } catch (error) {
    console.error("Error reading available countries:", error);
    throw new Error("Failed to retrieve available countries.");
  }
}

// ----- FLAGS ------//

export async function loadFlagQuestion(continent) {
  if (dataFlagCache[continent]) {
    return dataFlagCache[continent];
  }

  try {
    const filePath = path.join(__dirname, "../data/flags", `${continent}.json`);
    const data = await fs.readFile(filePath, "utf8");
    const questions = JSON.parse(data);
    dataFlagCache[continent] = questions;
    return questions;
  } catch (error) {
    console.error(`Error loading questions for ${continent}:`, error);
    throw new Error(`Failed to load questions for ${continent}.`);
  }
}

// ----- FUN FACTS ------//

// export async function loadFunFacts() {
//   if (funFactsCache) {
//     console.log("✅ Returning cached fun facts");
//     return funFactsCache;
//   }

//   try {
//     const funFactsPath = path.join(__dirname, "../data/funFacts.json");
//     console.log("📁 Loading fun facts from:", funFactsPath);
    
//     const funFactsData = await fs.readFile(funFactsPath, "utf8");
//     const funFacts = JSON.parse(funFactsData);
    
//     console.log("✅ Successfully loaded fun facts:", Object.keys(funFacts).length, "countries");
    
//     funFactsCache = funFacts;
//     return funFacts;
//   } catch (error) {
//     console.error("❌ Error loading fun facts:", error);
//     console.error("File path attempted:", path.join(__dirname, "../data/funFacts.json"));
//     return {}; // Return empty object as fallback
//   }
// }

// Extract country name from question text
// function extractCountryFromQuestion(questionText) {
//   console.log('🔍 Extracting from:', questionText);
  
//   const patterns = [
//     /capital of (.+?)\?/i,
//     /capital of (.+?)$/i,
//     /capital.*?of (.+?)\?/i,
//     /What is the capital of (.+?)[\?\.]?/i
//   ];
  
//   for (let i = 0; i < patterns.length; i++) {
//     const pattern = patterns[i];
//     const match = questionText.match(pattern);
//     if (match) {
//       const country = match[1].trim();
//       console.log(`✅ Pattern ${i + 1} matched: "${country}"`);
//       return country;
//     } else {
//       console.log(`❌ Pattern ${i + 1} failed:`, pattern);
//     }
//   }
  
//   console.log('❌ No pattern matched');
//   return null;
// }

// export async function getFunFact(capital, continent) {
//   try {
//     console.log('=== DEBUG FUN FACT ===');
//     console.log(`Input - Capital: "${capital}", Continent: "${continent}"`);
    
//     const funFacts = await loadFunFacts();
//     console.log('Fun facts loaded successfully:', Object.keys(funFacts).length, 'countries');
//     console.log('First 5 countries in funFacts:', Object.keys(funFacts).slice(0, 5));
    
//     // Load the questions for this continent to find the country
//     const questions = await loadQuestions(continent);
//     console.log(`Loaded ${questions.length} questions for ${continent}`);
    
//     // Find the question that has this capital as answer
//     const question = questions.find(q => q.answer === capital);
    
//     if (!question) {
//       console.log(`❌ No question found for capital: "${capital}"`);
//       console.log('Available answers in questions:', questions.map(q => q.answer));
//       return "Geography is fascinating!";
//     }
    
//     console.log(`✅ Found question: "${question.question}"`);
    
//     // Extract country name from question
//     const country = extractCountryFromQuestion(question.question);
    
//     if (!country) {
//       console.log(`❌ Could not extract country from: "${question.question}"`);
//       return "Geography is fascinating!";
//     }
    
//     console.log(`✅ Extracted country: "${country}"`);
    
//     // Check if country exists in funFacts
//     const funFact = funFacts[country];
    
//     if (!funFact) {
//       console.log(`❌ No fun fact found for: "${country}"`);
//       console.log('Exact match check:', funFacts.hasOwnProperty(country));
//       console.log('Similar countries in funFacts:', 
//         Object.keys(funFacts).filter(c => 
//           c.toLowerCase().includes(country.toLowerCase()) || 
//           country.toLowerCase().includes(c.toLowerCase())
//         )
//       );
//       return `${country} has a rich cultural heritage!`;
//     }
    
//     console.log(`✅ Found fun fact: "${funFact}"`);
//     console.log('=== END DEBUG ===');
//     return funFact;
    
//   } catch (error) {
//     console.error("❌ Error in getFunFact:", error);
//     return "Geography is fascinating!";
//   }
// }