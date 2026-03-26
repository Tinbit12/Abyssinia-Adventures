// Hero Component
// Large banner section typically used on the home page

import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero({ title, subtitle, buttonText, buttonLink }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {buttonText && buttonLink && (
          <Link to={buttonLink} className="btn btn-hero">
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}

export default Hero;
