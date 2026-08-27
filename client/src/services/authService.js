import api from './api';

export const authService = {
  /**
   * Admin Login Request
   * @param {string} email
   * @param {string} password
   */
  async loginAdmin(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Get Current Authenticated Admin Details
   */
  async getCurrentAdmin() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
