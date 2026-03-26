// Database connection (MongoDB via Mongoose)
// Used by app.js and seed script. Supports MONGO_URI or MONGODB_URI in .env

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
  if (!uri) {
    throw new Error('Missing MONGO_URI or MONGODB_URI in .env');
  }
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
