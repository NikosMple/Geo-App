# Geo-Quiz Application Documentation

This document provides a complete overview of the Geo-Quiz application, detailing the architecture, data flow, and component responsibilities. 

## Table of Contents

1.  **High-Level Overview**
2.  **Backend Architecture**
    -   Data Storage
    -   API Endpoints & Routing
    -   Services
3.  **Frontend Architecture**
    -   Component-Based Structure
    -   Routing
    -   State Management
4.  **Application Flow (User Journey)**
    -   Starting a Quiz (Capitals or Flags)
    -   Playing the Quiz
    -   Finishing and Scoring

---

## 1. High-Level Overview

The application is a full-stack quiz game with a **React frontend** and a **Node.js (Express) backend**.

-   **Backend**: Serves quiz questions from JSON files and validates user answers.
-   **Frontend**: Provides the user interface for selecting and playing the quizzes, and displays the final score.

The two parts communicate via a RESTful API.

---

## 2. Backend Architecture

The backend is responsible for the game's logic and data management.

### Data Storage

-   Quiz questions are stored in static **JSON files** located in the `backend/data/` directory.
-   The data is organized by game mode (`capitals`, `flags`) and then by continent (`africa.json`, `asia.json`, etc.).

    -   **Capitals Data (`/data/capitals/*.json`):** Each object contains a `question` (e.g., "What is the capital of..."), an `answer`, and an array of `options`.
    -   **Flags Data (`/data/flags/*.json`):** Each object contains a `country_code` (e.g., "US", "FR"), which is used by the frontend to fetch the flag image, an `answer` (the country name), and an array of `options`.

### API Endpoints & Routing

Routing is handled by Express. The main router file is `backend/routes/quiz.js`, which defines all the API endpoints under the `/api/` prefix.

**Key Endpoints:**

-   `GET /api/continents`
    -   **Purpose**: Fetches a list of all available continents by reading the filenames in the data directory.
    -   **Used by**: `ChooseContinent.jsx` page.

-   `GET /api/capitals/:continent/:difficulty`
    -   **Purpose**: Gets 10 questions for the Capitals quiz based on the selected continent and difficulty.
    -   **Used by**: `CapitalsQuiz.jsx`.

-   `GET /api/flags/:continent/:difficulty`
    -   **Purpose**: Gets 10 questions for the Flags quiz based on the selected continent and difficulty.
    -   **Used by**: `FlagsQuiz.jsx`.

-   `POST /api/capitals/check`
    -   **Purpose**: Validates a user's answer for a capitals question.
    -   **Used by**: `CapitalsQuiz.jsx`.

-   `POST /api/flags/check`
    -   **Purpose**: Validates a user's answer for a flags question.
    -   **Used by**: `FlagsQuiz.jsx`.

### Services

-   **`dataService.js`**: This is a crucial service that acts as a data access layer. It contains functions to read the JSON files from the disk.
    -   `loadQuestions(continent)`: Reads and returns capital questions for a given continent.
    -   `loadFlagQuestion(continent)`: Reads and returns flag questions for a given continent.
    -   It uses an in-memory cache (`dataCache`, `dataFlagCache`) to avoid re-reading files from the disk on every request, which improves performance.

---

## 3. Frontend Architecture

The frontend is a single-page application (SPA) built with **React** and **React Router**.

### Component-Based Structure

The UI is broken down into reusable components and pages, located in `frontend/src/`.

-   **Pages (`/Pages`):** These are the main screens of the application.
    -   `Dashboard.jsx`: The main landing page where users select a game mode (Capitals or Flags).
    -   `ChooseContinent.jsx`: A dynamic page that allows users to select a continent for the chosen game mode.
    -   `DifficultyLevels.jsx`: A dynamic page for selecting the quiz difficulty.
    -   `CapitalsQuiz.jsx` & `FlagsQuiz.jsx`: The actual quiz screens. They handle the timer, question display, answer selection, and communication with the backend.
    -   `Score.jsx`: Displays the final score and provides options to play again.

-   **Components (`/components`):** Reusable UI elements.
    -   `Timer.jsx`: The visual hourglass timer used in the quiz screens.
    -   `LaunchButton.jsx`: A styled, reusable button.

### Routing

-   **`App.jsx`** is the heart of the frontend routing. It uses `react-router-dom` to define the URL paths for each page.
-   It passes a `gameMode` prop (`capitals` or `flags`) to the `ChooseContinent` and `DifficultyLevels` pages. This is the key to making them reusable.

### State Management

-   State is managed locally within each component using React hooks (`useState`, `useEffect`).
-   Data is passed between routes using the `navigate` function's `state` object (from `react-router-dom`). For example, the quiz pages pass the final score, continent, and `gameMode` to the `Score.jsx` page.

---

## 4. Application Flow (User Journey)

Here is the step-by-step flow of how a user interacts with the application.

### Starting a Quiz (Capitals or Flags)

1.  **User lands on `Dashboard.jsx`**. They see two options: "Capitals Quiz" and "Flags Quiz".
2.  User clicks on a game mode. The `onClick` handler calls `navigate` with the specific path (e.g., `/capitals/choose-continent` or `/flags/choose-continent`).
3.  The router in **`App.jsx`** renders the **`ChooseContinent.jsx`** component, passing it the correct `gameMode` prop.
4.  The user clicks on a continent. The `handleContinentClick` function in `ChooseContinent.jsx` uses the `gameMode` prop to navigate to the correct difficulty page (e.g., `/flags/difficulty/asia`).
5.  The router in **`App.jsx`** renders the **`DifficultyLevels.jsx`** component, again passing the `gameMode`.
6.  The user clicks a difficulty. The `handleDifficultyClick` function navigates to the final quiz URL (e.g., `/quiz/flags/asia/hard`).

### Playing the Quiz

1.  The router in **`App.jsx`** renders the correct quiz component (`CapitalsQuiz.jsx` or `FlagsQuiz.jsx`).
2.  The quiz component's `useEffect` hook fires. It calls the appropriate API function from **`api.js`** (e.g., `api.getFlagsQuizQuestions(...)`).
3.  The frontend API service sends a `GET` request to the backend (e.g., `GET /api/flags/asia/hard`).
4.  The backend's **`quiz.js`** route handler receives the request. It uses **`dataService.js`** to load the correct JSON file, filters the questions, and sends back a list of 10 questions.
5.  The quiz component receives the questions and stores them in its state. The timer starts.
6.  The user clicks an answer. The `handleAnswerSelect` function sends a `POST` request to the backend's check endpoint (e.g., `/api/flags/check`) with the answer and question details.
7.  The backend validates the answer and returns `{ isCorrect: true/false, correctAnswer: '...' }`.
8.  The frontend updates the UI to show the result and increments the score if correct.

### Finishing and Scoring

1.  After the last question, the `nextQuestion` function in the quiz component calls `navigate('/score', ...)`.
2.  Crucially, it passes the `score`, `totalQuestions`, `continent`, `difficulty`, and `gameMode` in the navigation state.
3.  The **`Score.jsx`** page renders. It retrieves the state using the `useLocation` hook.
4.  It uses the `gameMode` from the state to build the correct URLs for the "Try Again" and "Change Difficulty" buttons, ensuring the user is sent back to the correct quiz flow.
