import axios from 'axios';

// Create an instance of axios for your API
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend server URL
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
  NOTE: interceptors are a powerful feature of axios.
  This one checks if a token exists in localStorage, and if so,
  it adds it to the headers of every outgoing request.
  This is how your backend will know who is making the request.
*/
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// frontend/src/api/api.js
// (add this function to the existing file)

export const analyzeFinancials = async (data) => {
    try {
        const response = await api.post('/api/financials/analyze', data);
        return response.data;
    } catch (error) {
        console.error('Error analyzing financials:', error);
        throw error;
    }
};

export default api;
