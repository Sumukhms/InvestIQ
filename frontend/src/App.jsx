// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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
// REMOVED: No longer need to import ArticleDetailPage
import CompetitorSetupPage from './components/CompetitorSetupPage';
import Navbar from './components/Navbar'; 
import AuthSuccessPage from './components/AuthSuccessPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
// --- IMPORT THE NEW PAGE ---
import ResetPasswordPage from './components/ResetPasswordPage';
import ProfilePage from './components/ProfilePage';
const AppLayout = () => {
    const location = useLocation();
    const noNavbarRoutes = ['/', '/signup', '/forgot-password', '/privacy-policy', '/terms-of-service'];
    const showNavbar = !noNavbarRoutes.includes(location.pathname);

    return (
        <div className="bg-gray-900 min-h-screen">
            {showNavbar && <Navbar />}
            <Routes>
                {/* Auth and Policy Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/success" element={<AuthSuccessPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                {/* Policy Routes (no Navbar) */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                
                {/* App Routes with Navbar */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scorecard" element={<ScorecardInput />} />
                <Route path="/results" element={<ScorecardResultPage />} />
                <Route path="/financials" element={<FinancialsPage />} />
                <Route path="/alerts" element={<AlertsFeedPage />} />
                {/* REMOVED: No longer need the /article/:articleId route */}
                <Route path="/competitors" element={<CompetitorSetupPage />} />
                <Route path="/growth-suggestions" element={<GrowthSuggestions />} />
                <Route path="/profile" element={<ProfilePage/>} />
                <Route path="/settings" element={<div>Settings Page</div>} />
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