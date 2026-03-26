// Testimonials Component
// Displays customer reviews and testimonials

import React from 'react';
import './Testimonials.css';

function Testimonials() {
  // Static testimonials data (could be moved to backend later)
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'United States',
      text: 'An incredible journey through Ethiopia! The guides were knowledgeable and the experiences were unforgettable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      location: 'Canada',
      text: 'The best travel experience of my life. Ethiopia\'s history and culture are truly remarkable.',
      rating: 5
    },
    {
      name: 'Emma Williams',
      location: 'United Kingdom',
      text: 'Amazing landscapes and warm hospitality. Highly recommend Abyssinia Adventures!',
      rating: 5
    }
  ];

  return (
    <section className="testimonials section">
      <div className="container">
        <h2 className="section-title">What Our Travelers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {'★'.repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
