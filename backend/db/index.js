import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

async function connectDB() {
    try {
        await mongoose.connect(uri, opts);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error');
        process.exit(1);
    }
}

export default connectDB;

