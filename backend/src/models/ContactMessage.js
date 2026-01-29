// ContactMessage Model
// Stores contact form submissions in MongoDB.
//
// Design goals:
// - Keep required fields minimal and predictable (name, email, message)
// - Safely capture any additional fields sent by the frontend without breaking
//   if the form changes (stored under `extraFields`)
// - Add basic request metadata for debugging/abuse mitigation (ip, userAgent)

const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Automatically detected fields from the frontend payload (e.g. subject, phone, company).
    // We store them as a generic object to avoid schema changes when the form changes.
    extraFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Request metadata (optional)
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);

