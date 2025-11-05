import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

// ✅ Fixed Imports
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
import Chatbot from './components/Chatbot.jsx';
import FundingEnvironmentPage from './components/FundingEnvironmentPage.jsx';

import { applyTheme } from './utils/theme.js';

// ✅ Optional: ProtectedRoute Wrapper
const ProtectedRoute = ({ profileData, children }) => {
  if (!profileData) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultPage, setDefaultPage] = useState('/dashboard');

  // --- FETCH USER PROFILE & APPLY THEME ON APP LOAD ---
  useEffect(() => {
    const fetchUserAndApplyTheme = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('/api/auth/profile', config);

          // ✅ --- THIS IS THE DEBUGGING LINE ---
          console.log("App.jsx: Profile data received from /api/auth/profile:", res.data);
          // ------------------------------------

          if (res.data) {
            setProfileData(res.data);
            const savedTheme = res.data.settings?.theme || 'dark';
            applyTheme(savedTheme);

            const savedPage = res.data.settings?.defaultLandingPage;
            if (savedPage) setDefaultPage(savedPage);
          }
        } catch (error) {
          console.error('Could not fetch profile on app load:', error);
          localStorage.removeItem('token');
          applyTheme('dark');
        }
      } else {
        applyTheme('dark');
      }
      setIsLoading(false);
    };

    fetchUserAndApplyTheme();
  }, []);

  // --- Loading Spinner ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* ✅ Navbar appears only when logged in */}
      {profileData && (
        <Navbar profileData={profileData} setProfileData={setProfileData} />
      )}

      <main className={profileData ? 'pt-16' : ''}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/login" element={<LoginPage setProfileData={setProfileData} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage setProfileData={setProfileData} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* --- Default Root Redirect (No Infinite Loop) --- */}
          <Route
            path="/"
            element={
              profileData ? (
                <Navigate to={defaultPage} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* --- Protected Routes --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute profileData={profileData}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scorecard"
            element={
              <ProtectedRoute profileData={profileData}>
                <ScorecardInput />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scorecard-result/:id"
            element={
              <ProtectedRoute profileData={profileData}>
                <ScorecardResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financials"
            element={
              <ProtectedRoute profileData={profileData}>
                <FinancialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/growth-suggestions"
            element={
              <ProtectedRoute profileData={profileData}>
                <GrowthSuggestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts-feed"
            element={
              <ProtectedRoute profileData={profileData}>
                <AlertsFeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/competitor-setup"
            element={
              <ProtectedRoute profileData={profileData}>
                <CompetitorSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute profileData={profileData}>
                <ProfilePage profileData={profileData} setProfileData={setProfileData} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute profileData={profileData}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funding-environment"
            element={
              <ProtectedRoute profileData={profileData}>
                <FundingEnvironmentPage />
              </ProtectedRoute>
            }
          />


          {/* --- Fallback for Undefined Routes --- */}
          <Route
            path="*"
            element={
              <Navigate to={profileData ? '/dashboard' : '/login'} replace />
            }
          />
        </Routes>
        
      </main>

      {/* ✅ Chatbot only when logged in */}
      {profileData && <Chatbot />}
      </div>
    </Router>
  );
}

export default App;
