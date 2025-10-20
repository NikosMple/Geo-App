import express from 'express';
import cors from 'cors';
import QuizRoutes from './routes/quiz.js'
import StatsRoutes from './routes/stats.js'
import helmet from 'helmet';


const app = express();
const port = 3001;
app.use(helmet());

// Fixed CORS configuration - allow both ports
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api', QuizRoutes);
app.use('/api/stats', StatsRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
