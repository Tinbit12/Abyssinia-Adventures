// Booking routes: create, list my bookings, admin list/update/delete
// Booking routes require auth; admin routes require admin role
// Validates: past date, duplicate booking (same user+item+day), capacity

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { startOfDayUTC, endOfDayUTC, isPastDate } = require('../utils/dateUtils');

/**
 * GET /api/bookings/my - List bookings for the logged-in user (auth required)
 */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch bookings' });
  }
});

/**
 * POST /api/bookings - Create a booking (auth required)
 * Body: itemType ('destination'|'package'), itemId, date, numberOfPeople, note (optional)
 * Validates: required fields, date not in past, no duplicate (same user+item+day), capacity
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { itemType, itemId, date, numberOfPeople, note } = req.body || {};
    if (!itemType || !itemId || date === undefined || date === null || numberOfPeople == null) {
      return res.status(400).json({
        error: 'itemType, itemId, date, and numberOfPeople are required',
      });
    }
    if (!['destination', 'package'].includes(itemType)) {
      return res.status(400).json({ error: 'itemType must be "destination" or "package"' });
    }
    const num = Number(numberOfPeople);
    if (!Number.isInteger(num) || num < 1) {
      return res.status(400).json({ error: 'numberOfPeople must be a positive integer' });
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'Invalid itemId' });
    }
    const dateObj = new Date(date);
    if (Number.isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    const dateNormalized = startOfDayUTC(dateObj);
    if (isPastDate(dateObj)) {
      return res.status(400).json({ error: 'Booking date cannot be in the past' });
    }
    let item = null;
    if (itemType === 'destination') {
      item = await Destination.findById(itemId);
      if (!item) return res.status(404).json({ error: 'Destination not found' });
    } else {
      item = await Package.findById(itemId);
      if (!item) return res.status(404).json({ error: 'Package not found' });
    }
    const dayEnd = endOfDayUTC(dateObj);
    const existingSameUser = await Booking.findOne({
      user: req.userId,
      itemType,
      itemId,
      status: { $in: ['pending', 'approved'] },
      date: { $gte: dateNormalized, $lt: dayEnd },
    });
    if (existingSameUser) {
      return res.status(409).json({
        error: 'You already have an active booking for this item on this date',
      });
    }
    const maxCapacity = item.maxCapacity != null ? Number(item.maxCapacity) : null;
    if (maxCapacity != null && maxCapacity >= 1) {
      const activeOnDay = await Booking.aggregate([
        {
          $match: {
            itemType,
            itemId: new mongoose.Types.ObjectId(itemId),
            status: { $in: ['pending', 'approved'] },
            date: { $gte: dateNormalized, $lt: dayEnd },
          },
        },
        { $group: { _id: null, total: { $sum: '$numberOfPeople' } } },
      ]);
      const currentTotal = (activeOnDay[0] && activeOnDay[0].total) || 0;
      if (currentTotal + num > maxCapacity) {
        return res.status(409).json({
          error: `No availability: this item allows ${maxCapacity} people per day and ${currentTotal} are already booked for this date`,
        });
      }
    }
    const booking = await Booking.create({
      user: req.userId,
      itemType,
      itemId,
      date: dateNormalized,
      numberOfPeople: num,
      note: note != null ? String(note).trim() : '',
      status: 'pending',
    });
    const populated = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .lean();
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create booking' });
  }
});

/**
 * GET /api/bookings - List all bookings (admin only)
 */
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch bookings' });
  }
});

/**
 * GET /api/bookings/:id - Get one booking (owner or admin)
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const isAdmin = await User.findById(req.userId).select('role').then((u) => u?.role === 'admin');
    const isOwner = booking.user?._id?.toString() === req.userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch booking' });
  }
});

/**
 * PUT /api/bookings/:id - Update booking status (owner can cancel; admin can approve or cancel)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const user = await User.findById(req.userId).select('role');
    const isAdmin = user?.role === 'admin';
    const isOwner = booking.user.toString() === req.userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }
    const { status } = req.body || {};
    if (status !== undefined) {
      if (!['pending', 'approved', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'status must be pending, approved, or cancelled' });
      }
      if (isOwner && status !== 'cancelled') {
        return res.status(403).json({ error: 'You can only cancel your own booking' });
      }
      booking.status = status;
      await booking.save();
    }
    const updated = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .lean();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update booking' });
  }
});

/**
 * DELETE /api/bookings/:id - Delete booking (owner or admin only)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const user = await User.findById(req.userId).select('role');
    const isAdmin = user?.role === 'admin';
    const isOwner = booking.user.toString() === req.userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete booking' });
  }
});

module.exports = router;
