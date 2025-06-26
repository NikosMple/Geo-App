import express from 'express';
import cors from 'cors';
import Capitals from './routes/capitals.js'

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:3001'
}));


app.use(express.json());
app.use(cors());


app.use('/capitals', Capitals);

app.get('/', (req, res) => {
    res.send('hello')
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})