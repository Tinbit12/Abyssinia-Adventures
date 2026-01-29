// Packages API Routes
// Handles all HTTP requests related to tour packages

const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// In-memory fallback sample tour packages.
// Used when the database is reachable but contains no package documents.
const SAMPLE_PACKAGES = [
  {
    _id: '100000000000000000000001',
    title: 'Historic North Circuit – Aksum, Gondar & Lalibela',
    duration: '7 days',
    price: 899,
    description:
      'Experience the best of Northern Ethiopia with visits to Aksum’s stelae, Gondar’s castles, and the rock-hewn churches of Lalibela. Includes guided tours, transportation, and selected meals.',
    image:
      'https://images.pexels.com/photos/210307/pexels-photo-210307.jpeg',
  },
  {
    _id: '100000000000000000000002',
    title: 'Simien Mountains Trekking Adventure',
    duration: '5 days',
    price: 749,
    description:
      'Trek through the breathtaking Simien Mountains National Park, home to Gelada baboons, Walia ibex, and stunning highland scenery. Ideal for adventure and nature lovers.',
    image:
      'https://images.pexels.com/photos/53389/mountains-alps-summit-wandern-53389.jpeg',
  },
  {
    _id: '100000000000000000000003',
    title: 'Cultural Escape – Addis Ababa & Surroundings',
    duration: '3 days',
    price: 399,
    description:
      'Discover Addis Ababa’s vibrant culture, museums, and markets, with optional day trips to nearby historical and natural attractions.',
    image:
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
  },
];

// GET /api/packages - Fetch all tour packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    // If the database query succeeds but returns an empty array,
    // fall back to a hardcoded list of sample packages so
    // the frontend always has data to display.
    if (!packages || packages.length === 0) {
      return res.json(SAMPLE_PACKAGES);
    }

    res.json(packages);
  } catch (error) {
    // If the database is unavailable or the query fails for any reason,
    // log the error and respond with sample packages so the frontend
    // still receives a valid array in development/fallback mode.
    console.error('Failed to fetch packages. Serving fallback sample data instead.', error);
    return res.json(SAMPLE_PACKAGES);
  }
});

// GET /api/packages/:id - Fetch a single package by ID
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch package', message: error.message });
  }
});

module.exports = router;
