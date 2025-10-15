// frontend/src/components/ScorecardInput.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScorecardInput = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    funding_total_usd: '',
    funding_rounds: '',
    milestones: '',
    relationships: '',
    category_code: 'software',
    founded_at: '',
    first_funding_at: '',
    last_funding_at: '',
    age_first_milestone_year: '',
    age_last_milestone_year: '',
  });

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

    // Create a copy of the form data to modify
    const processedFormData = { ...formData };

    // List of fields that should be numbers
    const numericFields = [
      'funding_total_usd',
      'funding_rounds',
      'milestones',
      'relationships',
      'age_first_milestone_year',
      'age_last_milestone_year',
    ];

    // Convert string values to numbers for the numeric fields
    numericFields.forEach(field => {
      if (processedFormData[field]) {
        processedFormData[field] = parseFloat(processedFormData[field]);
      }
    });

    try {
      const response = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedFormData), // Send the processed data
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Network response was not ok');
      }
      const result = await response.json();
      navigate('/results', { state: { prediction: result } }); // Navigate on success
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-xl shadow-lg">
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
            {isLoading ? 'Analyzing...' : 'Calculate My Score'}
          </button>
          {error && <div className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md border border-red-600 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ScorecardInput;