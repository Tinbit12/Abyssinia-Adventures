// Footer Component
// Footer that appears on all pages with contact info and social links

import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Abyssinia Adventures</h3>
            <p>Discover the beauty and culture of Ethiopia with our expert travel guides.</p>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@abyssiniaadventures.com</p>
            <p>Phone: +251 11 123 4567</p>
            <p>Address: Addis Ababa, Ethiopia</p>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Abyssinia Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
