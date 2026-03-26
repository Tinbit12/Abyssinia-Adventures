// Home Page Component
// Main landing page with hero, popular destinations, featured packages, and testimonials

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Testimonials from '../components/Testimonials';
import { fetchDestinations, fetchPackages } from '../api';
import { staticDestinations, staticPackages } from '../data/staticData';
import './Home.css';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch destinations and packages when component mounts
    // Falls back to static data if API fails
    const loadData = async () => {
      try {
        setLoading(true);
        const [destinationsData, packagesData] = await Promise.all([
          fetchDestinations(),
          fetchPackages()
        ]);

        // Defensive: ensure we always work with arrays.
        // If the API returns an unexpected shape, fall back to static data.
        if (!Array.isArray(destinationsData) || !Array.isArray(packagesData)) {
          throw new Error('API returned unexpected data shape');
        }
        
        // Home page requirement: remove Lalibela and show 3 destinations
        const homeDestinations = destinationsData
          .filter((d) => d?.name !== 'Lalibela')
          .slice(0, 3);

        setDestinations(homeDestinations);
        setPackages(packagesData.slice(0, 3));
        setError(null);
      } catch (err) {
        // Fallback to static data if API fails
        console.warn('API failed, using static data:', err);
        const homeDestinations = staticDestinations
          .filter((d) => d?.name !== 'Lalibela')
          .slice(0, 3);

        setDestinations(homeDestinations);
        setPackages(staticPackages.slice(0, 3));
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="home-page">
      <Hero
        title="Discover the Beauty of Ethiopia"
        subtitle="Experience rich culture, stunning landscapes, and unforgettable adventures"
        buttonText="Explore Destinations"
        buttonLink="/destinations"
      />

      {/* Popular Destinations Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          {loading ? (
            <div className="loading">Loading destinations...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : destinations.length === 0 ? (
            <div className="loading">No destinations available</div>
          ) : (
            <>
              <div className="cards-grid">
                {destinations.map((destination) => (
                  <Card
                    key={destination._id || destination.name}
                    image={destination.image}
                    title={destination.name}
                    description={destination.description}
                    footer={destination.location}
                  />
                ))}
              </div>
              <div className="section-link">
                <Link to="/destinations" className="btn btn-secondary">
                  View All Destinations
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Tour Packages Section */}
      <section className="section featured-packages">
        <div className="container">
          <h2 className="section-title">Featured Tour Packages</h2>
          {loading ? (
            <div className="loading">Loading packages...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : packages.length === 0 ? (
            <div className="loading">No packages available</div>
          ) : (
            <>
              <div className="cards-grid">
                {packages.map((pkg) => (
                  <Card
                    key={pkg._id || pkg.title}
                    image={pkg.image}
                    title={pkg.title}
                    description={pkg.description}
                    footer={`${pkg.duration} • $${pkg.price}`}
                  />
                ))}
              </div>
              <div className="section-link">
                <Link to="/packages" className="btn btn-secondary">
                  View All Packages
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default Home;
