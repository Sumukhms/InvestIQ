import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Import Pages and Components
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import DashboardPage from './components/DashboardPage';
import ScorecardInput from './components/ScorecardInput';
import GrowthSuggestions from './components/GrowthSuggestions';
import PrivacyPolicyPage from './components/PrivacyPolicyPage'; // <-- NEW
import TermsOfServicePage from './components/TermsOfServicePage';   // <-- NEW
import FinancialsPage from './components/FinancialsPage';
import AlertsFeedPage from './components/AlertsFeedPage';
import CompetitorSetupPage from './components/CompetitorSetupPage';
import Navbar from './components/Navbar'; 
import AuthSuccessPage from './components/AuthSuccessPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
// --- IMPORT THE NEW PAGE ---
import ResetPasswordPage from './components/ResetPasswordPage';

// This is a helper component to wrap the main layout and conditionally show the Navbar
const AppLayout = () => {
    const location = useLocation();
    // Routes where the Navbar should NOT be displayed
    // Added policy pages to noNavbarRoutes
    const noNavbarRoutes = ['/', '/signup', '/forgot-password', '/privacy-policy', '/terms-of-service'];

    // Check if the current path is one of the no-navbar routes
    const showNavbar = !noNavbarRoutes.includes(location.pathname);

    return (
        <div className="bg-gray-900 min-h-screen">
            {showNavbar && <Navbar />}
            <Routes>
                {/* Auth Routes (no Navbar) */}
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
                <Route path="/financials" element={<FinancialsPage />} />
                <Route path="/alerts" element={<AlertsFeedPage />} />
                <Route path="/competitors" element={<CompetitorSetupPage />} />
                <Route path="/growth-suggestions" element={<GrowthSuggestions />} />
                <Route path="/profile" element={<div>Profile Page</div>} />
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