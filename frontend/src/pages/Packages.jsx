// Packages Page Component
// Displays all available tour packages with search functionality

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { fetchPackages } from '../api';
import { staticPackages } from '../data/staticData';
import './Packages.css';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch packages when component mounts
    // Falls back to static data if API fails
    const loadPackages = async () => {
      try {
        setLoading(true);
        const data = await fetchPackages();

        // Defensive: ensure we always work with arrays.
        // If the API returns an unexpected shape, fall back to static data.
        if (!Array.isArray(data)) {
          throw new Error('API returned unexpected data shape');
        }

        setPackages(data);
        setFilteredPackages(data);
        setError(null);
      } catch (err) {
        // Fallback to static data if API fails
        console.warn('API failed, using static data:', err);
        setPackages(staticPackages);
        setFilteredPackages(staticPackages);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  // Filter packages based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.duration.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
  }, [searchTerm, packages]);

  return (
    <div className="packages-page">
      <section className="page-header section">
        <div className="container">
          <h1>Tour Packages</h1>
          <p>Choose from our carefully curated tour packages</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Packages Grid */}
          {loading ? (
            <div className="loading">Loading packages...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredPackages.length === 0 ? (
            <div className="no-results">
              {searchTerm ? (
                <p>No packages found matching "{searchTerm}"</p>
              ) : (
                <p>No packages available</p>
              )}
            </div>
          ) : (
            <>
              <div className="cards-grid">
                {filteredPackages.map((pkg) => (
                  <Card
                    key={pkg._id}
                    image={pkg.image}
                    title={pkg.title}
                    description={pkg.description}
                    footer={`${pkg.duration} • $${pkg.price}`}
                  />
                ))}
              </div>
              {searchTerm && (
                <p className="results-count">
                  Found {filteredPackages.length} package(s)
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Packages;
