// Booking Page - Create a booking (destination or package) and list my bookings
// Protected route: logged-in users only

import React, { useState, useEffect } from 'react';
import {
  fetchDestinations,
  fetchPackages,
  fetchMyBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getToken,
} from '../api';
import './Booking.css';

function Booking() {
  const [itemType, setItemType] = useState('destination');
  const [itemId, setItemId] = useState('');
  const [date, setDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [note, setNote] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const token = getToken();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [dests, pkgs, myBookings] = await Promise.all([
          fetchDestinations(),
          fetchPackages(),
          fetchMyBookings(token),
        ]);
        setDestinations(Array.isArray(dests) ? dests : []);
        setPackages(Array.isArray(pkgs) ? pkgs : []);
        setBookings(Array.isArray(myBookings) ? myBookings : []);
      } catch (err) {
        setMessage(err?.message || 'Failed to load data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    setItemId('');
  }, [itemType]);

  const items = itemType === 'destination' ? destinations : packages;
  const itemLabel = itemType === 'destination' ? 'Destination' : 'Package';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    if (!itemId || !date || !numberOfPeople || numberOfPeople < 1) {
      setMessageType('error');
      setMessage('Please select an item, date, and number of people (at least 1).');
      return;
    }
    setSubmitting(true);
    try {
      await createBooking(
        {
          itemType,
          itemId,
          date: new Date(date).toISOString(),
          numberOfPeople: Number(numberOfPeople),
          note: note.trim() || undefined,
        },
        token
      );
      setMessageType('success');
      setMessage('Booking created successfully.');
      setDate('');
      setNumberOfPeople(1);
      setNote('');
      setItemId('');
      const myBookings = await fetchMyBookings(token);
      setBookings(Array.isArray(myBookings) ? myBookings : []);
    } catch (err) {
      setMessageType('error');
      setMessage(err?.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (id) => {
    setMessage('');
    try {
      await updateBooking(id, { status: 'cancelled' }, token);
      setMessageType('success');
      setMessage('Booking cancelled.');
      const myBookings = await fetchMyBookings(token);
      setBookings(Array.isArray(myBookings) ? myBookings : []);
    } catch (err) {
      setMessageType('error');
      setMessage(err?.message || 'Failed to cancel booking.');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    setMessage('');
    try {
      await deleteBooking(id, token);
      setMessageType('success');
      setMessage('Booking deleted.');
      const myBookings = await fetchMyBookings(token);
      setBookings(Array.isArray(myBookings) ? myBookings : []);
    } catch (err) {
      setMessageType('error');
      setMessage(err?.message || 'Failed to delete booking.');
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    const x = new Date(d);
    return Number.isNaN(x.getTime()) ? String(d) : x.toLocaleDateString();
  };

  const getItemName = (b) => {
    if (b.itemType === 'destination') {
      const d = destinations.find((x) => x._id === b.itemId);
      return d?.name || b.itemId;
    }
    const p = packages.find((x) => x._id === b.itemId);
    return p?.title || b.itemId;
  };

  if (loading) {
    return (
      <div className="booking-page">
        <section className="booking-hero section">
          <div className="container">
            <h1>Book a Trip</h1>
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <section className="booking-hero section">
        <div className="container">
          <h1>Book a Trip</h1>
          <p>Book a destination or package and view your bookings</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {message && (
            <div className={`booking-message ${messageType}`} role="alert">
              {message}
            </div>
          )}

          <div className="booking-form-card">
            <h2>New Booking</h2>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="booking-field">
                <label>Type</label>
                <select value={itemType} onChange={(e) => setItemType(e.target.value)} required>
                  <option value="destination">Destination</option>
                  <option value="package">Package</option>
                </select>
              </div>
              <div className="booking-field">
                <label>{itemLabel}</label>
                <select value={itemId} onChange={(e) => setItemId(e.target.value)} required>
                  <option value="">Select {itemLabel.toLowerCase()}</option>
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {itemType === 'destination' ? item.name : item.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="booking-field">
                <label htmlFor="booking-date">Date</label>
                <input
                  id="booking-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="booking-field">
                <label htmlFor="booking-people">Number of people</label>
                <input
                  id="booking-people"
                  type="number"
                  min={1}
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Number(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="booking-field">
                <label htmlFor="booking-note">Note (optional)</label>
                <textarea
                  id="booking-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Special requests..."
                />
              </div>
              <button type="submit" className="booking-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Create Booking'}
              </button>
            </form>
          </div>

          <div className="booking-list-card">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="booking-empty">No bookings yet.</p>
            ) : (
              <div className="booking-table-wrap">
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>People</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td>{getItemName(b)}</td>
                        <td>{b.itemType}</td>
                        <td>{formatDate(b.date)}</td>
                        <td>{b.numberOfPeople}</td>
                        <td>
                          <span className={`booking-status booking-status-${b.status}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          {b.status !== 'cancelled' && (
                            <>
                              <button
                                type="button"
                                className="booking-btn-small booking-btn-cancel"
                                onClick={() => handleCancelBooking(b._id)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="booking-btn-small booking-btn-delete"
                                onClick={() => handleDeleteBooking(b._id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Booking;
