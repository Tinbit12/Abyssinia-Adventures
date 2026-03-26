// Package model for tour packages

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    /** Optional max guests per day; null = unlimited */
    maxCapacity: { type: Number, default: null, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
