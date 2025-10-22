import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

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

function App() {
  const [profileData, setProfileData] = useState(null);
  const [theme, setTheme] = useState('dark'); // Default theme
  const [isLoading, setIsLoading] = useState(true);

  // --- GLOBAL THEME LOGIC ---
  useEffect(() => {
    // This effect applies the theme to the entire document
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // --- FETCH USER PROFILE & SETTINGS ON APP LOAD ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('http://localhost:5000/api/auth/profile', config);
          setProfileData(res.data);
          // Set the theme based on the user's saved settings
          if (res.data.settings && res.data.settings.theme) {
            setTheme(res.data.settings.theme);
          }
        } catch (error) {
          console.error("Could not fetch profile on app load:", error);
          localStorage.removeItem('token'); // Invalid token, log user out
        }
      }
      setIsLoading(false);
    };
    fetchProfile();
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
      <Navbar profileData={profileData} setProfileData={setProfileData} />
      <main className="pt-20"> {/* Add padding to offset fixed navbar */}
        <Routes>
          <Route path="/login" element={<LoginPage setProfileData={setProfileData} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage setProfileData={setProfileData} />} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* Protected Routes */}
          <Route path="/" element={profileData ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={profileData ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/scorecard" element={profileData ? <ScorecardInput /> : <Navigate to="/login" />} />
          <Route path="/results" element={profileData ? <ScorecardResultPage /> : <Navigate to="/login" />} />
          <Route path="/financials" element={profileData ? <FinancialsPage /> : <Navigate to="/login" />} />
          <Route path="/growth" element={profileData ? <GrowthSuggestions /> : <Navigate to="/login" />} />
          <Route path="/news" element={profileData ? <AlertsFeedPage /> : <Navigate to="/login" />} />
          <Route path="/competitors" element={profileData ? <CompetitorSetupPage /> : <Navigate to="/login" />} />
          
          <Route 
            path="/profile" 
            element={profileData ? <ProfilePage profileData={profileData} setProfileData={setProfileData} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={profileData ? <SettingsPage currentTheme={theme} setTheme={setTheme} /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

