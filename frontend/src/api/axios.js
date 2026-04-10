import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://product-catalog-4bcz.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
