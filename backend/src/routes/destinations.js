// Destinations API Routes
// Handles all HTTP requests related to destinations

const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// In-memory fallback sample destinations.
// Used when the database is reachable but contains no destination documents.
const SAMPLE_DESTINATIONS = [
  {
    _id: '000000000000000000000001',
    name: 'Aksum',
    description:
      'Explore the ancient city of Aksum, home to towering stelae, archaeological treasures, and legends of the Ark of the Covenant.',
    image:
      'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg',
    location: 'Tigray, Northern Ethiopia',
  },
  {
    _id: '000000000000000000000002',
    name: 'Simien Mountains',
    description:
      'Discover dramatic escarpments, deep valleys, and unique wildlife such as the Gelada baboon in Simien Mountains National Park.',
    image:
      'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg',
    location: 'Amhara, Northern Ethiopia',
  },
  {
    _id: '000000000000000000000003',
    name: 'Gondar',
    description:
      'Visit the royal enclosure of Gondar, with its medieval castles, churches, and rich imperial history.',
    image:
      'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg',
    location: 'Amhara, Northern Ethiopia',
  },
];

// GET /api/destinations - Fetch all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    // If the database query succeeds but returns an empty array,
    // fall back to a hardcoded list of sample destinations so
    // the frontend always has data to display.
    if (!destinations || destinations.length === 0) {
      return res.json(SAMPLE_DESTINATIONS);
    }

    res.json(destinations);
  } catch (error) {
    // If the database is unavailable or the query fails for any reason,
    // log the error and respond with sample destinations so the frontend
    // still receives a valid array in development/fallback mode.
    console.error('Failed to fetch destinations. Serving fallback sample data instead.', error);
    return res.json(SAMPLE_DESTINATIONS);
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
