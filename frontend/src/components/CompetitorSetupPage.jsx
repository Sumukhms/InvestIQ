import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CompetitorSetupPage = () => {
  // Mock state for the list of competitors
  const [competitors, setCompetitors] = useState(['Innovate Inc.', 'NextGen Solutions', 'DataDriven Co.']);
  const [newCompetitor, setNewCompetitor] = useState('');

  const handleAddCompetitor = (e) => {
    e.preventDefault();
    if (newCompetitor && !competitors.includes(newCompetitor)) {
      setCompetitors([...competitors, newCompetitor]);
      setNewCompetitor(''); // Reset input field
    }
  };

  const handleRemoveCompetitor = (competitorToRemove) => {
    setCompetitors(competitors.filter(c => c !== competitorToRemove));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <div className="flex items-center mb-6">
        <Link to="/alerts" className="text-blue-400 hover:underline mr-4">← Back to Alerts</Link>
        <h1 className="text-4xl font-bold text-blue-400">Manage Competitors</h1>
      </div>

      {/* Add Competitor Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add a Competitor</h2>
        <form onSubmit={handleAddCompetitor} className="flex items-center space-x-4">
          <input 
            type="text"
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg"
            placeholder="Enter competitor name"
            required
          />
          <button type="submit" className="py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
            Add
          </button>
        </form>
      </div>

      {/* Tracked Competitors List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Currently Tracking</h2>
        <ul className="space-y-3">
          {competitors.map(competitor => (
            <li 
              key={competitor} 
              className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
            >
              <span className="font-medium">{competitor}</span>
              <button 
                onClick={() => handleRemoveCompetitor(competitor)}
                className="text-red-500 hover:text-red-400 font-semibold"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompetitorSetupPage;