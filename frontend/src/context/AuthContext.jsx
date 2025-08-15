import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchUserData } from '../api/mockApi'; // Your function to get user data

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect syncs the login state to localStorage
        localStorage.setItem('isLoggedIn', isLoggedIn);

        // When the user logs in, fetch their data
        if (isLoggedIn && !user) {
            setIsLoading(true);
            fetchUserData()
                .then(data => {
                    setUser(data);
                })
                .catch(error => {
                    console.error("Failed to fetch user data", error);
                    // If fetching fails, log the user out
                    setIsLoggedIn(false); 
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (!isLoggedIn) {
            setUser(null);
            setIsLoading(false);
        }
    }, [isLoggedIn, user]);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    // The value provided to all consuming components
    const value = { isLoggedIn, user, isLoading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to easily use the context in other components
export const useAuth = () => {
    return useContext(AuthContext);
};