import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataCache = {}; // In-memory cache for loaded questions

/**
 * Loads questions for a given continent from its JSON file.
 * Caches the data in memory after the first load.
 * @param {string} continent - The name of the continent (e.g., 'africa', 'america').
 * @returns {Promise<Array>} A promise that resolves to an array of questions.
 */
export async function loadQuestions(continent) {
    if (dataCache[continent]) {
        return dataCache[continent];
    }

    try {
        const filePath = path.join(__dirname, '../data/capitals', `${continent}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        const questions = JSON.parse(data);
        dataCache[continent] = questions; // Cache the data
        return questions;
    } catch (error) {
        console.error(`Error loading questions for ${continent}:`, error);
        throw new Error(`Failed to load questions for ${continent}.`);
    }
}

/**
 * Gets a list of available continents by reading the data directory.
 * @returns {Promise<Array>} A promise that resolves to an array of continent names.
 */
export async function getAvailableContinents() {
    try {
        const continentPath = path.join(__dirname, '../data/capitals/');
        const files = await fs.readdir(continentPath);
        const continents = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
        return continents;
    } catch (error) {
        console.error('Error reading available continents:', error);
        throw new Error('Failed to retrieve available continents.');
    }
}
