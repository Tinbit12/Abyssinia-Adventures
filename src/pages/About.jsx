// About Page Component
// Information about Abyssinia Adventures

import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <section className="about-hero section">
        <div className="container">
          <h1>About Abyssinia Adventures</h1>
          <p className="lead">
            Your trusted partner in discovering the wonders of Ethiopia
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Abyssinia Adventures was founded with a passion for showcasing
                the incredible beauty, rich history, and vibrant culture of
                Ethiopia. We believe that travel should be transformative,
                educational, and unforgettable.
              </p>
              <p>
                Our team of experienced guides and travel experts are dedicated
                to providing authentic experiences that connect you with the
                heart and soul of Ethiopia. From the ancient rock-hewn churches
                of Lalibela to the breathtaking landscapes of the Simien
                Mountains, we curate journeys that leave lasting impressions.
              </p>
            </div>

            <div className="about-features">
              <div className="feature-item">
                <h3>Expert Guides</h3>
                <p>
                  Our knowledgeable local guides bring history and culture to
                  life with their expertise and passion.
                </p>
              </div>
              <div className="feature-item">
                <h3>Authentic Experiences</h3>
                <p>
                  We focus on genuine cultural interactions and meaningful
                  connections with local communities.
                </p>
              </div>
              <div className="feature-item">
                <h3>Sustainable Tourism</h3>
                <p>
                  We are committed to responsible travel that benefits local
                  communities and preserves Ethiopia's natural heritage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
