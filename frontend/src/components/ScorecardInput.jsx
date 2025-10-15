import React, { useState } from 'react';

// The component now accepts `onPredictionSuccess` as a prop from DashboardPage.jsx
const ScorecardInput = ({ onPredictionSuccess }) => {
  const [formData, setFormData] = useState({
    funding_total_usd: '5000000', funding_rounds: '3', milestones: '4', relationships: '10',
    category_code: 'software', founded_at: '2018-01-01', first_funding_at: '2019-06-01', last_funding_at: '2022-12-01',
    age_first_milestone_year: '2.5', age_last_milestone_year: '4.8',
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Network response was not ok');
      }
      const result = await response.json();
      
      // On success, call the function passed from DashboardPage to trigger the page switch
      if (onPredictionSuccess) {
        onPredictionSuccess(result, formData);
      } else {
        setPrediction(result);
      }

    } catch (err) {
      setError(err.message || 'Failed to get prediction.');
      console.error("Prediction API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto my-8 bg-gray-800 rounded-xl shadow-lg">
      <div className="flex-grow md:pr-8 md:border-r border-gray-700">
        <h1 className="text-3xl font-bold text-blue-400">Instant Startup Scorecard</h1>
        <p className="mt-2 text-gray-400">Enter your startup's details for an AI-powered success prediction.</p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div><label className={labelStyles}>Total Funding (USD)</label><input type="number" name="funding_total_usd" value={formData.funding_total_usd} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>Funding Rounds</label><input type="number" name="funding_rounds" value={formData.funding_rounds} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>Milestones Achieved</label><input type="number" name="milestones" value={formData.milestones} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>Key Relationships</label><input type="number" name="relationships" value={formData.relationships} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>Industry/Category</label><select name="category_code" value={formData.category_code} onChange={handleChange} className={inputStyles}><option value="software">Software</option><option value="web">Web</option><option value="mobile">Mobile</option><option value="enterprise">Enterprise</option><option value="advertising">Advertising</option><option value="games_video">Games/Video</option><option value="ecommerce">E-commerce</option><option value="biotech">Biotech</option><option value="consulting">Consulting</option><option value="other">Other</option></select></div>
            <div><label className={labelStyles}>Founded Date</label><input type="date" name="founded_at" value={formData.founded_at} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>First Funding Date</label><input type="date" name="first_funding_at" value={formData.first_funding_at} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>Last Funding Date</label><input type="date" name="last_funding_at" value={formData.last_funding_at} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>Age at First Milestone (Years)</label><input type="number" step="0.1" name="age_first_milestone_year" value={formData.age_first_milestone_year} onChange={handleChange} className={inputStyles} required /></div>
            <div><label className={labelStyles}>Age at Last Milestone (Years)</label><input type="number" step="0.1" name="age_last_milestone_year" value={formData.age_last_milestone_year} onChange={handleChange} className={inputStyles} required /></div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full mt-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Analyzing...' : 'Generate Full Analysis'}
          </button>
        </form>
      </div>
      <div className="w-full md:w-1/3 flex flex-col justify-center items-center mt-6 md:mt-0">
        {isLoading && <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md border border-red-600">{error}</div>}
        {!isLoading && !error && (
            <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <h3 className="mt-2 text-lg font-semibold">Ready for Analysis</h3>
                <p className="text-sm">Your startup's success potential will be visualized after submission.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ScorecardInput;

