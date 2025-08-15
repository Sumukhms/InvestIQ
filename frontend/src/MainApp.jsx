import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';

// Your page components
import DashboardPage from './pages/DashboardPage';
import NewAnalysisPage from './pages/NewAnalysisPage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';

const MainApp = () => {
    const { isLoggedIn, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-800 flex flex-col">
            <Header /> 
            
            <main className="flex-grow">
                <div key={location.pathname} className="animate-fade-in">
                    <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/new-analysis" element={<NewAnalysisPage />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        
                        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainApp;
