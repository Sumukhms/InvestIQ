// This component holds the view for an authenticated user.
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import NewAnalysisPage from './pages/NewAnalysisPage';
import PageLoader from './components/PageLoader';
import { fetchUserData } from './api/mockApi';

const MainApp = ({ onLogout }) => {
    const [userData, setUserData] = useState(null);
    const [activePage, setActivePage] = useState('dashboard');

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchUserData();
            setUserData(data);
        };
        loadData();
    }, []);

    if (!userData) {
        return <PageLoader />;
    }

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardPage userData={userData} />;
            case 'features':
                return <FeaturesPage />;
            case 'new-analysis':
                return <NewAnalysisPage />;
            default:
                return <DashboardPage userData={userData} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 font-inter text-gray-200 flex flex-col">
            <Header user={userData} onNavClick={setActivePage} activePage={activePage} onLogout={onLogout} />
            <div className="flex-grow">
                {renderPage()}
            </div>
            <Footer />
        </div>
    );
};

export default MainApp;