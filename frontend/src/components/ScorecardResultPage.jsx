// frontend/src/components/ScorecardResultPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ScorecardResultPage = () => {
  const location = useLocation();
  // location.state will contain { prediction, formData, isViewingHistory? }
  const { prediction, formData, isViewingHistory } = location.state || {};
  
  const [isSaved, setIsSaved] = useState(isViewingHistory); // If viewing history, it's already saved

  const handleSaveScorecard = () => {
    const history = JSON.parse(localStorage.getItem('scorecardHistory')) || [];
    
    const newEntry = {
      prediction,
      formData,
      date: new Date().toISOString(),
    };

    // To prevent duplicates, we can check if a similar entry already exists
    // This is optional but good practice
    const alreadyExists = history.some(item => item.date === newEntry.date && item.formData.startup_name === newEntry.formData.startup_name);

    if (!alreadyExists) {
      history.unshift(newEntry);
      localStorage.setItem('scorecardHistory', JSON.stringify(history));
    }
    
    setIsSaved(true);
  };

  // Dummy data for category breakdown and analysis
  const categoryScores = { Team: 85, Product: 90, Market: 75, Financials: 80 };
  const strengths = ["Strong founding team.", "Innovative product.", "Large market."];
  const improvements = ["Develop a customer acquisition strategy.", "Refine financial projections.", "Expand the team."];

  if (!prediction || !formData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">No Report Data Available</h1>
        <p className="text-gray-400">Please generate a scorecard or select a report from the dashboard.</p>
        <Link to="/dashboard" className="mt-6 px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const overallScore = prediction.success_probability;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-400">Startup Scorecard Result</h1>
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-300">{formData.startup_name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
            <div style={{ width: 170, height: 170 }}><CircularProgressbar value={overallScore} text={`${overallScore}/100`} styles={buildStyles({ textSize: '16px', textColor: '#fff', pathColor: overallScore > 70 ? '#10B981' : overallScore > 40 ? '#F59E0B' : '#EF4444', trailColor: '#374151' })}/></div>
          </div>
          <div className="md:col-span-2 bg-gray-800 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Category Breakdown</h2>
            {Object.entries(categoryScores).map(([category, score]) => (
              <div key={category} className="mb-4">
                <div className="flex justify-between mb-1"><span className="text-base font-medium text-gray-300">{category}</span><span className="text-sm font-medium text-gray-400">{score}/100</span></div>
                <div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${score}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl"><h3 className="text-xl font-semibold mb-4 text-green-400">Strengths</h3><ul className="list-disc list-inside space-y-2 text-gray-300">{strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          <div className="bg-gray-800 p-6 rounded-xl"><h3 className="text-xl font-semibold mb-4 text-red-400">Areas for Improvement</h3><ul className="list-disc list-inside space-y-2 text-gray-300">{improvements.map((i, idx) => <li key={idx}>{i}</li>)}</ul></div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-center gap-4">
            <button onClick={handleSaveScorecard} disabled={isSaved} className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
              {isSaved ? 'Saved!' : 'Save Scorecard'}
            </button>
            <Link to="/growth-suggestions" className="px-6 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">Get Personalized Growth Suggestions</Link>
        </div>
      </div>
    </div>
  );
};

export default ScorecardResultPage;