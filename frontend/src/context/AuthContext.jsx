import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                const res = await api.get('/auth/user');
                setUser(res.data);
            } catch (err) {
                // If token is invalid, remove it
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const register = async (formData) => {
        const res = await api.post('/auth/register', formData);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        await loadUser(); // Load user data after registration
    };

    const login = async (formData) => {
        const res = await api.post('/auth/login', formData);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        await loadUser(); // Load user data after login
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        isLoading,
        isLoggedIn: !!user, // isLoggedIn is true if user object exists
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
