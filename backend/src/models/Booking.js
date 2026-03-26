// Booking model for user bookings (destinations or packages)
// Linked to User; stores item type (destination/package), date, number of people, note, status
// Indexes support duplicate check (one active booking per user per item per day) and capacity checks

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['destination', 'package'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true, min: 1 },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Index for duplicate check: same user + item + date (day)
bookingSchema.index({ user: 1, itemType: 1, itemId: 1, date: 1 });
// Index for capacity/availability: item + date
bookingSchema.index({ itemType: 1, itemId: 1, date: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
