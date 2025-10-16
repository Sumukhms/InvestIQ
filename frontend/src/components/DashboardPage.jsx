// frontend/src/components/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [scorecardHistory, setScorecardHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedScorecards = JSON.parse(localStorage.getItem('scorecardHistory')) || [];
    setScorecardHistory(savedScorecards);
  }, []);
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);
    
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/news'); 
                setNews(res.data);
            } catch (err) {
                console.error("Failed to fetch news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

  const handleViewReport = (historyItem) => {
    const reportData = historyItem.formData ? 
      { ...historyItem, isViewingHistory: true } : 
      { 
        formData: { startup_name: historyItem.startupName || 'N/A' }, 
        prediction: { success_probability: historyItem.score || 0 },
        date: historyItem.date,
        isViewingHistory: true 
      };
    navigate('/results', { state: reportData });
  };

  // --- NEW: Calculate Metrics ---
  const totalStartupsAnalyzed = scorecardHistory.length;
  
  const averageSuccessScore = () => {
    if (totalStartupsAnalyzed === 0) {
      return 0; // Avoid division by zero
    }
    const totalScore = scorecardHistory.reduce((acc, item) => {
      const score = item.prediction ? item.prediction.success_probability : item.score;
      return acc + (score || 0);
    }, 0);
    return Math.round(totalScore / totalStartupsAnalyzed);
  };
  // --- END: NEW ---
    const timeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric 1: Total Startups Analyzed */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Total Startups Analyzed</h2>
          <p className="text-4xl font-bold mt-2">{totalStartupsAnalyzed}</p>
        </div>
        
        {/* Metric 2: Average Success Score */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Average Success Score</h2>
          <p className="text-4xl font-bold mt-2">{averageSuccessScore()}<span className="text-2xl text-gray-400">/100</span></p>
        </div>

        {/* Analyze New Startup Button */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center">
           <Link to="/scorecard" className="w-full text-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              Analyze a New Startup
            </Link>
        </div>
      </div>
    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Investor Dashboard</h1> 
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Scorecard Component Placeholder */}
                <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Investment Scorecard Overview</h2>
                    <p className="text-gray-400">
                        Run a new scorecard to analyze a startup idea and get an InvestIQ score.
                    </p>
                    <div className="mt-4 p-8 bg-gray-700 rounded text-center">
                        <p>Main Charts and User Data will go here.</p>
                    </div>
                </div>

      {/* Scorecard History Section */}
      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Scorecards</h2>
        <div className="overflow-x-auto">
          {scorecardHistory.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3">Startup Name</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scorecardHistory.map((item, index) => {
                  const startupName = item.formData ? item.formData.startup_name : item.startupName;
                  const score = item.prediction ? item.prediction.success_probability : item.score;

                  return (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3 font-medium">{startupName || 'N/A'}</td>
                      <td className={`p-3 font-bold ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {score || 0}/100
                      </td>
                      <td className="p-3 text-gray-400">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleViewReport(item)}
                          className="px-4 py-2 font-semibold text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-4">No scorecard history found. Analyze a startup to see its results here.</p>
          )}
        </div>
      </div>
    </div>
  );
                {/* Real-Time News Feed */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2 flex justify-between items-center">
                        Real-Time FinTech News
                        <span className="text-sm font-bold text-red-500 animate-pulse">LIVE</span>
                    </h2>
                    
                    {loading && <p className="text-gray-500">Loading news feed...</p>}
                    
                    {!loading && news.length === 0 && <p className="text-gray-500">No news articles found.</p>}

                    {!loading && news.length > 0 && (
                        <div className="space-y-4">
                            {news.map((article, index) => (
                                <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                                    <a href={article.url || "#"} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-blue-400 hover:text-blue-300 transition duration-150 block">
                                        {article.title}
                                    </a>
                                    <p className="text-sm text-gray-400 mt-1">{article.description}</p>
                                    <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                        <span>Source: {article.source?.name || 'N/A'}</span>
                                        <span>{timeAgo(article.publishedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;