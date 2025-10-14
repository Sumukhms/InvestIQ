// frontend/src/components/GrowthSuggestions.jsx

import React, { useState } from 'react';

const GrowthSuggestions = () => {
  const [industry, setIndustry] = useState('FinTech');
  const [stage, setStage] = useState('Idea');
  const [idea, setIdea] = useState('A platform for fractional ownership of collectible sneakers.');
  
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuggestions(null);

    try {
      const response = await fetch('http://localhost:5000/api/growth-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, stage, idea }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get suggestions.');
      }
      
      const result = await response.json();
      setSuggestions(result);

    } catch (err) {
      setError(err.message);
      console.error("Suggestion API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="p-8 max-w-6xl mx-auto my-8 bg-gray-800 rounded-xl shadow-lg">
      <div className="md:flex md:gap-8">
        <div className="md:w-1/3 mb-8 md:mb-0">
          <h1 className="text-3xl font-bold text-blue-400">Personalized AI Advisor</h1>
          <p className="mt-2 text-gray-400">Get advice tailored to your specific startup idea.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="idea" className={labelStyles}>Your Startup Idea (One-liner)</label>
              <textarea 
                id="idea" 
                value={idea} 
                onChange={(e) => setIdea(e.target.value)} 
                className={`${inputStyles} h-24`} 
                placeholder="e.g., A mobile app that uses AI to create personalized workout plans."
                required 
              />
            </div>
            <div>
              <label htmlFor="industry" className={labelStyles}>Your Industry</label>
              <select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputStyles}>
                <option>FinTech</option><option>SaaS</option><option>EdTech</option><option>HealthTech</option><option>Hardware & IoT</option><option>E-commerce</option>
              </select>
            </div>
            <div>
              <label htmlFor="stage" className={labelStyles}>Your Growth Stage</label>
              <select id="stage" value={stage} onChange={(e) => setStage(e.target.value)} className={inputStyles}>
                <option>Idea</option><option>MVP</option><option>Early Revenue</option><option>Scaling</option>
              </select>
            </div>
            <button type="submit" disabled={isLoading} className="w-full mt-2 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
              {isLoading ? 'Generating Advice...' : 'Get My Suggestions'}
            </button>
          </form>
        </div>
        <div className="md:w-2/3 md:pl-8 md:border-l md:border-gray-700">
          {isLoading && <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>}
          {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md border border-red-600">{error}</div>}
          {suggestions && (
            <div className="space-y-6">
              {Object.entries(suggestions).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-blue-300 capitalize border-b-2 border-blue-400/50 pb-2 mb-3">{category}</h3>
                  <ul className="space-y-3 list-disc list-inside text-gray-300">
                    {items.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {!isLoading && !suggestions && !error && (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>Your personalized, AI-generated suggestions will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthSuggestions;