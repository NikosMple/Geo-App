import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LaunchButton from "@/components/ui/LaunchButton";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/api";

const Score = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    score = 0,
    totalQuestions = 10,
    continent = "world",
    difficulty = "normal",
    gameMode = "capitals",
  } = location.state || {};

  const [mounted, setMounted] = useState(false);
  const [statsSaved, setStatsSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const postStats = async () => {
      if (!user?.uid) return;

      if (statsSaved) return;
      try {
        const gameType = `${gameMode}_${continent}`;
        await api.saveStats({
          userId: user.uid,
          gameType,
          score: Number(score) || 0,
          totalQuestions: Number(totalQuestions) || 0,
          correctAnswers: Number(score) || 0,
          durationSec: undefined,
          metadata: { difficulty, continent, gameMode },
        });
        setStatsSaved(true);
      } catch (err) {}
    };
    postStats();
  }, [
    user?.uid,
    statsSaved,
    gameMode,
    continent,
    score,
    totalQuestions,
    difficulty,
  ]);

  console.log("Testing security: User can only access own data");
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getScoreMessage = () => {
    if (percentage === 100)
      return {
        text: "Perfect Score! You're a geography master!",
        color: "text-emerald-400",
      };
    if (percentage >= 80)
      return {
        text: "Excellent! You really know your stuff.",
        color: "text-blue-400",
      };
    if (percentage >= 60)
      return {
        text: "Great job! A very respectable score.",
        color: "text-yellow-400",
      };
    if (percentage >= 40)
      return {
        text: "Good effort! Keep practicing.",
        color: "text-orange-400",
      };
    return {
      text: "Keep learning! Every master starts somewhere.",
      color: "text-red-400",
    };
  };

  const getCircleColorClass = () => {
    if (percentage === 100) return "text-emerald-400";
    if (percentage >= 80) return "text-blue-400";
    if (percentage >= 60) return "text-yellow-400";
    if (percentage >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const scoreMessage = getScoreMessage();
  const circleColorClass = getCircleColorClass();
  const strokeDashoffset = 283 * (1 - percentage / 100);

  return (
    <div className={`app-background min-h-screen ${mounted ? "mounted" : ""}`}>
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-8 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <div
          className={`w-full bg-white/5 backdrop-blur-3xl border-2 border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-black/30 transition-all duration-700 ease-out
          ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text mb-3">
              Quiz Complete!
            </h1>
            <p
              className={`text-lg sm:text-xl font-semibold ${scoreMessage.color}`}
            >
              {scoreMessage.text}
            </p>
          </div>

          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-8 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-white/10"
                stroke="currentColor"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
              <circle
                className={`${circleColorClass} transition-all duration-1000 ease-out`}
                stroke="currentColor"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={mounted ? strokeDashoffset : 283}
                transform="rotate(-90 50 50)"
              />
            </svg>

            <div className="flex flex-col">
              <span className="text-5xl sm:text-6xl font-black text-white">
                {score}
                <span className="text-3xl sm:text-4xl text-white/50">
                  /{totalQuestions}
                </span>
              </span>
              <span className="text-lg sm:text-xl font-medium text-white/70 mt-1">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-blue-400/30">
              <p className="text-sm text-white/60 uppercase tracking-wider">
                Continent
              </p>
              <p className="text-lg font-bold text-white capitalize">
                {continent}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-yellow-400/30">
              <p className="text-sm text-white/60 uppercase tracking-wider">
                Difficulty
              </p>
              <p className="text-lg font-bold text-white capitalize">
                {difficulty}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-emerald-400/30">
              <p className="text-sm text-white/60 uppercase tracking-wider">
                Correct
              </p>
              <p className="text-lg font-bold text-emerald-400">{score}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LaunchButton
              text="Try Again"
              variant="info"
              onClick={() =>
                navigate(`/quiz/${gameMode}/${continent}/${difficulty}`)
              }
            />
            {continent !== "boss" && (
              <LaunchButton
                text="Change Difficulty"
                variant="dark"
                onClick={() => navigate(`/${gameMode}/difficulty/${continent}`)}
              />
            )}
            <LaunchButton
              text="New Game"
              variant="purple"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
