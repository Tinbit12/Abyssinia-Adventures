// Users API Routes (admin only)
// Admins can list, get, update, and delete users (no password in responses)

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/** Helper: user object for API (no password) */
const toUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || 'user',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// GET /api/users - List all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users.map((u) => toUserResponse(u)));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get one user (admin only)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(toUserResponse(user));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
});

// PUT /api/users/:id - Update user (admin only; name, email, role)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { name, email, role } = req.body || {};
    if (name !== undefined) user.name = String(name).trim();
    if (email !== undefined) user.email = String(email).trim().toLowerCase();
    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'role must be "user" or "admin"' });
      }
      user.role = role;
    }
    await user.save();
    res.json(toUserResponse(user));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: err.message || 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete user' });
  }
});

module.exports = router;
