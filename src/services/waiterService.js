import axios from 'axios';

const API_URL = 'http://localhost:5001/api/waiters';

export const waiterService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (waiterData) => {
    const response = await axios.post(API_URL, waiterData);
    return response.data;
  },

  update: async (id, waiterData) => {
    const response = await axios.put(`${API_URL}/${id}`, waiterData);
    return response.data;
  },

  toggleActive: async (id, isActive) => {
    const response = await axios.put(`${API_URL}/${id}`, { isActive });
    return response.data;
  }
};
