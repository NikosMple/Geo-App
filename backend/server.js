import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import QuizRoutes from "./routes/quiz.js";
import StatsRoutes from "./routes/stats.js";

const app = express();
const port = 3001;

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(express.json());

app.use("/api", QuizRoutes);
app.use("/api/stats", StatsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
