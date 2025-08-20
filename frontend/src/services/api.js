import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me')
};

// Event services
export const eventService = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(eventData).forEach(key => {
      if (key !== 'poster') {
        formData.append(key, eventData[key]);
      }
    });
    
    // Append poster file if exists
    if (eventData.poster) {
      formData.append('poster', eventData.poster);
    }
    
    return api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateEvent: (id, eventData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(eventData).forEach(key => {
      if (key !== 'poster') {
        formData.append(key, eventData[key]);
      }
    });
    
    // Append poster file if exists
    if (eventData.poster) {
      formData.append('poster', eventData.poster);
    }
    
    return api.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteEvent: (id) => api.delete(`/events/${id}`),
  addVolunteers: (id, volunteers) => api.post(`/events/${id}/volunteers`, { volunteers })
};

// Registration services
export const registrationService = {
  registerForEvent: (eventId) => api.post('/registrations', { eventId }),
  getUserRegistrations: () => api.get('/registrations/user'),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  getRegistrationCount: (eventId) => api.get(`/registrations/count/${eventId}`)
};

// Attendance services
export const attendanceService = {
  markAttendance: (registrationId) => api.post('/attendance/mark', { registrationId }),
  getEventAttendance: (eventId) => api.get(`/attendance/event/${eventId}`)
};

export default api;