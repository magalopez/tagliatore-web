import axios from 'axios';

const API_URL = 'http://localhost:5001/api/dishes';

export const dishService = {
  getAll: async (includeInactive = false) => {
    const response = await axios.get(`${API_URL}${includeInactive ? '?all=true' : ''}`);
    return response.data;
  },
  
  create: async (dishData) => {
    const response = await axios.post(API_URL, dishData);
    return response.data;
  },

  update: async (id, dishData) => {
    const response = await axios.put(`${API_URL}/${id}`, dishData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};
