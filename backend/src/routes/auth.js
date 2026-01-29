// Auth API Routes
// Provides signup and login endpoints backed by MongoDB (Mongoose).
//
// Endpoints:
// - POST /api/auth/signup
// - POST /api/auth/login
//
// Notes:
// - Uses Node's built-in crypto (pbkdf2) for password hashing (no extra deps).
// - Returns safe user data (never returns password fields).
// - Does not crash the server if MongoDB is unavailable; returns meaningful errors.

const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const User = require('../models/User');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// At least 8 chars, with letters, numbers and symbols
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}_+\\-=:;'",.<>/?`~|]).{8,}$/;

function hashPassword(password, salt) {
  // pbkdf2 returns a Buffer; store as hex string.
  // Iterations/keylen/digest chosen for dev safety without external dependencies.
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha512';
  return crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
}

function sanitizeUser(userDoc) {
  // Ensure we never return password/salt.
  return {
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!PASSWORD_REGEX.test(String(password))) {
      return res.status(400).json({
        error:
          'Password must be at least 8 characters and include letters, numbers, and symbols',
      });
    }

    // Prevent duplicate users
    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(String(password), salt);

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      password: passwordHash,
      passwordSalt: salt,
    });

    return res.status(201).json({
      message: 'Signup successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    // Common Mongo error: duplicate key (race condition)
    if (error && error.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    return res.status(500).json({
      error: 'Signup failed',
      message: error.message,
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Need password + salt for verification, hence select('+password +passwordSalt')
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
      '+password +passwordSalt'
    );
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const computed = hashPassword(String(password), user.passwordSalt);
    if (computed !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      message: 'Login successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Login failed',
      message: error.message,
    });
  }
});

module.exports = router;

