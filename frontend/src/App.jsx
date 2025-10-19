import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';

// Import Pages and Components
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import DashboardPage from './components/DashboardPage';
import ScorecardInput from './components/ScorecardInput';
import ScorecardResultPage from './components/ScorecardResultPage';
import GrowthSuggestions from './components/GrowthSuggestions';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import FinancialsPage from './components/FinancialsPage';
import AlertsFeedPage from './components/AlertsFeedPage';
import CompetitorSetupPage from './components/CompetitorSetupPage';
import Navbar from './components/Navbar';
import AuthSuccessPage from './components/AuthSuccessPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';

const AppLayout = () => {
    const location = useLocation();
    const [profileData, setProfileData] = useState(null); // Central state for profile data

    // This function fetches the profile data from the backend
    const fetchProfileData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:5000/api/auth/profile', config);
                setProfileData(res.data);
            } catch (error) {
                console.error("Token is invalid or expired. Logging out.");
                localStorage.removeItem('token');
                setProfileData(null);
            }
        } else {
            setProfileData(null); // Ensure profile is null if no token
        }
    };

    // Fetch profile data when the app loads or when the user navigates to a new page
    useEffect(() => {
        fetchProfileData();
    }, [location.pathname]);

    const noNavbarRoutes = ['/', '/signup', '/forgot-password', '/privacy-policy', '/terms-of-service'];
    const showNavbar = !noNavbarRoutes.includes(location.pathname);

    return (
        <div className="bg-gray-900 min-h-screen">
            {showNavbar && <Navbar profileData={profileData} />} {/* Pass profile data to Navbar */}
            <Routes>
                {/* Auth and Policy Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/success" element={<AuthSuccessPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                
                {/* App Routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scorecard" element={<ScorecardInput />} />
                <Route path="/results" element={<ScorecardResultPage />} />
                <Route path="/financials" element={<FinancialsPage />} />
                <Route path="/alerts" element={<AlertsFeedPage />} />
                <Route path="/competitors" element={<CompetitorSetupPage />} />
                <Route path="/growth-suggestions" element={<GrowthSuggestions />} />
                
                {/* Pass the fetch function to ProfilePage so it can trigger a refresh */}
                <Route path="/profile" element={<ProfilePage onProfileUpdate={fetchProfileData} />} />
                
                <Route path="/settings" element={<SettingsPage/>} />
            </Routes>
        </div>
    );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
