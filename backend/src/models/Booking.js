// Booking Model
// Provides a stable schema for storing bookings made by users.
//
// Design goals:
// - Flexible references: bookings can be tied to a destination, a package, or both
// - Minimal required fields to avoid breaking existing flows
// - Extensible `details` for future booking-specific fields

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      index: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      index: true,
    },

    startDate: { type: Date },
    endDate: { type: Date },

    travelers: {
      type: Number,
      min: 1,
      default: 1,
    },

    totalPrice: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },

    // Optional contact info captured at booking time
    contactName: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },

    // Free-form extension field for any booking-specific details.
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

