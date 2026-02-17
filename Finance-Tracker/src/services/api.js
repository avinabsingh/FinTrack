import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

// VERY IMPORTANT: include credentials for session
export const fetchSummary = () =>
  axios.get(`${API_BASE_URL}/analysis/summary`, {
    withCredentials: true
  });

export const fetchCategories = () =>
  axios.get(`${API_BASE_URL}/analysis/categories`, {
    withCredentials: true
  });

export const fetchStats = () =>
  axios.get(`${API_BASE_URL}/analysis/stats`, {
    withCredentials: true
  });
