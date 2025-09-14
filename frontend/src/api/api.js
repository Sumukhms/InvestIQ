import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => Promise.reject(error));


export const createAnalysis = async (analysisData) => {
    const response = await api.post('/analysis', analysisData);
    return response.data;
};

export const findCompetitors = async (industry, location) => {
    const response = await api.get('/analysis/competitors', { params: { industry, location } });
    return response.data;
};

export const getAnalyses = async () => {
    const response = await api.get('/analysis');
    return response.data;
};

export const getAnalysisById = async (id) => {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
};

// Other functions...
export const loginUser = async (credentials) => await api.post('/auth/login', credentials);
export const registerUser = async (userData) => await api.post('/auth/register', userData);

export default api;