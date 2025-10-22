// frontend/src/components/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
  const [scorecardHistory, setScorecardHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScorecardHistory();
  }, []);

  const fetchScorecardHistory = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const config = {
        headers: { 'x-auth-token': token }
      };
      // Fetch the scorecard history from the backend API
      const res = await axios.get('http://localhost:5000/api/scorecard/history', config);
      setScorecardHistory(res.data);
    
    } catch (err) {
      console.error('Failed to fetch scorecard history:', err);
      // You could set an error state here to show a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReport = (historyItem) => {
    // Navigate to the results page with the full data from the database
    navigate('/results', { 
      state: { 
        prediction: historyItem.prediction, 
        formData: historyItem.formData,
        isViewingHistory: true 
      } 
    });
  };

  const totalStartupsAnalyzed = scorecardHistory.length;

  const averageSuccessScore = () => {
    if (totalStartupsAnalyzed === 0) {
      return 0;
    }
    const totalScore = scorecardHistory.reduce((acc, item) => {
      const score = item.prediction ? item.prediction.success_probability : 0;
      return acc + (score || 0);
    }, 0);
    return (totalScore / totalStartupsAnalyzed).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Investor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Metric 1: Total Startups Analyzed */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Total Startups Analyzed</h2>
          <p className="text-4xl font-bold mt-2">{totalStartupsAnalyzed}</p>
        </div>

        {/* Metric 2: Average Success Score */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Average Success Score</h2>
          <p className="text-4xl font-bold mt-2">{averageSuccessScore()}<span className="text-2xl text-gray-400">%</span></p>
        </div>

        {/* Analyze New Startup Button */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center">
          <Link to="/scorecard" className="w-full text-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Analyze a New Startup
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1">
        {/* Recent Scorecards Section */}
        <div className="md:col-span-3 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Recent Scorecards</h2>
          <div className="overflow-x-auto">
            {scorecardHistory.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-3">Startup Name</th>
                    <th className="p-3">Success Probability</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scorecardHistory.map((item) => {
                    const startupName = item.startupName || 'N/A';
                    const score = item.prediction ? item.prediction.success_probability : 0;

                    return (
                      <tr key={item._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="p-3 font-medium">{startupName}</td>
                        <td className={`p-3 font-bold ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {score.toFixed(2) || 0}%
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
    </div>
  );
};

export default DashboardPage;
