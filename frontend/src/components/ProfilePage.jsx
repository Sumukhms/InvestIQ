// frontend/src/components/ProfilePage.jsx
// Enhanced with modern UI, avatar upload, activity stats, and better UX

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    bio: '',
    avatar: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // User statistics (mock data - replace with actual API)
  const [userStats, setUserStats] = useState({
    scorecardsGenerated: 0,
    financialReports: 0,
    growthAdvice: 0,
    watchedCompetitors: 0,
    accountAge: 0
  });

  useEffect(() => {
    fetchProfile();
    loadUserStats();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, user is not logged in.");
      setIsLoading(false);
      return;
    }

    try {
      const config = {
        headers: { 'x-auth-token': token }
      };
      const res = await axios.get('http://localhost:5000/api/auth/profile', config);

      setProfileData({
        name: res.data.name || '',
        email: res.data.email || '',
        role: res.data.role || '',
        company: res.data.company || '',
        bio: res.data.bio || '',
        avatar: res.data.avatar || ''
      });

      if (res.data.avatar) {
        setAvatarPreview(res.data.avatar);
      }

    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = () => {
    // Load stats from localStorage
    const scorecards = JSON.parse(localStorage.getItem('scorecardHistory') || '[]');
    const financials = JSON.parse(localStorage.getItem('financialReports') || '[]');
    const growth = JSON.parse(localStorage.getItem('growthSuggestions') || '[]');
    const watchlist = JSON.parse(localStorage.getItem('competitorWatchlist') || '[]');
    
    // Calculate account age (mock - should come from backend)
    const accountCreated = localStorage.getItem('accountCreated') || new Date().toISOString();
    const ageInDays = Math.floor((new Date() - new Date(accountCreated)) / (1000 * 60 * 60 * 24));

    setUserStats({
      scorecardsGenerated: scorecards.length,
      financialReports: financials.length,
      growthAdvice: growth.length,
      watchedCompetitors: watchlist.length,
      accountAge: ageInDays
    });
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('token');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      const res = await axios.put('http://localhost:5000/api/auth/profile', profileData, config);
      setProfileData(res.data);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error: Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Investor': 'bg-green-900/50 text-green-400 border-green-600',
      'Founder': 'bg-blue-900/50 text-blue-400 border-blue-600',
      'Student': 'bg-purple-900/50 text-purple-400 border-purple-600',
      'Analyst': 'bg-yellow-900/50 text-yellow-400 border-yellow-600',
      'Other': 'bg-gray-700 text-gray-400 border-gray-600'
    };
    return colors[role] || colors['Other'];
  };

  const inputStyles = "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-2";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account and view your activity</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded-lg flex items-center gap-3 animate-fade-in">
            <span className="text-green-400 text-xl">✓</span>
            <span className="text-green-400 font-medium">Profile updated successfully!</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-700">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(profileData.name || 'User')}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                {profileData.name || 'Your Name'}
              </h2>
              <p className="text-gray-400 mb-3">{profileData.email}</p>
              {profileData.role && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(profileData.role)}`}>
                    {profileData.role}
                  </span>
                  {profileData.company && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600">
                      🏢 {profileData.company}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{userStats.scorecardsGenerated}</div>
                <div className="text-xs text-gray-400">Scorecards</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👤 Profile Details
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 Activity & Stats
            </button>
          </div>
        </div>

        {/* Profile Details Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={labelStyles}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={inputStyles}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelStyles}>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      className={`${inputStyles} opacity-60 cursor-not-allowed`}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Professional Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="role" className={labelStyles}>
                      I am a... *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={profileData.role}
                      onChange={handleChange}
                      className={inputStyles}
                      required
                    >
                      <option value="">Select your role</option>
                      <option value="Investor">💰 Investor</option>
                      <option value="Founder">🚀 Startup Founder</option>
                      <option value="Student">🎓 Student</option>
                      <option value="Analyst">📊 Analyst</option>
                      <option value="Other">👤 Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="company" className={labelStyles}>
                      Company / Institution
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={profileData.company}
                      onChange={handleChange}
                      placeholder="e.g., Your Startup Inc."
                      className={inputStyles}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className={labelStyles}>
                  Bio / About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us a little about yourself..."
                  className={`${inputStyles} resize-y`}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => window.location.href = '/settings'}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Advanced Settings
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activity & Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">📊</span>
                  <span className="text-blue-400 text-xs font-medium">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {userStats.scorecardsGenerated}
                </div>
                <div className="text-sm text-gray-400">Scorecards Generated</div>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl border border-green-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">💰</span>
                  <span className="text-green-400 text-xs font-medium">Saved</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {userStats.financialReports}
                </div>
                <div className="text-sm text-gray-400">Financial Reports</div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">🤖</span>
                  <span className="text-purple-400 text-xs font-medium">AI</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {userStats.growthAdvice}
                </div>
                <div className="text-sm text-gray-400">Growth Consultations</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl border border-yellow-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">👀</span>
                  <span className="text-yellow-400 text-xs font-medium">Tracking</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {userStats.watchedCompetitors}
                </div>
                <div className="text-sm text-gray-400">Competitors Watched</div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-3xl">📅</div>
                  <div>
                    <div className="text-sm text-gray-400">Member Since</div>
                    <div className="text-white font-medium">
                      {userStats.accountAge} days ago
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-3xl">⚡</div>
                  <div>
                    <div className="text-sm text-gray-400">Activity Level</div>
                    <div className="text-white font-medium">
                      {userStats.scorecardsGenerated > 10 ? 'Power User 🔥' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🏆 Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg text-center ${userStats.scorecardsGenerated >= 1 ? 'bg-blue-900/30 border-blue-700' : 'bg-gray-700/30 opacity-50'} border`}>
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-sm text-white font-medium">First Score</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {userStats.scorecardsGenerated >= 1 ? 'Unlocked!' : 'Locked'}
                  </div>
                </div>

                <div className={`p-4 rounded-lg text-center ${userStats.scorecardsGenerated >= 10 ? 'bg-purple-900/30 border-purple-700' : 'bg-gray-700/30 opacity-50'} border`}>
                  <div className="text-3xl mb-2">🔮</div>
                  <div className="text-sm text-white font-medium">Oracle</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {userStats.scorecardsGenerated >= 10 ? 'Unlocked!' : '10 scorecards'}
                  </div>
                </div>

                <div className={`p-4 rounded-lg text-center ${userStats.financialReports >= 5 ? 'bg-green-900/30 border-green-700' : 'bg-gray-700/30 opacity-50'} border`}>
                  <div className="text-3xl mb-2">💎</div>
                  <div className="text-sm text-white font-medium">Money Mind</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {userStats.financialReports >= 5 ? 'Unlocked!' : '5 reports'}
                  </div>
                </div>

                <div className={`p-4 rounded-lg text-center ${userStats.growthAdvice >= 3 ? 'bg-yellow-900/30 border-yellow-700' : 'bg-gray-700/30 opacity-50'} border`}>
                  <div className="text-3xl mb-2">🧠</div>
                  <div className="text-sm text-white font-medium">AI Whisperer</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {userStats.growthAdvice >= 3 ? 'Unlocked!' : '3 consultations'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;