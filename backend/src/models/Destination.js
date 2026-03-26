// Destination model for travel destinations

const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    /** Optional max guests per day; null = unlimited */
    maxCapacity: { type: Number, default: null, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
