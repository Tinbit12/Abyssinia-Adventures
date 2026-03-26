// Database Seeding Script (manual run)
// Populates the database with destinations, packages, and test users.
// Run: npm run seed
// For fresh installs, the server also auto-seeds on first start (see runSeedIfNeeded).

require('dotenv').config();
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const User = require('../models/User');
const connectDB = require('../db');
const { destinations, packages, TEST_USERS } = require('../data/seedData');

async function createAdminFromEnv() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;
  const existing = await User.findOne({ email: adminEmail.trim().toLowerCase() });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log('✅ Updated existing user to admin:', adminEmail);
    return;
  }
  await User.create({
    name: 'Admin',
    email: adminEmail.trim().toLowerCase(),
    password: adminPassword,
    role: 'admin',
  });
  console.log('✅ Created admin user:', adminEmail);
}

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
      console.log('✅ Created test user:', u.email);
    } else {
      console.log('ℹ️  Test user already exists:', u.email);
    }
  }
}

async function seedDatabase() {
  try {
    await connectDB();

    await Destination.deleteMany({});
    await Package.deleteMany({});
    console.log('🗑️  Cleared destinations and packages');

    await Destination.insertMany(destinations);
    console.log(`✅ Inserted ${destinations.length} destinations`);

    await Package.insertMany(packages);
    console.log(`✅ Inserted ${packages.length} packages`);

    await ensureTestUsers();
    await createAdminFromEnv();

    console.log('🎉 Database seeded successfully!');
    console.log('   Test users: user@test.com / TestUser123!  |  admin@test.com / Admin123!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
