// src/components/Suggestions.jsx

import React, { useState } from 'react';
import api from '../api/api'; // Make sure this path is correct

const Suggestions = ({ initialSuggestions, isLoading, error, startupId }) => {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleGetAiSuggestions = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await api.get(`/suggestions/ai-based/${startupId}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to get AI suggestions", err);
      setAiError('Failed to generate AI suggestions.');
    } finally {
      setIsAiLoading(false);
    }
  };
  
  // Don't render anything if the initial load is happening (the parent will show a skeleton)
  if (isLoading) return null;
  
  if (error) {
     return <p className="text-red-500">Could not load suggestions.</p>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
            <IconBookOpen className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-900 ml-2">Growth Blueprint</h3>
        </div>
        <button
          onClick={handleGetAiSuggestions}
          disabled={isAiLoading}
          className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAiLoading ? ('Generating...') : (<>✨ Ask AI</>)}
        </button>
      </div>
      
      {aiError && <p className="text-sm text-red-500 mb-2">{aiError}</p>}

      {suggestions && suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((item, index) => (
            <div key={item.id || index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900">{item.title}</h4>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No suggestions available.</p>
      )}
    </div>
  );
};

export default Suggestions;