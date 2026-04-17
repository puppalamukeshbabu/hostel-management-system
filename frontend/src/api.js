// API Service for MongoDB backend communication
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Production: same domain
  : 'http://localhost:5001/api';  // Development: local backend

export const api = {
  // Users
  getUsers: async () => {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },
  
  createUser: async (user) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return res.json();
  },
  
  updateUser: async (id, data) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Rooms
  getRooms: async () => {
    const res = await fetch(`${API_URL}/rooms`);
    return res.json();
  },
  
  createRoom: async (room) => {
    const res = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    return res.json();
  },
  
  updateRoom: async (id, data) => {
    const res = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  deleteRoom: async (id) => {
    const res = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Payments
  getPayments: async () => {
    const res = await fetch(`${API_URL}/payments`);
    return res.json();
  },
  
  createPayment: async (payment) => {
    const res = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment)
    });
    return res.json();
  },

  // Complaints
  getComplaints: async () => {
    const res = await fetch(`${API_URL}/complaints`);
    return res.json();
  },
  
  createComplaint: async (complaint) => {
    const res = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint)
    });
    return res.json();
  },
  
  updateComplaint: async (id, data) => {
    const res = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Health check
  health: async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      return res.json();
    } catch (err) {
      console.error('Backend connection error:', err);
      return null;
    }
  }
};

// Helper to convert array to object by id
export const toObj = (arr) => arr.reduce((acc, item) => ({...acc, [item.id]: item}), {});

// Helper to convert object to array
export const toArr = (obj) => Object.values(obj);
