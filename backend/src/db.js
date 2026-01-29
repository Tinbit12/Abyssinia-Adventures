// Database Connection File
// Handles secure MongoDB connection using Mongoose

const mongoose = require('mongoose');
require('dotenv').config();

// Read the MongoDB connection string from .env file
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    // Connect to MongoDB using Mongoose
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // Do not terminate the process in development.
    // Instead, log a clear warning and allow the server
    // to continue running in fallback (sample data) mode.
    console.warn(
      '❌ MongoDB connection failed. Running in fallback (sample data) mode.',
      error.message
    );
  }
};

// Export the connection function
module.exports = connectDB;
