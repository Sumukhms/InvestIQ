import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

// Corrected import paths to be relative and REMOVED file extensions
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import DashboardPage from './components/DashboardPage';
import ScorecardInput from './components/ScorecardInput';
import ScorecardResultPage from './components/ScorecardResultPage';
import FinancialsPage from './components/FinancialsPage';
import GrowthSuggestions from './components/GrowthSuggestions';
import AlertsFeedPage from './components/AlertsFeedPage';
import CompetitorSetupPage from './components/CompetitorSetupPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import AuthSuccessPage from './components/AuthSuccessPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import { applyTheme } from './utils/theme';
import Chatbot from './components/Chatbot';

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
          <Route path="/login" element={<LoginPage setProfileData={setProfileData} />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Note: /verify-email might need :token */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage setProfileData={setProfileData} />} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={profileData ? <Navigate to={defaultPage} /> : <Navigate to="/login" />} 
          />
          <Route path="/dashboard" element={profileData ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/scorecard" element={profileData ? <ScorecardInput /> : <Navigate to="/login" />} />
          {/* Added /results route from your previous file */}
          <Route path="/scorecard-result" element={profileData ? <ScorecardResultPage /> : <Navigate to="/login" />} />
          <Route path="/financials" element={profileData ? <FinancialsPage /> : <Navigate to="/login" />} />
          {/* Added /growth route from your previous file */}
          <Route path="/growth-suggestions" element={profileData ? <GrowthSuggestions /> : <Navigate to="/login" />} />
          {/* Added /news route from your previous file */}
          <Route path="/alerts-feed" element={profileData ? <AlertsFeedPage /> : <Navigate to="/login" />} />
          {/* Added /competitors route from your previous file */}
          <Route path="/competitor-setup" element={profileData ? <CompetitorSetupPage /> : <Navigate to="/login" />} />
          
          <Route 
            path="/profile" 
            element={profileData ? <ProfilePage profileData={profileData} setProfileData={setProfileData} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={profileData ? <SettingsPage /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Conditionally render Chatbot only when logged in */}
      {profileData && <Chatbot />}
    </Router>
  );
}

export default App;

