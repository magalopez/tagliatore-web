import axios from 'axios';

const API_URL = 'http://localhost:5001/api/categories';

// Configurar interceptor para incluir el token
axios.interceptors.request.use(
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

export const categoryService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (categoryData) => {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
  },

  update: async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/${id}`, categoryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};
