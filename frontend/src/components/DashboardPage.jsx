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

  const handleViewReport = (historyItem) => {
    // Check if the item is in the new format, if not, create the structure it expects
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

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        <div className="bg-gray-800 p-6 rounded-lg"><h2 className="text-xl font-semibold">Key Metric 1</h2><p className="text-3xl mt-2">1,234</p></div>
        <div className="bg-gray-800 p-6 rounded-lg"><h2 className="text-xl font-semibold">Key Metric 2</h2><p className="text-3xl mt-2">$56,789</p></div>
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center">
           <Link to="/scorecard" className="w-full text-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              Analyze a New Startup
            </Link>
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
                  // Handle both old and new data structures
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
};

export default DashboardPage;