/**
 * Shared seed data for destinations, packages, and test users.
 * Used by seed.js (manual run) and runSeedIfNeeded (auto-seed on first run).
 */

const destinations = [
  {
    name: 'Lalibela',
    description:
      'Explore the famous rock-hewn churches, a UNESCO World Heritage site. These 11 monolithic churches were carved out of solid rock in the 12th century and remain active places of worship.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    location: 'Amhara Region',
    maxCapacity: 50,
  },
  {
    name: 'Simien Mountains',
    description:
      "Experience breathtaking landscapes and unique wildlife in Ethiopia's highest mountain range. Home to the endangered Ethiopian wolf and Gelada baboon, with peaks reaching over 4,500 meters.",
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    location: 'Amhara Region',
    maxCapacity: 30,
  },
  {
    name: 'Axum',
    description:
      'Discover the ancient capital of the Aksumite Empire. See the famous obelisks and the Church of St. Mary of Zion.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    location: 'Tigray Region',
    maxCapacity: 40,
  },
  {
    name: 'Danakil Depression',
    description:
      'Visit one of the hottest and most inhospitable places on Earth. Witness active volcanoes, colorful salt lakes, and unique geological formations.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    location: 'Afar Region',
    maxCapacity: 20,
  },
  {
    name: 'Gondar',
    description:
      'Explore the "Camelot of Africa" with its impressive castles and palaces. The Royal Enclosure contains several well-preserved castles from the 17th and 18th centuries.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    location: 'Amhara Region',
    maxCapacity: 45,
  },
  {
    name: 'Blue Nile Falls',
    description:
      'Witness the spectacular "Tis Abay" or "Smoking Water" falls, one of Ethiopia\'s most famous natural attractions.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    location: 'Amhara Region',
    maxCapacity: 60,
  },
];

const packages = [
  {
    title: 'Historic North Circuit',
    duration: '10 Days',
    price: 2500,
    description:
      'A comprehensive tour covering Lalibela, Gondar, Axum, and the Simien Mountains. Perfect for history enthusiasts and nature lovers.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    maxCapacity: 15,
  },
  {
    title: 'Coffee Culture Tour',
    duration: '7 Days',
    price: 1800,
    description:
      'Experience Ethiopia\'s rich coffee culture from farm to cup. Visit coffee plantations, learn traditional brewing methods, and taste some of the world\'s best coffee.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    maxCapacity: 12,
  },
  {
    title: 'Simien Mountains Trekking',
    duration: '5 Days',
    price: 1200,
    description:
      'Trek through the stunning Simien Mountains National Park. Encounter unique wildlife, camp under the stars, and enjoy breathtaking mountain views.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    maxCapacity: 10,
  },
  {
    title: 'Danakil Adventure',
    duration: '4 Days',
    price: 1500,
    description:
      'An extreme adventure to the Danakil Depression. Visit active volcanoes, colorful salt lakes, and experience one of the most unique landscapes on Earth.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    maxCapacity: 8,
  },
  {
    title: 'Cultural Immersion',
    duration: '8 Days',
    price: 2000,
    description:
      'Deep dive into Ethiopian culture. Visit local communities, participate in traditional ceremonies, and learn about the country\'s diverse ethnic groups.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    maxCapacity: 14,
  },
  {
    title: 'Omo Valley Discovery',
    duration: '6 Days',
    price: 1600,
    description:
      'Explore the remote Omo Valley, home to diverse ethnic groups with unique traditions. Experience authentic cultural encounters and traditional ways of life.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    maxCapacity: 10,
  },
];

/** Test users: always created by seed if not present. Use these to log in after fresh install. */
const TEST_USERS = [
  {
    name: 'Test User',
    email: 'user@test.com',
    password: 'TestUser123!',
    role: 'user',
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
  },
];

module.exports = { destinations, packages, TEST_USERS };
