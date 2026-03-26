// Authentication and authorization middleware
// Protects routes: authMiddleware = logged-in user, adminMiddleware = admin only

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'abyssinia-dev-secret-change-in-production';

/**
 * Verifies JWT and sets req.userId. Use for any route that requires a logged-in user.
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Must be used after authMiddleware. Loads user and checks role === 'admin'.
 * Use for admin-only routes (CRUD for destinations, packages, users, bookings).
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('role');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.userRole = user.role;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message || 'Authorization failed' });
  }
};

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };
