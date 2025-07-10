import express from 'express';
import cors from 'cors';
import Capitals from './routes/capitals.js'

const app = express();
const port = 3001;

// Fixed CORS configuration - allow both ports
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api', Capitals);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})