// frontend/src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ScorecardInput from "./components/ScorecardInput.jsx";
import GrowthSuggestions from "./components/GrowthSuggestions.jsx";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("scorecard");

  const tabStyles =
    "px-6 py-2 rounded-t-lg text-lg font-medium transition-colors";
  const activeStyles = "bg-gray-800 text-blue-400";
  const inactiveStyles = "bg-gray-700 text-gray-400 hover:bg-gray-600";

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <header className="pt-8 px-8 max-w-6xl mx-auto">
        <nav className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("scorecard")}
            className={`${tabStyles} ${
              activeTab === "scorecard" ? activeStyles : inactiveStyles
            }`}
          >
            Instant Scorecard
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`${tabStyles} ${
              activeTab === "suggestions" ? activeStyles : inactiveStyles
            }`}
          >
            Growth Suggestions
          </button>
        </nav>
      </header>
      <main>
        {activeTab === "scorecard" && <ScorecardInput />}
        {activeTab === "suggestions" && <GrowthSuggestions />}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardContent />} />
      </Routes>
    </Router>
  );
}

export default App;
