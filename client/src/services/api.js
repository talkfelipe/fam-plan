import axios from 'axios';

// Base URL for your Rails API
const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Sign up a new user
  signup: async (userData) => {
    const response = await api.post('/signup', { user: userData });
    return response.data;
  },

  // Log in existing user
  login: async (credentials) => {
    const response = await api.post('/login', { user: credentials });
    // Extract token from response headers
    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  },

  // Log out current user
  logout: async () => {
    const response = await api.delete('/logout');
    localStorage.removeItem('token');
    return response.data;
  },
};

// Events API calls
export const eventsAPI = {
  // Get all events
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get single event
  getOne: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  create: async (eventData) => {
    const response = await api.post('/events', { event: eventData });
    return response.data;
  },

  // Update event
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, { event: eventData });
    return response.data;
  },

  // Delete event
  delete: async (id) => {
    await api.delete(`/events/${id}`);
  },
};

export default api;
