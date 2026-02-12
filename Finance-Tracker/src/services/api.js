import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const fetchSummary = () => axios.get(`${API_BASE_URL}/summary`);
export const fetchCategories = () => axios.get(`${API_BASE_URL}/categories`);
export const fetchStats = () => axios.get(`${API_BASE_URL}/stats`);
