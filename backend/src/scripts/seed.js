// Database Seeding Script
// Populates the database with sample destinations and packages
// Run this script once to add initial data: node src/scripts/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const connectDB = require('../db');

// Sample destinations data
const destinations = [
  {
    name: 'Lalibela',
    description: 'Explore the famous rock-hewn churches, a UNESCO World Heritage site. These 11 monolithic churches were carved out of solid rock in the 12th century and remain active places of worship.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    location: 'Amhara Region'
  },
  {
    name: 'Simien Mountains',
    description: 'Experience breathtaking landscapes and unique wildlife in Ethiopia\'s highest mountain range. Home to the endangered Ethiopian wolf and Gelada baboon, with peaks reaching over 4,500 meters.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    location: 'Amhara Region'
  },
  {
    name: 'Axum',
    description: 'Discover the ancient capital of the Aksumite Empire, one of the oldest continuously inhabited places in Africa. See the famous obelisks and the Church of St. Mary of Zion.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    location: 'Tigray Region'
  },
  {
    name: 'Danakil Depression',
    description: 'Visit one of the hottest and most inhospitable places on Earth. Witness active volcanoes, colorful salt lakes, and unique geological formations in this extreme environment.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    location: 'Afar Region'
  },
  {
    name: 'Gondar',
    description: 'Explore the "Camelot of Africa" with its impressive castles and palaces. The Royal Enclosure contains several well-preserved castles from the 17th and 18th centuries.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    location: 'Amhara Region'
  },
  {
    name: 'Blue Nile Falls',
    description: 'Witness the spectacular "Tis Abay" or "Smoking Water" falls, one of Ethiopia\'s most famous natural attractions. The falls are most impressive during the rainy season.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    location: 'Amhara Region'
  }
];

// Sample packages data
const packages = [
  {
    title: 'Historic North Circuit',
    duration: '10 Days',
    price: 2500,
    description: 'A comprehensive tour covering Lalibela, Gondar, Axum, and the Simien Mountains. Perfect for history enthusiasts and nature lovers.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
  },
  {
    title: 'Coffee Culture Tour',
    duration: '7 Days',
    price: 1800,
    description: 'Experience Ethiopia\'s rich coffee culture from farm to cup. Visit coffee plantations, learn traditional brewing methods, and taste some of the world\'s best coffee.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'
  },
  {
    title: 'Simien Mountains Trekking',
    duration: '5 Days',
    price: 1200,
    description: 'Trek through the stunning Simien Mountains National Park. Encounter unique wildlife, camp under the stars, and enjoy breathtaking mountain views.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  },
  {
    title: 'Danakil Adventure',
    duration: '4 Days',
    price: 1500,
    description: 'An extreme adventure to the Danakil Depression. Visit active volcanoes, colorful salt lakes, and experience one of the most unique landscapes on Earth.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  },
  {
    title: 'Cultural Immersion',
    duration: '8 Days',
    price: 2000,
    description: 'Deep dive into Ethiopian culture. Visit local communities, participate in traditional ceremonies, and learn about the country\'s diverse ethnic groups.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
  },
  {
    title: 'Omo Valley Discovery',
    duration: '6 Days',
    price: 1600,
    description: 'Explore the remote Omo Valley, home to diverse ethnic groups with unique traditions. Experience authentic cultural encounters and traditional ways of life.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Destination.deleteMany({});
    await Package.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert destinations
    const insertedDestinations = await Destination.insertMany(destinations);
    console.log(`✅ Inserted ${insertedDestinations.length} destinations`);

    // Insert packages
    const insertedPackages = await Package.insertMany(packages);
    console.log(`✅ Inserted ${insertedPackages.length} packages`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
