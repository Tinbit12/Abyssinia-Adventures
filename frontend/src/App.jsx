// Main App Component
// Sets up React Router and defines all routes for the application

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import './App.css';

// Storage key for persisting logged-in user (name, email) across refresh
const USER_STORAGE_KEY = 'abyssinia_user';

function App() {
  // User state: restored from localStorage on mount, updated on login/logout
  const [currentUser, setCurrentUser] = useState(null);

  // Restore user from localStorage on mount so profile works after refresh
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        if (user && (user.email || user.name)) {
          if (!user.role) user.role = 'user';
          setCurrentUser(user);
        }
      }
    } catch {
      // ignore invalid stored data
    }
  }, []);

  // Persist user to localStorage when it changes (login); clear on logout
  const handleSetCurrentUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  // Protected route: redirect to login if not authenticated
  const ProtectedProfile = () =>
    currentUser ? (
      <Profile currentUser={currentUser} setCurrentUser={handleSetCurrentUser} />
    ) : (
      <Navigate to="/auth" replace />
    );

  const ProtectedBooking = () =>
    currentUser ? (
      <Booking />
    ) : (
      <Navigate to="/auth" replace />
    );

  // Admin route: redirect to login if not authenticated, or to home if not admin
  const ProtectedAdmin = () => {
    if (!currentUser) return <Navigate to="/auth" replace />;
    if (currentUser.role !== 'admin') return <Navigate to="/" replace />;
    return <Admin />;
  };

  return (
    <Router>
      <div className="App">
        <Header currentUser={currentUser} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth setCurrentUser={handleSetCurrentUser} />} />
            <Route path="/profile" element={<ProtectedProfile />} />
            <Route path="/book" element={<ProtectedBooking />} />
            <Route path="/admin" element={<ProtectedAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
