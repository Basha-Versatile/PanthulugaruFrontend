import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1.0';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const customerToken = localStorage.getItem('pg_customer_token');
      const pgToken = localStorage.getItem('pg_panthulugaru_token');
      const adminToken = localStorage.getItem('adminToken');

      const token = customerToken || pgToken || adminToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Normalize backend response: backend sends { status, msg, data }
    // but frontend expects { success, message, data }
    if (response.data && typeof response.data === 'object') {
      if ('status' in response.data && !('success' in response.data)) {
        response.data.success = response.data.status;
      }
      if ('msg' in response.data && !('message' in response.data)) {
        response.data.message = response.data.msg;
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pg_customer_token');
        localStorage.removeItem('pg_user');
        localStorage.removeItem('pg_panthulugaru_token');
        localStorage.removeItem('pg_panthulugaru_user');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
