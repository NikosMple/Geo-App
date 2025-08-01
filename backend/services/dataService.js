import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- CAPITALS ------//

const dataCache = {}; // In-memory cache for loaded questions
const dataFlagCache = {};

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
    // console.log('Total countries:', countries.length);
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
