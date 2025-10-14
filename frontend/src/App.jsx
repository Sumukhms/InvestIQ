import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Import Pages and Components
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import DashboardPage from './components/DashboardPage';
import ScorecardInput from './components/ScorecardInput';
import GrowthSuggestions from './components/GrowthSuggestions';
import Navbar from './components/Navbar'; // Import the Navbar

// This is a helper component to wrap the main layout and conditionally show the Navbar
const AppLayout = () => {
    const location = useLocation();
    // Routes where the Navbar should NOT be displayed
    const noNavbarRoutes = ['/', '/signup', '/forgot-password'];

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

                {/* App Routes with Navbar */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scorecard" element={<ScorecardInput />} />
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