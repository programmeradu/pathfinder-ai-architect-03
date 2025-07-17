import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL not set. Using default MongoDB connection: mongodb://localhost:27017/pathfinder"
  );
}

const connectionString = process.env.DATABASE_URL || 'mongodb://localhost:27017/pathfinder';

// Connect to MongoDB
mongoose.connect(connectionString)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

export const db = mongoose.connection;