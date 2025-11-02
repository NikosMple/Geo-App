import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Dashboard from "@/Pages/Dashboard";
import LoginScreen from "@/Pages/LoginScreen";
import Profile from "@/Pages/ProfileUser";
import ChooseContinent from "@/Pages/ChooseContinent";
import DifficultyLevels from "@/Pages/DifficultyLevels";
import CapitalsQuiz from "@/Pages/CapitalsQuiz";
import FlagsQuiz from "@/Pages/FlagsQuiz";
import Score from "@/Pages/Score";
import GlobalMap from "@/Pages/GlobalMap";

export default function AppRoutes() {
  const location = useLocation();

  const pageTransition = useMemo(
    () => ({
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.25 },
    }),
    []
  );

  const locationKey = useMemo(() => location.pathname, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={locationKey}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <motion.div {...pageTransition}>
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition}>
              <LoginScreen />
            </motion.div>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <Profile />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/score"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <Score />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <GlobalMap />
              </motion.div>
            </ProtectedRoute>
          }
        />

        {/* Capitals */}
        <Route
          path="/capitals/choose-continent"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <ChooseContinent gameMode="capitals" />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/capitals/difficulty/:continent"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <DifficultyLevels gameMode="capitals" />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/capitals/:continent/:difficulty"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <CapitalsQuiz />
              </motion.div>
            </ProtectedRoute>
          }
        />

        {/* Flags */}
        <Route
          path="/flags/choose-continent"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <ChooseContinent gameMode="flags" />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/flags/difficulty/:continent"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <DifficultyLevels gameMode="flags" />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/flags/:continent/:difficulty"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <FlagsQuiz />
              </motion.div>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <motion.div {...pageTransition}>
              <Dashboard />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
