// Packages API Routes
// Handles all HTTP requests related to tour packages

const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// GET /api/packages - Fetch all tour packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages', message: error.message });
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
