import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CompetitorSetupPage = () => {
  const [searchQuery, setSearchQuery] = useState({ industry: '', location: '' });
  const [results, setResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [refreshing, setRefreshing] = useState(null); // Tracks which report is refreshing

  // Load watchlist from backend
  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/competitors/watchlist', { // ✅ FIXED: Relative URL
          headers: { 'x-auth-token': token }
        });
        if (res.ok) {
          const data = await res.json();
          setWatchlist(data);
        }
      } catch (err) {
        console.error('Error fetching watchlist', err);
      }
    };
    fetchWatchlist();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const params = new URLSearchParams(searchQuery).toString();
      const response = await fetch(`/api/competitors/search?${params}`); // ✅ FIXED: Relative URL
      
      if (!response.ok) {
        throw new Error('Failed to fetch data. Is the backend running?');
      }
      
      const data = await response.json();
      
      if (data.message) {
        setError(data.message);
        setResults([]);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Calls backend API
  const addToWatchlist = async (competitor) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add to the watchlist.');
      return;
    }

    if (watchlist.some(c => c.competitorData.name === competitor.name)) {
      alert(`${competitor.name} is already on your watchlist.`);
      return;
    }

    try {
      const res = await fetch('/api/competitors/watch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ competitor })
      });

      if (res.status === 409) {
        alert('Competitor already in watchlist.');
        return;
      }
      
      if (!res.ok) {
        throw new Error('Failed to add to watchlist');
      }

      const newReport = await res.json();
      setWatchlist(prev => [newReport, ...prev]);

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // ✅ UPDATED: Calls backend API
  const removeFromWatchlist = async (reportId, competitorName) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (window.confirm(`Remove ${competitorName} from watchlist?`)) {
      try {
        const res = await fetch(`/api/competitors/watch/${reportId}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token }
        });

        if (!res.ok) {
          throw new Error('Failed to remove');
        }
        
        setWatchlist(prev => prev.filter(c => c._id !== reportId));

      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return dateString;
    }
  };

  // ✅ NEW: On-demand refresh handler
  const handleRefresh = async (reportId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setRefreshing(reportId); // Set loading state for this specific item
    try {
      const res = await fetch(`/api/competitors/refresh/${reportId}`, {
        method: 'POST',
        headers: { 'x-auth-token': token }
      });

      if (!res.ok) {
        throw new Error('Failed to refresh');
      }

      const updatedReport = await res.json();
      
      // Update the watchlist state with the new report data
      setWatchlist(prev => 
        prev.map(report => 
          report._id === reportId ? updatedReport : report
        )
      );

    } catch (err) {
      alert(`Error refreshing: ${err.message}`);
    } finally {
      setRefreshing(null); // Clear loading state
    }
  };

  const inputStyles = "w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const cardStyles = "bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700";

  const quickSearches = [
    { industry: 'fintech', location: 'mumbai', label: '💳 Fintech - Mumbai' },
    { industry: 'fintech', location: 'bengaluru', label: '💳 Fintech - Bengaluru' },
    { industry: 'healthtech', location: 'bengaluru', label: '🏥 Healthtech - Bengaluru' },
    { industry: 'edtech', location: 'bengaluru', label: '📚 Edtech - Bengaluru' },
    { industry: 'ecommerce', location: 'mumbai', label: '🛒 Ecommerce - Mumbai' },
    { industry: 'foodtech', location: 'bengaluru', label: '🍔 Foodtech - Bengaluru' },
  ];

  const handleQuickSearch = (industry, location) => {
    setSearchQuery({ industry, location });
    const params = new URLSearchParams({ industry, location }).toString();
    setLoading(true);
    setError('');
    setResults([]);

    fetch(`/api/competitors/search?${params}`) // ✅ FIXED: Relative URL
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setError(data.message);
        } else {
          setResults(data);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Real-Time Competitor Analysis
              </h1>
              <p className="text-gray-400 mt-2">Discover and track competitors in your industry</p>
            </div>
            <button
              onClick={() => setShowWatchlist(!showWatchlist)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
            >
              <span className="text-xl">👁️</span>
              <span>Watchlist ({watchlist.length})</span>
            </button>
          </div>
        </div>

        {/* ✅ UPDATED: Watchlist Panel */}
        {showWatchlist && (
          <div className={`${cardStyles} p-6 mb-8 border-l-4 border-blue-500`}>
            <h2 className="text-2xl font-bold text-white mb-4">Your Watchlist</h2>
            {watchlist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">📋</p>
                <p className="text-lg">No competitors in your watchlist yet</p>
                <p className="text-sm mt-1">Search and add competitors to start tracking them</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchlist.map(report => (
                  <div key={report._id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 mr-2">
                        <h3 className="font-bold text-white text-lg">{report.competitorData.name}</h3>
                        <a 
                          href={`https://${report.competitorData.domain}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          {report.competitorData.domain}
                        </a>
                      </div>
                      {/* ✅ NEW: Action Buttons Div */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleRefresh(report._id)}
                          disabled={refreshing === report._id}
                          className={`text-xl p-1 rounded-full ${refreshing === report._id ? 'opacity-50 animate-spin' : 'hover:bg-gray-600'}`}
                          title="Refresh news"
                        >
                          🔄
                        </button>
                        <button
                          onClick={() => removeFromWatchlist(report._id, report.competitorData.name)}
                          className="text-red-400 hover:text-red-300 text-2xl leading-none"
                          title="Remove from watchlist"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {report.competitorData.description && (
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">{report.competitorData.description}</p>
                    )}
                    {/* ✅ NEW: Added last refresh time */}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>📅 Added {formatDate(report.createdAt)}</span>
                      <span>🔄 Last: {formatDate(report.lastUpdated)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Search Buttons */}
        <div className={`${cardStyles} p-6 mb-6`}>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Searches</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickSearch(search.industry, search.location)}
                className="px-3 py-2 bg-gray-700 hover:bg-blue-600 text-white rounded-lg text-sm transition-all hover:scale-105"
              >
                {search.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className={`${cardStyles} p-6 mb-8`}>
          <h2 className="text-xl font-bold text-white mb-4">Search Competitors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="industry"
                value={searchQuery.industry}
                onChange={handleInputChange}
                placeholder="e.g., fintech, healthtech, edtech"
                className={inputStyles}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Try: fintech, healthtech, edtech, ecommerce, foodtech, saas</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={searchQuery.location}
                onChange={handleInputChange}
                placeholder="e.g., Mumbai, Bengaluru, Delhi"
                className={inputStyles}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Try: Mumbai, Bengaluru, Delhi</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </span>
            ) : (
              '🔍 Find Competitors'
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Searching for competitors...</p>
          </div>
        )}

        {/* Results Display */}
        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Found {results.length} Competitor{results.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className="space-y-6">
              {results.map((comp, index) => (
                <div key={comp.name || index} className={cardStyles}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{comp.name}</h3>
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            Competitor #{index + 1}
                          </span>
                        </div>
                        <a
                          href={`https://${comp.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          🌐 {comp.domain}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        {comp.description && (
                          <p className="text-gray-400 mt-3 text-sm leading-relaxed">{comp.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => addToWatchlist(comp)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                      >
                        <span>👁️</span>
                        <span>Watch</span>
                      </button>
                    </div>

                    {/* Strengths */}
                    {comp.strengths && comp.strengths.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                          <span>💪</span> Key Strengths
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {comp.strengths.map((strength, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-gray-400 text-sm">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* News Section */}
                    {comp.news && comp.news.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                          <span>📰</span> Recent News ({comp.news.length})
                        </h4>
                        <div className="space-y-3">
                          {comp.news.map((article, idx) => (
                            <div key={idx} className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-start gap-2"
                              >
                                <span className="mt-0.5">📄</span>
                                <span className="flex-1">{article.title}</span>
                                <svg className="w-3 h-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                              {article.source && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                  Source: {article.source} {article.publishedAt && `• ${formatDate(article.publishedAt)}`}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No News Message */}
                    {comp.news && comp.news.length === 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-gray-500 text-sm">📭 No recent news available</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && !error && (
          <div className={`${cardStyles} p-12 text-center`}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to Find Competitors</h3>
            <p className="text-gray-400">
              Enter an industry and location above, or try one of the quick searches to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorSetupPage;