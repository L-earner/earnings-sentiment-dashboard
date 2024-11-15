import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchCompanies = async (searchTerm, direction) => {
  console.log('Searching for term:', searchTerm, 'direction:', direction);
  try {
    let url = `/companies/search`;
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('term', searchTerm);
    }
    if (direction) {
      params.append('direction', direction);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    console.log('Making API request to:', url);
    const response = await api.get(url);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
