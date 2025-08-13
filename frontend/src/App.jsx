// This is the main entry point. It controls authentication state.
import React, { useState, useEffect } from 'react';
import MainApp from './MainApp';
import LandingPage from './pages/LandingPage';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // This useEffect handles the dark mode class for the entire app
    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);


    const handleLogin = () => {
        // In a real app, this would involve a call to an auth service
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            {isLoggedIn ? <MainApp onLogout={handleLogout} /> : <LandingPage onLogin={handleLogin} />}
        </>
    );
}
