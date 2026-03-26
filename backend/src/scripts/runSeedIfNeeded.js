/**
 * Run seed if database is empty (no destinations).
 * Used on app startup so fresh installs get test data and bookable items automatically.
 * Does not clear existing data; only inserts when collections are empty.
 */

const Destination = require('../models/Destination');
const Package = require('../models/Package');
const User = require('../models/User');
const { destinations, packages, TEST_USERS } = require('../data/seedData');

/**
 * Ensures test users exist. Creates them if not present (by email).
 */
async function ensureTestUsers() {
  for (const u of TEST_USERS) {
    const existing = await User.findOne({ email: u.email.trim().toLowerCase() });
    if (!existing) {
      await User.create({
        name: u.name,
        email: u.email.trim().toLowerCase(),
        password: u.password,
        role: u.role || 'user',
      });
      console.log('[seed] Created test user:', u.email);
    }
  }
}

/**
 * Runs seed if Destination collection is empty: inserts destinations, packages, and test users.
 * Resolves to true if seed ran, false if DB already had data.
 */
async function runSeedIfNeeded() {
  try {
    const count = await Destination.countDocuments();
    if (count > 0) {
      await ensureTestUsers();
      return false;
    }
    await Destination.insertMany(destinations);
    console.log('[seed] Inserted', destinations.length, 'destinations');
    await Package.insertMany(packages);
    console.log('[seed] Inserted', packages.length, 'packages');
    await ensureTestUsers();
    console.log('[seed] Database ready with test users and bookable items');
    return true;
  } catch (err) {
    console.error('[seed] Error running seed:', err);
    throw err;
  }
}

module.exports = { runSeedIfNeeded };
