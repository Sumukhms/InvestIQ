import React from 'react';
// Import useLocation to detect route changes for animations
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';

// Your page components
import DashboardPage from './pages/DashboardPage';
import NewAnalysisPage from './pages/NewAnalysisPage';
import FeaturesPage from './pages/FeaturesPage';

const MainApp = () => {
    // Get auth state and loading status from our custom hook
    const { isLoggedIn, isLoading } = useAuth();
    
    // Get the current location object. We'll use its pathname as a key
    // to trigger re-animation whenever the URL changes.
    const location = useLocation();

    // While the context is checking the auth status on initial load,
    // it's best practice to show a full-page loader.
    if (isLoading) {
        return <PageLoader />;
    }

    // This is our protection layer. If the context confirms the user
    // is not logged in, we redirect them to the login page immediately.
    // The 'replace' prop prevents the user from hitting the back button
    // and returning to a broken authenticated state.
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If the user IS logged in, we render the main application layout.
    return (
        <div className="min-h-screen bg-gray-900 font-inter text-gray-200 flex flex-col">
            {/* The Header component can now get all the data it needs (user, logout) from the useAuth() hook directly. */}
            <Header /> 
            
            <main className="flex-grow">
                {/* This is the container for our animated page transitions.
                  By setting the `key` to the current URL's pathname, we tell React
                  to treat the content as a "new" component whenever the path changes.
                  This forces it to re-mount and re-trigger our 'animate-fade-in' animation.
                */}
                <div key={location.pathname} className="animate-fade-in">
                    {/* Nested routes for the authenticated section of the app */}
                    <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/new-analysis" element={<NewAnalysisPage />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        
                        {/* Any other authenticated routes would go here */}

                        {/* This is a catch-all route. If a logged-in user tries to visit
                          any URL that doesn't match the ones above (e.g., '/home'),
                          they will be automatically redirected to their dashboard.
                        */}
                        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainApp;