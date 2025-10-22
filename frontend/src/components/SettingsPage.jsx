// frontend/src/components/SettingsPage.jsx
// Comprehensive settings with theme, privacy, notifications, and security

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { applyTheme } from '../utils/theme';

const SettingsPage = () => {
  const navigate = useNavigate();
  // General Preferences
  const [theme, setTheme] = useState('dark');
  const [defaultLandingPage, setDefaultLandingPage] = useState('/dashboard');
  const [language, setLanguage] = useState('en');

  // Notifications
  const [emailNewsAlerts, setEmailNewsAlerts] = useState(true);
  const [emailProductUpdates, setEmailProductUpdates] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);

  // Integrations
  const [newsApiKey, setNewsApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true); // Use ref to prevent first-load save trigger

  // --- Auto-save logic ---
  useEffect(() => {
    // Don't save on the initial load
    if (isInitialLoad.current) {
      return;
    }

    // Set up a timer to save settings after user stops making changes
    const handler = setTimeout(() => {
      saveSettings();
    }, 1000); // Wait 1 second after the last change

    // Cleanup function: if another change happens, clear the previous timer
    return () => {
      clearTimeout(handler);
    };
  }, [theme, defaultLandingPage, language, emailNewsAlerts, emailProductUpdates, inAppNotifications, twoFactorEnabled, newsApiKey, geminiApiKey]);

  
  // --- Theme application logic ---
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);


  // Load settings on component mount
  useEffect(() => {
    loadSettings();
    loadMockLoginHistory();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/settings', config);
      const settings = res.data;
      
      setTheme(settings.theme || 'dark');
      setDefaultLandingPage(settings.defaultLandingPage || '/dashboard');
      setLanguage(settings.language || 'en');
      setEmailNewsAlerts(settings.emailNewsAlerts !== false);
      setEmailProductUpdates(settings.emailProductUpdates !== false);
      setInAppNotifications(settings.inAppNotifications !== false);
      setTwoFactorEnabled(settings.twoFactorEnabled || false);
      setNewsApiKey(settings.newsApiKey || '');
      setGeminiApiKey(settings.geminiApiKey || '');

    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
      // Mark initial load as complete AFTER first render cycle
      setTimeout(() => isInitialLoad.current = false, 0);
    }
  };

  const loadMockLoginHistory = () => {
    const mockHistory = [
      { id: 1, date: new Date().toISOString(), location: 'Bengaluru, India', ip: '103.xxx.xxx.xxx', device: 'Chrome on Windows' },
      { id: 2, date: new Date(Date.now() - 86400000).toISOString(), location: 'Bengaluru, India', ip: '103.xxx.xxx.xxx', device: 'Mobile Safari' },
      { id: 3, date: new Date(Date.now() - 172800000).toISOString(), location: 'Mumbai, India', ip: '49.xxx.xxx.xxx', device: 'Chrome on Mac' },
    ];
    setLoginHistory(mockHistory);
  };

  const saveSettings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Auto-save failed: Not logged in.');
      return;
    }

    const settings = {
      theme,
      defaultLandingPage,
      language,
      emailNewsAlerts,
      emailProductUpdates,
      inAppNotifications,
      twoFactorEnabled,
      newsApiKey,
      geminiApiKey,
    };

    try {
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      await axios.put('http://localhost:5000/api/settings', settings, config);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      console.error('Failed to auto-save settings:', err);
    }
  };

  const handleClearScorecardHistory = () => {
    if (window.confirm('Are you sure you want to clear all scorecard history? This action cannot be undone.')) {
      // In a real app, this should be a DELETE request to a backend endpoint.
      // For now, it only clears client-side mock data if any exists.
      console.warn("Clearing scorecard history is a client-side action in this demo.");
    }
  };

  const handleExportScorecardHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/scorecard/history', config);
        const history = res.data;
        
        if (!history || history.length === 0) {
            alert('No scorecard history to export.');
            return;
        }

        const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scorecard-history-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Failed to export history", err);
        alert("Could not export scorecard history.");
    }
  };


  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your competitor watchlist?')) {
      // Should be a backend endpoint
      console.warn("Clearing watchlist is a client-side action in this demo.");
    }
  };

  const handleExportWatchlist = () => {
    // Should fetch from a backend endpoint
    alert('Export watchlist is not implemented yet.');
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL your client-side data. This action cannot be undone. Are you absolutely sure?')) {
      localStorage.clear();
      alert('All client-side data cleared successfully! The page will refresh.');
      window.location.reload();
    }
  };

  const handleEnable2FA = () => {
    const new2FAState = !twoFactorEnabled;
    if (!new2FAState) {
      if (window.confirm('Are you sure you want to disable Two-Factor Authentication?')) {
        setTwoFactorEnabled(false);
      }
    } else {
      alert('🔐 2FA Setup:\n\n1. Download an authenticator app (e.g., Google Authenticator)\n2. Scan the QR code (this is a demo)\n3. Enter verification code\n\nFor this demo, 2FA is now enabled.');
      setTwoFactorEnabled(true);
    }
  };

  const tabs = [
    { id: 'general', label: '⚙️ General' },
    { id: 'account', label: '👤 Account' },
    { id: 'data', label: '🗄️ Data & Privacy' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'security', label: '🔒 Security' },
    { id: 'integrations', label: '🔗 Integrations' },
  ];

  const inputStyles = "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const buttonStyles = "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors";
  const dangerButtonStyles = "px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Settings
          </h1>
          <p className="text-gray-400">Manage your preferences and account settings</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg flex items-center gap-3 animate-fade-in">
            <span className="text-green-400 text-xl">✓</span>
            <span className="text-green-400 font-medium">Settings auto-saved!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sticky top-8">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{tab.label.split(' ')[0]}</span>
                    <span className="font-medium">{tab.label.split(' ')[1]}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">⚙️ General Preferences</h2>
                    <p className="text-gray-400 mb-6">Customize your application experience</p>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <label className="block text-sm font-medium text-gray-300 mb-3">🎨 Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setTheme('dark')} className={`p-4 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-gray-900' : 'border-gray-600 bg-gray-800'}`}>
                        <div className="text-3xl mb-2">🌙</div>
                        <div className="font-medium text-white">Dark Mode</div>
                      </button>
                      <button onClick={() => setTheme('light')} className={`p-4 rounded-lg border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-white text-gray-900' : 'border-gray-600 bg-gray-800'}`}>
                        <div className="text-3xl mb-2">☀️</div>
                        <div className="font-medium">Light Mode</div>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <label className="block text-sm font-medium text-gray-300 mb-3">🏠 Default Landing Page</label>
                    <select value={defaultLandingPage} onChange={(e) => setDefaultLandingPage(e.target.value)} className={inputStyles}>
                      <option value="/dashboard">Dashboard</option>
                      <option value="/scorecard">Scorecard Input</option>
                      <option value="/news">News Feed</option>
                    </select>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <label className="block text-sm font-medium text-gray-300 mb-3">🌍 Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputStyles}>
                      <option value="en">English</option>
                      <option value="es" disabled>Español (coming soon)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">👤 Account Settings</h2>
                    <p className="text-gray-400 mb-6">Manage your core account and profile information.</p>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                    <p className="text-gray-400 mb-4">Your name, role, company, and bio are managed on your dedicated Profile page.</p>
                    <button onClick={() => navigate('/profile')} className={buttonStyles}>Go to Profile Page</button>
                  </div>
                  <div className="bg-red-900/20 p-6 rounded-lg border border-red-600">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">⚠️ Danger Zone</h3>
                    <p className="text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className={dangerButtonStyles} disabled>Delete Account (Not Implemented)</button>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-6">
                   <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🗄️ Data & Privacy</h2>
                    <p className="text-gray-400 mb-6">Manage your application data.</p>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">📊 Scorecard History</h3>
                    <p className="text-gray-400 mb-4">Export or clear your saved startup scorecards.</p>
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={handleExportScorecardHistory} className={buttonStyles}>📄 Export History</button>
                      <button onClick={handleClearScorecardHistory} className={dangerButtonStyles}>🗑️ Clear History</button>
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">👀 Competitor Watchlist</h3>
                    <p className="text-gray-400 mb-4">Export or clear your tracked competitors.</p>
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={handleExportWatchlist} className={buttonStyles}>📄 Export Watchlist</button>
                      <button onClick={handleClearWatchlist} className={dangerButtonStyles}>🗑️ Clear Watchlist</button>
                    </div>
                  </div>
                  <div className="bg-red-900/20 p-6 rounded-lg border border-red-600">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">⚠️ Nuclear Option</h3>
                    <p className="text-gray-400 mb-4">Clear ALL data from your browser's local storage.</p>
                    <button onClick={handleClearAllData} className={dangerButtonStyles}>💣 Clear All Data</button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                 <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🔔 Notifications</h2>
                    <p className="text-gray-400 mb-6">Choose what updates you want to receive.</p>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">📧 Email Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={emailNewsAlerts} onChange={(e) => setEmailNewsAlerts(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <div>
                          <div className="text-gray-300 font-medium">News Alerts</div>
                          <div className="text-sm text-gray-500">Receive email alerts for news about your watched competitors.</div>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={emailProductUpdates} onChange={(e) => setEmailProductUpdates(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <div>
                          <div className="text-gray-300 font-medium">Product Updates</div>
                          <div className="text-sm text-gray-500">Get notified about new features and improvements.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                   <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">🔔 In-App Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={inAppNotifications} onChange={(e) => setInAppNotifications(e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
                        <div>
                          <div className="text-gray-300 font-medium">Enable In-App Notifications</div>
                          <div className="text-sm text-gray-500">Show notification badges and alerts within the app.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🔒 Security</h2>
                    <p className="text-gray-400 mb-6">Keep your account safe and secure.</p>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">🔐 Two-Factor Authentication</h3>
                        <p className="text-gray-400 mt-2">Add an extra layer of security to your account.</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${twoFactorEnabled ? 'bg-green-900/50 text-green-400 border border-green-600' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <button onClick={handleEnable2FA} className={twoFactorEnabled ? dangerButtonStyles : buttonStyles}>
                      {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">📜 Login History</h3>
                        <p className="text-gray-400 mt-2">Monitor recent account activity.</p>
                      </div>
                      <button onClick={() => setShowLoginHistory(!showLoginHistory)} className={buttonStyles}>
                        {showLoginHistory ? 'Hide' : 'View'} History
                      </button>
                    </div>
                    {showLoginHistory && (
                      <div className="mt-4 space-y-3">
                        {loginHistory.map(login => (
                          <div key={login.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                             <div className="font-medium text-white">{login.device}</div>
                             <div className="text-sm text-gray-400">{new Date(login.date).toLocaleString()}</div>
                             <div className="text-sm text-gray-500 mt-1">{login.location} • IP: {login.ip}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-6">
                   <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🔗 Integrations</h2>
                    <p className="text-gray-400 mb-6">Connect external services and manage API keys.</p>
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                     <h3 className="text-lg font-semibold text-white">📰 NewsAPI</h3>
                     <p className="text-gray-400 text-sm mt-1 mb-4">Connect your NewsAPI key for personalized news feeds.</p>
                     <label className="block text-sm text-gray-400 mb-2">API Key</label>
                     <input type="password" value={newsApiKey} onChange={(e) => setNewsApiKey(e.target.value)} placeholder="Enter your NewsAPI key" className={inputStyles} />
                  </div>
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                     <h3 className="text-lg font-semibold text-white">🤖 Google Gemini API</h3>
                     <p className="text-gray-400 text-sm mt-1 mb-4">Use your own Gemini API key for the AI growth advisor.</p>
                     <label className="block text-sm text-gray-400 mb-2">API Key</label>
                     <input type="password" value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} placeholder="Enter your Gemini API key" className={inputStyles} />
                  </div>
                </div>
              )}

              {/* REMOVED THE SAVE BUTTON WRAPPER */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

