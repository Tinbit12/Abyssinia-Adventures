require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { runSeedIfNeeded } = require('./scripts/runSeedIfNeeded');
const destinationsRouter = require('./routes/destinations');
const packagesRouter = require('./routes/packages');
const contactRouter = require('./routes/contact');
const authRouter = require('./routes/auth');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ✅ Root route (added for clean demo)
app.get('/', (req, res) => {
  res.send('Abyssinian Adventure API is running');
});

// API routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const start = async () => {
  try {
    await connectDB();
    await runSeedIfNeeded();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();