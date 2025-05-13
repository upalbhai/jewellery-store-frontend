// src/core/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import { logout } from '@/features/auth/authSlice';
import { store } from '@/store';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // change to your backend URL
  withCredentials: true, // important for cookies
});

console.log('api',api)

// Intercept responses to catch expired token
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      toast.error('Session expired. Please log in again.');
      store.dispatch(logout());
      // setTimeout(() => {
      //   window.location.href = '/login';
      // }, 1000);
    }

    return Promise.reject(error);
  }
);

export default api;
