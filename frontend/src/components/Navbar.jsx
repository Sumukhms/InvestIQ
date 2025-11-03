import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

// The component receives both profileData and setProfileData from App.jsx
const Navbar = ({ profileData = null, setProfileData }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // ✅ STATES for real notifications
  const [notifications, setNotifications] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // ✅ NEW: Helper to format time
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    } catch {
      return dateString;
    }
  };

  // ✅ NEW: Fetches real notifications from the API
  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/alerts', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotifications();

    // Optional: Refresh notifications every 2 minutes
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval); // Clear interval on unmount
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      if (setProfileData) {
        setProfileData(null);
      }
      navigate('/login');
    }
  };

  // ✅ NEW: Handles opening the bell and marking alerts as read
  const handleNotificationsOpen = async () => {
    const newIsOpen = !isNotificationsOpen;
    setNotificationsOpen(newIsOpen);

    // If we are opening the panel and there are unread alerts
    if (newIsOpen && unreadCount > 0) {
      const token = localStorage.getItem('token');
      try {
        await fetch('/api/alerts/markread', {
          method: 'POST',
          headers: { 'x-auth-token': token }
        });
        // Update state to reflect alerts are read
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark alerts as read", err);
      }
    }
  };
  
  // ✅ NEW: Handles clicking a single alert
  const handleAlertClick = (alert) => {
    setNotificationsOpen(false);
    navigate(alert.link);
    // Note: We already mark all as read when opening, but you could
    // add single-read logic here if preferred.
  };

  const clearAllNotifications = () => {
    // This should ideally be a DELETE API call,
    // but for now, we'll just clear from state.
    setNotifications([]);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/scorecard', label: 'Scorecard', icon: '🎯' },
    { path: '/growth-suggestions', label: 'AI Advisor', icon: '🤖' },
    { path: '/financials', label: 'Financials', icon: '💰' },
    { path: '/alerts-feed', label: 'News', icon: '🔔' },
    { path: '/competitor-setup', label: 'Competitors', icon: '⚔️' },
  ];
  
  // ✅ NEW: Use real notification data
  const unreadCount = notifications.filter(n => !n.read).length;

  // (Notification icons and colors remain the same as your provided code)
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️'; // Default for info or competitor alerts
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-900/10';
      case 'warning': return 'border-l-yellow-500 bg-yellow-900/10';
      case 'error': return 'border-l-red-500 bg-red-900/10';
      default: return 'border-l-blue-500 bg-blue-900/10';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-300 group-hover:to-purple-400 transition-all">
                InvestIQ
              </div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span className="hidden xl:inline">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={handleNotificationsOpen} // ✅ UPDATED handler
                className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && ( // ✅ UPDATED to use unreadCount
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                  <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-700">
                      {/* ✅ UPDATED: Map over real notification data */}
                      {notifications.map(notification => (
                        <div
                          key={notification._id} // Use _id from MongoDB
                          className={`p-4 hover:bg-gray-700/50 cursor-pointer transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                            !notification.read ? 'bg-gray-700/30' : ''
                          }`}
                          onClick={() => handleAlertClick(notification)} // ✅ UPDATED handler
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(notification.createdAt)} {/* ✅ Use formatDate */}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-gray-700 overflow-hidden">
                  {profileData?.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(profileData?.name)}</span>
                  )}
                </div>
                <svg
                  className={`hidden md:block w-4 h-4 text-gray-400 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden">
                        {profileData?.avatar ? (
                          <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{getInitials(profileData?.name)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{profileData?.name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{profileData?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="text-xl">👤</span>
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="text-xl">⚙️</span>
                      <span>Settings</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="text-xl">📊</span>
                      <span>Activity</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                    >
                      <span className="text-xl">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700">
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;