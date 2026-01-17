// Destinations API Routes
// Handles all HTTP requests related to destinations

const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// GET /api/destinations - Fetch all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations', message: error.message });
  }
});

// GET /api/destinations/:id - Fetch a single destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination', message: error.message });
  }
});

module.exports = router;
