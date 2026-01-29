// User Model
// Provides a stable, production-ready schema for signup/login.
//
// Note:
// - This repository did not currently include auth routes/models in `backend/src`.
// - This schema is added to support future/other parts of your backend without
//   changing unrelated routes.
// - Password handling should be done in routes/services (hash before save).

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    // Store a hashed password (recommended). We keep the field name `password`
    // because many starter auth routes expect it, but it should contain a hash.
    password: {
      type: String,
      required: true,
      select: false, // do not return by default in queries
    },

    // Salt used for hashing the password (pbkdf2). Stored separately so we can
    // verify passwords on login without introducing external dependencies.
    passwordSalt: {
      type: String,
      required: true,
      select: false, // do not return by default in queries
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

