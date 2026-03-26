const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AUTH_TOKEN_KEY = 'abyssinia_token';

/** Get stored JWT for authenticated requests */
export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || null;

/** Helper to parse backend errors safely */
const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/** Build headers with optional auth token */
const authHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  const t = token || getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  return headers;
};

// Fetch all destinations from the backend
export const fetchDestinations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations`);
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

// Fetch all tour packages from the backend
export const fetchPackages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/packages`);
    if (!response.ok) {
      throw new Error('Failed to fetch packages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

// Signup
export const signup = async ({ name, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    throw new Error(data?.error || 'Signup failed');
  }
  return data;
};

// Login
export const login = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok) {
    throw new Error(data?.error || 'Login failed');
  }
  return data;
};

// Change password (requires Bearer token)
export const changePassword = async ({ currentPassword, newPassword }, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to change password');
  return data;
};

// Delete own account (requires Bearer token)
export const deleteAccount = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/account`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to delete account');
  return data;
};

// --- Bookings (auth required) ---
export const fetchMyBookings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/bookings/my`, { headers: authHeaders(token) });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to fetch bookings');
  return data;
};

export const createBooking = async (body, token) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to create booking');
  return data;
};

export const updateBooking = async (id, body, token) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to update booking');
  return data;
};

export const deleteBooking = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to delete booking');
  return data;
};

// --- Admin: Bookings ---
export const fetchAllBookings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, { headers: authHeaders(token) });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to fetch bookings');
  return data;
};

// --- Admin: Users ---
export const fetchAllUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, { headers: authHeaders(token) });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to fetch users');
  return data;
};

export const updateUser = async (id, body, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to update user');
  return data;
};

export const deleteUser = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to delete user');
  return data;
};

// --- Admin: Destinations CRUD (create/update/delete require auth + admin) ---
export const createDestination = async (body, token) => {
  const response = await fetch(`${API_BASE_URL}/destinations`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to create destination');
  return data;
};

export const updateDestination = async (id, body, token) => {
  const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to update destination');
  return data;
};

export const deleteDestination = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to delete destination');
  return data;
};

// --- Admin: Packages CRUD ---
export const createPackage = async (body, token) => {
  const response = await fetch(`${API_BASE_URL}/packages`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to create package');
  return data;
};

export const updatePackage = async (id, body, token) => {
  const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to update package');
  return data;
};

export const deletePackage = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJsonSafely(response);
  if (!response.ok) throw new Error(data?.error || 'Failed to delete package');
  return data;
};

// Submit contact form to the backend
export const submitContact = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const error = await parseJsonSafely(response);
      throw new Error(error?.error || 'Failed to submit contact form');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};
