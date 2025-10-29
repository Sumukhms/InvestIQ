import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

// ✅ FIXED: Added .jsx extensions to imports
import Navbar from './components/Navbar.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import ScorecardInput from './components/ScorecardInput.jsx';
import ScorecardResultPage from './components/ScorecardResultPage.jsx';
import FinancialsPage from './components/FinancialsPage.jsx';
import GrowthSuggestions from './components/GrowthSuggestions.jsx';
import AlertsFeedPage from './components/AlertsFeedPage.jsx';
import CompetitorSetupPage from './components/CompetitorSetupPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import ForgotPasswordPage from './components/ForgotPasswordPage.jsx';
import ResetPasswordPage from './components/ResetPasswordPage.jsx';
import VerifyEmailPage from './components/VerifyEmailPage.jsx';
import AuthSuccessPage from './components/AuthSuccessPage.jsx';
import PrivacyPolicyPage from './components/PrivacyPolicyPage.jsx';
import TermsOfServicePage from './components/TermsOfServicePage.jsx';
import { applyTheme } from './utils/theme.js'; // Keep .js for utils
import Chatbot from './components/Chatbot.jsx';

function App() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultPage, setDefaultPage] = useState('/dashboard');

  // --- COMBINED: FETCH USER PROFILE & APPLY THEME ON APP LOAD ---
  useEffect(() => {
    const fetchUserAndApplyTheme = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Use relative path for API proxy
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('/api/auth/profile', config);

          if (res.data) {
            setProfileData(res.data);
            const savedTheme = res.data.settings?.theme || 'dark';
            applyTheme(savedTheme);

            const savedPage = res.data.settings?.defaultLandingPage;
            if (savedPage) {
              setDefaultPage(savedPage);
            }
          }

        } catch (error) {
          console.error("Could not fetch profile on app load:", error);
          // Clear token if profile fetch fails (e.g., expired token)
          localStorage.removeItem('token');
          applyTheme('dark'); // Default theme if fetch fails
        }
      } else {
          applyTheme('dark'); // Default theme if no token
      }
      setIsLoading(false);
    };

    fetchUserAndApplyTheme();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* Conditionally render Navbar only when logged in */}
      {profileData && <Navbar profileData={profileData} setProfileData={setProfileData} />}

      {/* Apply padding-top only when Navbar is present to account for fixed navbar */}
      <main className={profileData ? "pt-16" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage setProfileData={setProfileData} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage setProfileData={setProfileData} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* Protected Routes Wrapper */}
          <Route
            path="/"
            element={profileData ? <Navigate to={defaultPage} /> : <Navigate to="/login" />}
          />

          {/* --- Protected Routes --- */}
          {/* Wrap protected routes to ensure profileData check */}
          {profileData ? (
             <>
               <Route path="/dashboard" element={<DashboardPage />} />
               <Route path="/scorecard" element={<ScorecardInput />} />
               {/* Route definition remains correct */}
               <Route path="/scorecard-result/:id" element={<ScorecardResultPage />} />
               <Route path="/financials" element={<FinancialsPage />} />
               <Route path="/growth-suggestions" element={<GrowthSuggestions />} />
               <Route path="/alerts-feed" element={<AlertsFeedPage />} />
               <Route path="/competitor-setup" element={<CompetitorSetupPage />} />
               <Route
                 path="/profile"
                 element={<ProfilePage profileData={profileData} setProfileData={setProfileData} />}
               />
               <Route path="/settings" element={<SettingsPage />} />
             </>
          ) : (
             // If not logged in, any attempt to access protected routes redirects to login
             <Route path="*" element={<Navigate to="/login" />} />
          )}

          {/* Fallback for any other undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Conditionally render Chatbot only when logged in */}
      {profileData && <Chatbot />}
    </Router>
  );
}

export default App;

