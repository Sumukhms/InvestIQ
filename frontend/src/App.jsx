import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import all the pages and components needed for routing
import MainApp from './MainApp';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LandingSignUpPage from './pages/LandingSignUpPage';

// Note: These auth pages are likely in a subfolder.
// Ensure this path matches your file structure.
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';


export default function App() {
    // This useEffect handles setting the dark mode class for the entire app.
    // It's good practice to keep this at the top level.
    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

    return (
        // The AuthProvider wraps the entire app, making authentication
        // state available to all components.
        <AuthProvider>
            {/* The Router provides the routing functionality. */}
            <Router>
                {/* The Routes component is where you define all possible routes. */}
                <Routes>
                    {/* Publicly accessible routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/promo-signup" element={<LandingSignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/* All authenticated routes (like /dashboard, /features)
                      are now handled inside the MainApp component.
                      The "/*" is a wildcard that matches any path not already
                      defined above. This acts as a gateway to your protected area.
                    */}
                    <Route path="/*" element={<MainApp />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
