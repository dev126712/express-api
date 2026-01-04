import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/v1',
  withCredentials: true, // This allows cookies (JWT) to be sent back and forth
});

// 1. Add a request interceptor to include the token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  
  // 2. If it exists, add it to the headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default API;
