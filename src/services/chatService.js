import axios from 'axios';

const API_URL = 'http://localhost:5001/api/chats';

export const chatService = {
  getAllChats: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createChat: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  getAvailableWaiters: async () => {
    const response = await axios.get('http://localhost:5001/api/waiters');
    return response.data;
  }
};
