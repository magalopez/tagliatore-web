import axios from 'axios';

const API_URL = 'http://localhost:5001/api/orders';

export const orderService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (orderData) => {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  },

  update: async (id, orderData) => {
    const response = await axios.put(`${API_URL}/${id}`, orderData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axios.put(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  getByStatus: async (status) => {
    const response = await axios.get(`${API_URL}/status/${status}`);
    return response.data;
  }
};
