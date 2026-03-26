// Admin Dashboard - CRUD for Destinations, Packages, Users, Bookings
// Protected route: admin role only

import React, { useState, useEffect } from 'react';
import {
  fetchDestinations,
  fetchPackages,
  fetchAllUsers,
  fetchAllBookings,
  createDestination,
  updateDestination,
  deleteDestination,
  createPackage,
  updatePackage,
  deletePackage,
  updateUser,
  deleteUser,
  updateBooking,
  deleteBooking,
  getToken,
} from '../api';
import './Admin.css';

const TABS = ['destinations', 'packages', 'users', 'bookings'];

function Admin() {
  const [activeTab, setActiveTab] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const token = getToken();

  const loadAll = async () => {
    try {
      setLoading(true);
      const [dests, pkgs, usrs, bks] = await Promise.all([
        fetchDestinations(),
        fetchPackages(),
        fetchAllUsers(token),
        fetchAllBookings(token),
      ]);
      setDestinations(Array.isArray(dests) ? dests : []);
      setPackages(Array.isArray(pkgs) ? pkgs : []);
      setUsers(Array.isArray(usrs) ? usrs : []);
      setBookings(Array.isArray(bks) ? bks : []);
    } catch (err) {
      setMessage(err?.message || 'Failed to load data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const showMsg = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    const d = formData.dest || {};
    if (!d.name || !d.description || !d.image || !d.location) {
      showMsg('Name, description, image, and location are required.', 'error');
      return;
    }
    try {
      await createDestination(d, token);
      showMsg('Destination created.');
      setFormData({ ...formData, dest: {} });
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to create destination.', 'error');
    }
  };

  const handleUpdateDestination = async (e) => {
    e.preventDefault();
    const d = formData.dest || {};
    if (!editingId) return;
    try {
      await updateDestination(editingId, d, token);
      showMsg('Destination updated.');
      setEditingId(null);
      setFormData({ ...formData, dest: {} });
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to update destination.', 'error');
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await deleteDestination(id, token);
      showMsg('Destination deleted.');
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to delete destination.', 'error');
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    const p = formData.pkg || {};
    if (!p.title || !p.duration || p.price == null || !p.description || !p.image) {
      showMsg('Title, duration, price, description, and image are required.', 'error');
      return;
    }
    try {
      await createPackage(p, token);
      showMsg('Package created.');
      setFormData({ ...formData, pkg: {} });
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to create package.', 'error');
    }
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    const p = formData.pkg || {};
    if (!editingId) return;
    try {
      await updatePackage(editingId, p, token);
      showMsg('Package updated.');
      setEditingId(null);
      setFormData({ ...formData, pkg: {} });
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to update package.', 'error');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await deletePackage(id, token);
      showMsg('Package deleted.');
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to delete package.', 'error');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const u = formData.user || {};
    if (!editingId) return;
    try {
      await updateUser(editingId, u, token);
      showMsg('User updated.');
      setEditingId(null);
      setFormData({ ...formData, user: {} });
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to update user.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id, token);
      showMsg('User deleted.');
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to delete user.', 'error');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await updateBooking(id, { status }, token);
      showMsg('Booking updated.');
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to update booking.', 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await deleteBooking(id, token);
      showMsg('Booking deleted.');
      loadAll();
    } catch (err) {
      showMsg(err?.message || 'Failed to delete booking.', 'error');
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    const x = new Date(d);
    return Number.isNaN(x.getTime()) ? String(d) : x.toLocaleDateString();
  };

  if (loading && destinations.length === 0 && packages.length === 0) {
    return (
      <div className="admin-page">
        <section className="admin-hero section">
          <div className="container">
            <h1>Admin Dashboard</h1>
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <section className="admin-hero section">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Manage destinations, packages, users, and bookings</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {message && (
            <div className={`admin-message ${messageType}`} role="alert">
              {message}
            </div>
          )}

          <div className="admin-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  setEditingId(null);
                  setFormData({});
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'destinations' && (
            <div className="admin-panel">
              <h2>Destinations</h2>
              <form
                onSubmit={editingId ? handleUpdateDestination : handleCreateDestination}
                className="admin-form"
              >
                <input
                  placeholder="Name"
                  value={formData.dest?.name ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dest: { ...(formData.dest || {}), name: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Description"
                  value={formData.dest?.description ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dest: { ...(formData.dest || {}), description: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Image URL"
                  value={formData.dest?.image ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dest: { ...(formData.dest || {}), image: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Location"
                  value={formData.dest?.location ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dest: { ...(formData.dest || {}), location: e.target.value },
                    })
                  }
                />
                <div className="admin-form-actions">
                  <button type="submit">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ ...formData, dest: {} });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((d) => (
                      <tr key={d._id}>
                        <td>{d.name}</td>
                        <td>{d.location}</td>
                        <td>
                          <button
                            type="button"
                            className="admin-btn-edit"
                            onClick={() => {
                              setEditingId(d._id);
                              setFormData({
                                ...formData,
                                dest: {
                                  name: d.name,
                                  description: d.description,
                                  image: d.image,
                                  location: d.location,
                                },
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-delete"
                            onClick={() => handleDeleteDestination(d._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="admin-panel">
              <h2>Packages</h2>
              <form
                onSubmit={editingId ? handleUpdatePackage : handleCreatePackage}
                className="admin-form"
              >
                <input
                  placeholder="Title"
                  value={formData.pkg?.title ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pkg: { ...(formData.pkg || {}), title: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Duration (e.g. 5 days)"
                  value={formData.pkg?.duration ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pkg: { ...(formData.pkg || {}), duration: e.target.value },
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.pkg?.price ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pkg: { ...(formData.pkg || {}), price: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Description"
                  value={formData.pkg?.description ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pkg: { ...(formData.pkg || {}), description: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Image URL"
                  value={formData.pkg?.image ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pkg: { ...(formData.pkg || {}), image: e.target.value },
                    })
                  }
                />
                <div className="admin-form-actions">
                  <button type="submit">{editingId ? 'Update' : 'Create'}</button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ ...formData, pkg: {} });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((p) => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>{p.duration}</td>
                        <td>{p.price}</td>
                        <td>
                          <button
                            type="button"
                            className="admin-btn-edit"
                            onClick={() => {
                              setEditingId(p._id);
                              setFormData({
                                ...formData,
                                pkg: {
                                  title: p.title,
                                  duration: p.duration,
                                  price: p.price,
                                  description: p.description,
                                  image: p.image,
                                },
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-delete"
                            onClick={() => handleDeletePackage(p._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-panel">
              <h2>Users</h2>
              {editingId && (
                <form onSubmit={handleUpdateUser} className="admin-form">
                  <input
                    placeholder="Name"
                    value={formData.user?.name ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user: { ...(formData.user || {}), name: e.target.value },
                      })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.user?.email ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user: { ...(formData.user || {}), email: e.target.value },
                      })
                    }
                  />
                  <select
                    value={formData.user?.role ?? 'user'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user: { ...(formData.user || {}), role: e.target.value },
                      })
                    }
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <div className="admin-form-actions">
                    <button type="submit">Update</button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ ...formData, user: {} });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>
                          <button
                            type="button"
                            className="admin-btn-edit"
                            onClick={() => {
                              setEditingId(u._id);
                              setFormData({
                                ...formData,
                                user: { name: u.name, email: u.email, role: u.role || 'user' },
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-btn-delete"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="admin-panel">
              <h2>Bookings</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Item ID</th>
                      <th>Date</th>
                      <th>People</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td>{b.user?.email ?? b.user ?? '-'}</td>
                        <td>{b.itemType}</td>
                        <td>{String(b.itemId).slice(-6)}</td>
                        <td>{formatDate(b.date)}</td>
                        <td>{b.numberOfPeople}</td>
                        <td>{b.status}</td>
                        <td>
                          {b.status !== 'approved' && (
                            <button
                              type="button"
                              className="admin-btn-edit"
                              onClick={() => handleUpdateBookingStatus(b._id, 'approved')}
                            >
                              Approve
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              type="button"
                              className="admin-btn-cancel"
                              onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            className="admin-btn-delete"
                            onClick={() => handleDeleteBooking(b._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Admin;
