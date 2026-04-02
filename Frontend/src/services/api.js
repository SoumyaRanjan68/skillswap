import axios from 'axios';

const API = axios.create({
  baseURL: 'https://skillswap-eitr.onrender.com/api'
});

// auto-attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;