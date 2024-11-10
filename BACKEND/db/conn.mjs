// conn.mjs
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const uri = process.env.MONGO_URI;

async function connectToDatabase() {
  try {
    if (!uri) {
      console.error("MongoDB URI is not defined in the .env file");
      return;
    }
    // Connect without deprecated options
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

export { connectToDatabase };