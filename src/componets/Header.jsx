// Header Component
// Navigation bar that appears on all pages

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  // Check if current path matches the link to apply active class
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <h1>Abyssinia Adventures</h1>
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive('/about') ? 'active' : ''}>
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/destinations" 
                className={isActive('/destinations') ? 'active' : ''}
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link 
                to="/packages" 
                className={isActive('/packages') ? 'active' : ''}
              >
                Packages
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={isActive('/contact') ? 'active' : ''}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
