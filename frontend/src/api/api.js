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

export default api;
