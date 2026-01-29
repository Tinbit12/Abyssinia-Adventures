// Database connection configuration
// This file handles the connection to MongoDB using Mongoose

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env
    await mongoose.connect(process.env.MONGODB_URI, {
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

module.exports = connectDB;
