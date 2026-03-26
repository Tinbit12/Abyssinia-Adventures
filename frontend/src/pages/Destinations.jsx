// Destinations Page Component
// Displays all available travel destinations with search functionality

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { fetchDestinations } from '../api';
import { staticDestinations } from '../data/staticData';
import './Destinations.css';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch destinations when component mounts
    // Falls back to static data if API fails
    const loadDestinations = async () => {
      try {
        setLoading(true);
        const data = await fetchDestinations();

        // Defensive: ensure we always work with arrays.
        // If the API returns an unexpected shape, fall back to static data.
        if (!Array.isArray(data)) {
          throw new Error('API returned unexpected data shape');
        }

        setDestinations(data);
        setFilteredDestinations(data);
        setError(null);
      } catch (err) {
        // Fallback to static data if API fails
        console.warn('API failed, using static data:', err);
        setDestinations(staticDestinations);
        setFilteredDestinations(staticDestinations);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  // Filter destinations based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDestinations(destinations);
    } else {
      const filtered = destinations.filter(
        (destination) =>
          destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          destination.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, [searchTerm, destinations]);

  return (
    <div className="destinations-page">
      <section className="page-header section">
        <div className="container">
          <h1>Explore Our Destinations</h1>
          <p>Discover the diverse and beautiful destinations Ethiopia has to offer</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="loading">Loading destinations...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredDestinations.length === 0 ? (
            <div className="no-results">
              {searchTerm ? (
                <p>No destinations found matching "{searchTerm}"</p>
              ) : (
                <p>No destinations available</p>
              )}
            </div>
          ) : (
            <>
              <div className="cards-grid">
                {filteredDestinations.map((destination) => (
                  <Card
                    key={destination._id}
                    image={destination.image}
                    title={destination.name}
                    description={destination.description}
                    footer={destination.location}
                  />
                ))}
              </div>
              {searchTerm && (
                <p className="results-count">
                  Found {filteredDestinations.length} destination(s)
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Destinations;
