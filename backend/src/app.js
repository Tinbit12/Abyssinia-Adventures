// Main Backend Application File
// Sets up Express server, middleware, routes, and database connection

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

// Import routes
const destinationsRoutes = require('./routes/destinations');
const packagesRoutes = require('./routes/packages');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// CORS allows the React frontend to communicate with this backend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
// All API endpoints are prefixed with /api
app.use('/api/destinations', destinationsRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Abyssinia Adventures API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Abyssinia Adventures API',
    endpoints: {
      destinations: '/api/destinations',
      packages: '/api/packages',
      contact: '/api/contact'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
