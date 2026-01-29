// Contact API Routes
// Handles contact form submissions

const express = require('express');
const router = express.Router();
// New model for contact form submissions (keeps future schema evolution safe)
const ContactMessage = require('../models/ContactMessage');

// POST /api/contact - Submit a contact form message
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { name, email, message, ...rest } = req.body || {};
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Detect & store any additional fields automatically (e.g. subject, phone)
    // while keeping the core schema stable.
    const extraFields = rest && typeof rest === 'object' ? rest : {};

    // Capture some minimal request metadata (optional)
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create and save the contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      message,
      extraFields,
      ip,
      userAgent,
    });
    await contactMessage.save();

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      contact: contactMessage
    });
  } catch (error) {
    // In development, do not crash the server if the DB is down.
    // Return a meaningful error so the frontend can react appropriately.
    res.status(500).json({
      error: 'Failed to submit contact form',
      message: error.message,
    });
  }
});

module.exports = router;
