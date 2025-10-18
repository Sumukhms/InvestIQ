// frontend/src/components/SettingsPage.jsx
// Comprehensive settings with theme, privacy, notifications, and security

import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
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

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    loadMockLoginHistory();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTheme(settings.theme || 'dark');
      setDefaultLandingPage(settings.defaultLandingPage || '/dashboard');
      setLanguage(settings.language || 'en');
      setEmailNewsAlerts(settings.emailNewsAlerts !== false);
      setEmailProductUpdates(settings.emailProductUpdates !== false);
      setInAppNotifications(settings.inAppNotifications !== false);
      setTwoFactorEnabled(settings.twoFactorEnabled || false);
      setNewsApiKey(settings.newsApiKey || '');
      setGeminiApiKey(settings.geminiApiKey || '');
    }
  };

  const loadMockLoginHistory = () => {
    // Mock data - replace with actual API call
    const mockHistory = [
      { id: 1, date: new Date().toISOString(), location: 'Bengaluru, India', ip: '103.xxx.xxx.xxx', device: 'Chrome on Windows' },
      { id: 2, date: new Date(Date.now() - 86400000).toISOString(), location: 'Bengaluru, India', ip: '103.xxx.xxx.xxx', device: 'Mobile Safari' },
      { id: 3, date: new Date(Date.now() - 172800000).toISOString(), location: 'Mumbai, India', ip: '49.xxx.xxx.xxx', device: 'Chrome on Mac' },
    ];
    setLoginHistory(mockHistory);
  };

  const saveSettings = () => {
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
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Apply theme
    applyTheme(theme);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const handleClearScorecardHistory = () => {
    if (confirm('Are you sure you want to clear all scorecard history? This action cannot be undone.')) {
      localStorage.removeItem('scorecardHistory');
      alert('Scorecard history cleared successfully!');
    }
  };

  const handleExportScorecardHistory = () => {
    const history = localStorage.getItem('scorecardHistory');
    if (!history) {
      alert('No scorecard history to export.');
      return;
    }

    const blob = new Blob([history], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scorecard-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearWatchlist = () => {
    if (confirm('Are you sure you want to clear your competitor watchlist?')) {
      localStorage.removeItem('competitorWatchlist');
      alert('Watchlist cleared successfully!');
    }
  };

  const handleExportWatchlist = () => {
    const watchlist = localStorage.getItem('competitorWatchlist');
    if (!watchlist) {
      alert('No watchlist to export.');
      return;
    }

    const blob = new Blob([watchlist], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitor-watchlist-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearFinancialReports = () => {
    if (confirm('Are you sure you want to clear all saved financial reports?')) {
      localStorage.removeItem('financialReports');
      alert('Financial reports cleared successfully!');
    }
  };

  const handleClearGrowthSuggestions = () => {
    if (confirm('Are you sure you want to clear all saved growth advice?')) {
      localStorage.removeItem('growthSuggestions');
      alert('Growth suggestions cleared successfully!');
    }
  };

  const handleClearAllData = () => {
    if (confirm('⚠️ WARNING: This will delete ALL your data including scorecards, watchlists, financial reports, and saved advice. This action cannot be undone. Are you absolutely sure?')) {
      localStorage.clear();
      alert('All data cleared successfully! The page will refresh.');
      window.location.reload();
    }
  };

  const handleEnable2FA = () => {
    if (twoFactorEnabled) {
      if (confirm('Are you sure you want to disable Two-Factor Authentication?')) {
        setTwoFactorEnabled(false);
      }
    } else {
      alert('🔐 2FA Setup:\n\n1. Download an authenticator app (Google Authenticator, Authy)\n2. Scan the QR code (mock - implement actual 2FA)\n3. Enter verification code\n\nFor this demo, 2FA is now enabled.');
      setTwoFactorEnabled(true);
    }
  };

  const tabs = [
    { id: 'general', label: '⚙️ General', icon: '⚙️' },
    { id: 'account', label: '👤 Account', icon: '👤' },
    { id: 'data', label: '🗄️ Data & Privacy', icon: '🗄️' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'integrations', label: '🔗 Integrations', icon: '🔗' },
  ];

  const inputStyles = "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const buttonStyles = "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors";
  const dangerButtonStyles = "px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Settings
          </h1>
          <p className="text-gray-400">Manage your preferences and account settings</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg flex items-center gap-3 animate-fade-in">
            <span className="text-green-400 text-xl">✓</span>
            <span className="text-green-400 font-medium">Settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
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
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label.replace(/^.+ /, '')}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              
              {/* General Preferences */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">⚙️ General Preferences</h2>
                    <p className="text-gray-400 mb-6">Customize your application experience</p>
                  </div>

                  {/* Theme */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🎨 Theme
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-gray-900'
                            : 'border-gray-600 bg-gray-800'
                        }`}
                      >
                        <div className="text-3xl mb-2">🌙</div>
                        <div className="font-medium text-white">Dark Mode</div>
                        <div className="text-xs text-gray-400 mt-1">Easy on the eyes</div>
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'light'
                            ? 'border-blue-500 bg-white text-gray-900'
                            : 'border-gray-600 bg-gray-800'
                        }`}
                      >
                        <div className="text-3xl mb-2">☀️</div>
                        <div className="font-medium">Light Mode</div>
                        <div className="text-xs text-gray-400 mt-1">Bright and clear</div>
                      </button>
                    </div>
                  </div>

                  {/* Default Landing Page */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🏠 Default Landing Page
                    </label>
                    <select
                      value={defaultLandingPage}
                      onChange={(e) => setDefaultLandingPage(e.target.value)}
                      className={inputStyles}
                    >
                      <option value="/dashboard">Dashboard</option>
                      <option value="/scorecard">Scorecard Input</option>
                      <option value="/news">News Feed</option>
                      <option value="/financials">Financial Health</option>
                      <option value="/growth">Growth Advisor</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Choose which page you see first after logging in
                    </p>
                  </div>

                  {/* Language */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🌍 Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={inputStyles}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="hi">हिन्दी</option>
                      <option value="zh">中文</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Application language (Coming soon)
                    </p>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">👤 Account Settings</h2>
                    <p className="text-gray-400 mb-6">Manage your account information</p>
                  </div>

                  {/* Profile Info */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Company</label>
                        <input
                          type="text"
                          placeholder="Startup Inc."
                          className={inputStyles}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                        <input
                          type="password"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">New Password</label>
                        <input
                          type="password"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className={inputStyles}
                        />
                      </div>
                      <button className={buttonStyles}>
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-900/20 p-6 rounded-lg border border-red-600">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">⚠️ Danger Zone</h3>
                    <p className="text-gray-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className={dangerButtonStyles}>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Data & Privacy */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🗄️ Data & Privacy</h2>
                    <p className="text-gray-400 mb-6">Manage your data and privacy settings</p>
                  </div>

                  {/* Scorecard History */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">📊 Scorecard History</h3>
                    <p className="text-gray-400 mb-4">
                      Manage all your saved startup scorecards and predictions
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleExportScorecardHistory}
                        className={buttonStyles}
                      >
                        📄 Export History
                      </button>
                      <button
                        onClick={handleClearScorecardHistory}
                        className={dangerButtonStyles}
                      >
                        🗑️ Clear History
                      </button>
                    </div>
                  </div>

                  {/* Competitor Watchlist */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">👀 Competitor Watchlist</h3>
                    <p className="text-gray-400 mb-4">
                      Manage your tracked competitors and market intelligence
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleExportWatchlist}
                        className={buttonStyles}
                      >
                        📄 Export Watchlist
                      </button>
                      <button
                        onClick={handleClearWatchlist}
                        className={dangerButtonStyles}
                      >
                        🗑️ Clear Watchlist
                      </button>
                    </div>
                  </div>

                  {/* Financial Reports */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">💰 Financial Reports</h3>
                    <p className="text-gray-400 mb-4">
                      Manage your saved financial health snapshots
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleClearFinancialReports}
                        className={dangerButtonStyles}
                      >
                        🗑️ Clear Reports
                      </button>
                    </div>
                  </div>

                  {/* Growth Advice */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 Growth Advice</h3>
                    <p className="text-gray-400 mb-4">
                      Manage your saved AI-generated growth suggestions
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleClearGrowthSuggestions}
                        className={dangerButtonStyles}
                      >
                        🗑️ Clear Suggestions
                      </button>
                    </div>
                  </div>

                  {/* Clear All Data */}
                  <div className="bg-red-900/20 p-6 rounded-lg border border-red-600">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">⚠️ Nuclear Option</h3>
                    <p className="text-gray-400 mb-4">
                      Clear ALL data from your browser. This includes scorecards, watchlists, financial reports, growth advice, and all settings. This action cannot be undone!
                    </p>
                    <button
                      onClick={handleClearAllData}
                      className={dangerButtonStyles}
                    >
                      💣 Clear All Data
                    </button>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">🔒 Privacy Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-300">Allow anonymous usage analytics</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-300">Share data with partners (improves recommendations)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🔔 Notifications</h2>
                    <p className="text-gray-400 mb-6">Choose what updates you want to receive</p>
                  </div>

                  {/* Email Notifications */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">📧 Email Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailNewsAlerts}
                          onChange={(e) => setEmailNewsAlerts(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-gray-300 font-medium">News Alerts</div>
                          <div className="text-sm text-gray-500">Receive email alerts for news about your watched competitors</div>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailProductUpdates}
                          onChange={(e) => setEmailProductUpdates(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-gray-300 font-medium">Product Updates</div>
                          <div className="text-sm text-gray-500">Get notified about new features and improvements</div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-gray-300 font-medium">Weekly Digest</div>
                          <div className="text-sm text-gray-500">Summary of your startup's key metrics and news</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* In-App Notifications */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">🔔 In-App Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inAppNotifications}
                          onChange={(e) => setInAppNotifications(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-gray-300 font-medium">Enable In-App Notifications</div>
                          <div className="text-sm text-gray-500">Show notification badges and alerts within the app</div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-gray-300 font-medium">Runway Warnings</div>
                          <div className="text-sm text-gray-500">Alert me when cash runway drops below 6 months</div>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-gray-300 font-medium">Success Milestones</div>
                          <div className="text-sm text-gray-500">Celebrate when predicted success probability increases</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Notification Frequency */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">⏰ Notification Frequency</h3>
                    <select className={inputStyles}>
                      <option>Real-time (as they happen)</option>
                      <option>Daily digest</option>
                      <option>Weekly digest</option>
                      <option>Monthly digest</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🔒 Security</h2>
                    <p className="text-gray-400 mb-6">Keep your account safe and secure</p>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">🔐 Two-Factor Authentication</h3>
                        <p className="text-gray-400 mt-2">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        twoFactorEnabled
                          ? 'bg-green-900/50 text-green-400 border border-green-600'
                          : 'bg-gray-700 text-gray-400 border border-gray-600'
                      }`}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <button
                      onClick={handleEnable2FA}
                      className={twoFactorEnabled ? dangerButtonStyles : buttonStyles}
                    >
                      {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>

                  {/* Login History */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">📜 Login History</h3>
                        <p className="text-gray-400 mt-2">
                          Monitor recent account activity for suspicious behavior
                        </p>
                      </div>
                      <button
                        onClick={() => setShowLoginHistory(!showLoginHistory)}
                        className={buttonStyles}
                      >
                        {showLoginHistory ? 'Hide' : 'View'} History
                      </button>
                    </div>

                    {showLoginHistory && (
                      <div className="mt-4 space-y-3">
                        {loginHistory.map(login => (
                          <div key={login.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-green-400">✓</span>
                                  <span className="text-white font-medium">{login.device}</span>
                                </div>
                                <div className="text-sm text-gray-400">
                                  {new Date(login.date).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {login.location} • IP: {login.ip}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">💻 Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-white font-medium mb-1">Current Session</div>
                            <div className="text-sm text-gray-400">Chrome on Windows</div>
                            <div className="text-sm text-gray-500">Bengaluru, India • Last active: Now</div>
                          </div>
                          <div className="px-3 py-1 bg-green-900/50 text-green-400 border border-green-600 rounded-full text-xs font-medium">
                            Active
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium">
                      Sign out all other sessions
                    </button>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">🔗 Integrations</h2>
                    <p className="text-gray-400 mb-6">Connect external services and manage API keys</p>
                  </div>

                  {/* NewsAPI Integration */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
                        📰
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">NewsAPI</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Connect your NewsAPI key for personalized news feeds and higher rate limits
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">API Key</label>
                      <input
                        type="password"
                        value={newsApiKey}
                        onChange={(e) => setNewsApiKey(e.target.value)}
                        placeholder="Enter your NewsAPI key"
                        className={inputStyles}
                      />
                      <a
                        href="https://newsapi.org/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                      >
                        Get your free API key →
                      </a>
                    </div>
                  </div>

                  {/* Gemini API Integration */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                        🤖
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">Google Gemini API</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Use your own Gemini API key for AI growth advisor and unlimited suggestions
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">API Key</label>
                      <input
                        type="password"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className={inputStyles}
                      />
                      <a
                        href="https://ai.google.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                      >
                        Get your Gemini API key →
                      </a>
                    </div>
                  </div>

                  {/* Connected Services */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">Connected Services</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            📊
                          </div>
                          <div>
                            <div className="text-white font-medium">Google Analytics</div>
                            <div className="text-sm text-gray-500">Coming soon</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-sm" disabled>
                          Connect
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            💼
                          </div>
                          <div>
                            <div className="text-white font-medium">Slack Integration</div>
                            <div className="text-sm text-gray-500">Coming soon</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-sm" disabled>
                          Connect
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            📧
                          </div>
                          <div>
                            <div className="text-white font-medium">Email Integration</div>
                            <div className="text-sm text-gray-500">Coming soon</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded text-sm" disabled>
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Configuration */}
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">🔔 Webhook Configuration</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Receive real-time notifications to your own endpoint (for developers)
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Webhook URL</label>
                        <input
                          type="url"
                          placeholder="https://your-domain.com/webhook"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Events to Subscribe</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-gray-300 text-sm">Scorecard Generated</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-gray-300 text-sm">Financial Report Created</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-gray-300 text-sm">Competitor News Alert</span>
                          </label>
                        </div>
                      </div>
                      <button className={buttonStyles}>
                        Save Webhook
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button (for applicable tabs) */}
              {(activeTab === 'general' || activeTab === 'notifications' || activeTab === 'integrations') && (
                <div className="mt-8 pt-6 border-t border-gray-700 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Changes are saved to your browser's local storage
                  </p>
                  <button
                    onClick={saveSettings}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-[1.02]"
                  >
                    💾 Save Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;