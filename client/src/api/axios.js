import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/v1',
  withCredentials: true, // This allows cookies (JWT) to be sent back and forth
});
  // Add this "interceptor"
API.interceptors.request.use((config) => {
  // 1. Get the token from wherever you stored it during login
  const token = localStorage.getItem('token'); 
  
  // 2. If it exists, add it to the headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
