// Destinations API Routes
// Handles all HTTP requests related to destinations (public GET; admin CRUD for create/update/delete)

const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

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

// --- Admin-only CRUD (require admin role) ---

// POST /api/destinations - Create destination (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, image, location } = req.body || {};
    if (!name || !description || !image || !location) {
      return res.status(400).json({
        error: 'name, description, image, and location are required',
      });
    }
    const destination = await Destination.create({
      name: String(name).trim(),
      description: String(description).trim(),
      image: String(image).trim(),
      location: String(location).trim(),
    });
    res.status(201).json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create destination' });
  }
});

// PUT /api/destinations/:id - Update destination (admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    const { name, description, image, location, maxCapacity } = req.body || {};
    if (name !== undefined) destination.name = String(name).trim();
    if (description !== undefined) destination.description = String(description).trim();
    if (image !== undefined) destination.image = String(image).trim();
    if (location !== undefined) destination.location = String(location).trim();
    if (maxCapacity !== undefined) {
      if (maxCapacity === null) destination.maxCapacity = null;
      else {
        const cap = Number(maxCapacity);
        if (Number.isInteger(cap) && cap >= 1) destination.maxCapacity = cap;
      }
    }
    await destination.save();
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update destination' });
  }
});

// DELETE /api/destinations/:id - Delete destination (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json({ message: 'Destination deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete destination' });
  }
});

module.exports = router;
