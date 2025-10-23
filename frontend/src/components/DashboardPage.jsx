import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const [scorecardHistory, setScorecardHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchScorecardHistory = async () => {
    if (isLoading && scorecardHistory.length > 0) return;

    setIsLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      if (location.pathname !== '/login') {
         navigate('/login');
      }
      return;
    }

    try {
      const config = {
        headers: { 'x-auth-token': token }
      };
      const res = await axios.get('/api/scorecard', config);
      
      // ✅ Log data to verify format
      console.log('Fetched scorecards:', res.data);
      
      setScorecardHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch scorecard history:', err);
      setError(err.response?.data?.msg || 'Could not load scorecard history.');
      if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          if (location.pathname !== '/login') {
             navigate('/login');
          }
      }
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
     fetchScorecardHistory();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [navigate]);

  const handleViewReport = (scorecardId) => {
    navigate(`/scorecard-result/${scorecardId}`);
  };

  const totalStartupsAnalyzed = scorecardHistory.length;

  // ✅ FIXED: Calculate average correctly (data is already 0-1 decimal)
  const averageSuccessScore = () => {
    if (totalStartupsAnalyzed === 0) {
      return 0;
    }
    const totalScore = scorecardHistory.reduce((acc, item) => {
      // success_probability is already 0-1, multiply by 100 for percentage
      const score = item.prediction?.success_probability || 0;
      return acc + (score * 100);
    }, 0);
    return (totalScore / totalStartupsAnalyzed).toFixed(1);
  };

  // Loading State
  if (isLoading && scorecardHistory.length === 0) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

   // Error State
   if (error) {
     return (
       <div className="p-8 bg-gray-900 min-h-screen text-white flex items-center justify-center">
         <div className="text-center bg-gray-800 p-10 rounded-lg shadow-xl border border-red-500/30">
           <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <h2 className="text-2xl font-semibold text-red-400 mb-2">Error Loading Dashboard</h2>
           <p className="text-gray-400 mb-6">{error}</p>
           <button
             onClick={fetchScorecardHistory}
             className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
           >
             Retry Loading
           </button>
         </div>
       </div>
     );
   }

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Investor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Metric 1: Total Startups Analyzed */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider">Total Analyses</h2>
          <p className="text-5xl font-bold mt-2 text-blue-400">{totalStartupsAnalyzed}</p>
        </div>

        {/* Metric 2: Average Success Score */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider">Avg. Success Score</h2>
          <p className="text-5xl font-bold mt-2 text-green-400">{averageSuccessScore()}<span className="text-3xl text-gray-400">%</span></p>
        </div>

        {/* Analyze New Startup Button */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <Link to="/scorecard" className="w-full text-center px-6 py-4 text-xl font-semibold text-white bg-black/20 rounded-md hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Analyze New Startup
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1">
        {/* Recent Scorecards Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-semibold text-gray-300">Recent Scorecards</h2>
             <button
               onClick={fetchScorecardHistory}
               disabled={isLoading}
               className={`p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
               title="Refresh Scorecards"
             >
                <Loader2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
          </div>
          <div className="overflow-x-auto">
            {scorecardHistory.length > 0 ? (
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-700 text-sm text-gray-400 uppercase tracking-wider">
                    <th className="p-4">Startup Name</th>
                    <th className="p-4 text-right">Success Score</th>
                    <th className="p-4">Prediction</th>
                    <th className="p-4">Date Analyzed</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scorecardHistory.map((item) => {
                    const startupName = item?.startupName || 'N/A';
                    
                    // ✅ FIXED: success_probability is already 0-1 decimal, multiply by 100
                    const scorePercent = item?.prediction?.success_probability !== undefined 
                      ? (item.prediction.success_probability * 100) 
                      : 0;
                    
                    const predictionLabel = item?.prediction?.prediction_label || 'Unknown';
                    const itemDate = item?.date ? new Date(item.date).toLocaleDateString() : 'N/A';

                    // Color coding based on score
                    let scoreColorClass = 'text-red-400';
                    if (scorePercent >= 70) scoreColorClass = 'text-green-400';
                    else if (scorePercent >= 50) scoreColorClass = 'text-yellow-400';

                    // Badge color for prediction
                    const badgeColor = predictionLabel === 'Success' 
                      ? 'bg-green-900/30 text-green-400 border border-green-600'
                      : 'bg-red-900/30 text-red-400 border border-red-600';

                    return (
                      <tr key={item?._id || Math.random()} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <td className="p-4 font-medium text-gray-200">{startupName}</td>
                        <td className={`p-4 font-bold text-right ${scoreColorClass}`}>
                          {scorePercent.toFixed(1)}%
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                            {predictionLabel}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">{itemDate}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleViewReport(item._id)}
                            className="px-4 py-2 font-semibold text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 mx-auto"
                            disabled={!item?._id}
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Report
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              !isLoading && scorecardHistory.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                   <div className="text-4xl mb-3">📂</div>
                   <p>No scorecard history found.</p>
                   <p className="mt-1">Analyze a startup to see its results here.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;