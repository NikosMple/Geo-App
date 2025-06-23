import express from 'express';
import cors from 'cors';
import connectDB from './db/index.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('hello')
})

connectDB().then( () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
})