import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/v1',
  withCredentials: true, // This allows cookies (JWT) to be sent back and forth
});

export default API;
