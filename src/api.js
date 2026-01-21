// API Configuration
// Centralized file for all API calls to the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit contact form');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};
