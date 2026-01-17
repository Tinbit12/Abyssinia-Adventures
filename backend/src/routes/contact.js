// Contact API Routes
// Handles contact form submissions

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact - Submit a contact form message
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create and save the contact message
    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      contact 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form', message: error.message });
  }
});

module.exports = router;
