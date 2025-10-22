import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- IMPORT AXIOS
import { AlertCircle, Loader2, TrendingUp, DollarSign, Users, Award, Calendar, Info } from 'lucide-react';

const ScorecardInput = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startup_name: '',
    problem_statement: '',
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
    avg_participants: '',
    is_top500: 0,
    has_roundA: 0,
    has_roundB: 0,
    has_roundC: 0,
    has_roundD: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiHealth, setApiHealth] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      // Using axios for consistency
      const response = await axios.get('http://127.0.0.1:5001/health');
      setApiHealth(response.data);
    } catch (err) {
      console.error('API health check failed:', err);
      setApiHealth({ model_loaded: false }); // Assume offline if check fails
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({ 
      ...prevState, 
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value 
    }));
  };

  // --- MODIFIED TO SAVE TO BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Prepare form data for ML model
    const processedFormData = { ...formData };
    const numericFields = [
      'funding_total_usd', 'funding_rounds', 'milestones',
      'relationships', 'age_first_milestone_year', 'age_last_milestone_year',
      'avg_participants'
    ];
    
    numericFields.forEach(field => {
      if (processedFormData[field]) {
        processedFormData[field] = parseFloat(processedFormData[field]);
      } else {
        processedFormData[field] = 0; // Ensure numeric fields are not empty strings
      }
    });

    try {
      // 1. Get prediction from the ML model
      const mlResponse = await axios.post('http://127.0.0.1:5001/predict', processedFormData);
      const predictionResult = mlResponse.data;

      // 2. Save the result to your main MERN backend
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect if not logged in
          return;
        }
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        };

        const saveData = {
          startupName: formData.startup_name,
          formData: processedFormData, // Save the numeric-converted data
          prediction: predictionResult,
        };
        
        // This is the call to your main database
        await axios.post('http://localhost:5000/api/scorecard', saveData, config);

      } catch (dbError) {
        console.error("Failed to save scorecard to database:", dbError);
        // We can still proceed even if saving fails so the user sees their result
      }
      
      // 3. Navigate to the results page
      navigate('/results', { state: { prediction: predictionResult, formData: formData } });

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get prediction.';
      setError(errorMessage);
      console.error("Prediction API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- (No changes to JSX, it remains the same) ---
  const inputStyles = "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2";
  const textareaStyles = `${inputStyles} min-h-[100px] resize-y`;
  const sectionTitle = "text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with API Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Instant Startup Scorecard
              </h1>
              <p className="mt-2 text-gray-400">
                AI-powered success prediction with 92.5% recall • Advanced ensemble model
              </p>
            </div>
            {apiHealth && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                apiHealth.model_loaded 
                  ? 'bg-green-900/50 text-green-400 border border-green-600' 
                  : 'bg-red-900/50 text-red-400 border border-red-600'
              }`}>
                {apiHealth.model_loaded ? '● Model Ready' : '● Model Offline'}
              </div>
            )}
          </div>
          
          {apiHealth?.advanced_model && (
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 text-sm text-blue-300">
              <Info className="inline w-4 h-4 mr-2" />
              Using advanced ensemble model with {(apiHealth.optimal_threshold * 100).toFixed(0)}% threshold
            </div>
          )}
        </div>

        {/* Main Form */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className={sectionTitle}>
                <TrendingUp className="w-6 h-6" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelStyles}>
                    Startup Name
                  </label>
                  <input
                    type="text"
                    name="startup_name"
                    value={formData.startup_name}
                    onChange={handleChange}
                    placeholder="e.g., TechCorp AI"
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    Problem Statement
                  </label>
                  <textarea
                    name="problem_statement"
                    value={formData.problem_statement}
                    onChange={handleChange}
                    placeholder="Describe the problem your startup solves..."
                    className={textareaStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    Industry/Category
                  </label>
                  <select
                    name="category_code"
                    value={formData.category_code}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option value="software">Software</option>
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="advertising">Advertising</option>
                    <option value="games_video">Games/Video</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="biotech">Biotech</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Funding & Financials */}
            <div className="mb-8">
              <h2 className={sectionTitle}>
                <DollarSign className="w-6 h-6" />
                Funding & Financials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyles}>
                    Total Funding (USD)
                  </label>
                  <input
                    type="number"
                    name="funding_total_usd"
                    value={formData.funding_total_usd}
                    onChange={handleChange}
                    placeholder="5000000"
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    Number of Funding Rounds
                  </label>
                  <input
                    type="number"
                    name="funding_rounds"
                    value={formData.funding_rounds}
                    onChange={handleChange}
                    placeholder="3"
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    Average Participants per Round
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="avg_participants"
                    value={formData.avg_participants}
                    onChange={handleChange}
                    placeholder="3.5"
                    className={inputStyles}
                  />
                  <p className="text-xs text-gray-500 mt-1">Average number of investors per funding round</p>
                </div>
                <div>
                  <label className={labelStyles}>
                    <input
                      type="checkbox"
                      name="is_top500"
                      checked={formData.is_top500 === 1}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    Top 500 Startup Recognition
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Featured in any top startup rankings</p>
                </div>
              </div>
            </div>

            {/* Milestones & Relationships */}
            <div className="mb-8">
              <h2 className={sectionTitle}>
                <Award className="w-6 h-6" />
                Milestones & Network
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyles}>
                    Milestones Achieved
                  </label>
                  <input
                    type="number"
                    name="milestones"
                    value={formData.milestones}
                    onChange={handleChange}
                    placeholder="12"
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    Key Relationships
                  </label>
                  <input
                    type="number"
                    name="relationships"
                    value={formData.relationships}
                    onChange={handleChange}
                    placeholder="25"
                    className={inputStyles}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Partnerships, advisors, investors</p>
                </div>
                <div>
                  <label className={labelStyles}>
                    Age at First Milestone (Years)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="age_first_milestone_year"
                    value={formData.age_first_milestone_year}
                    onChange={handleChange}
                    placeholder="0.5"
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    Age at Last Milestone (Years)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="age_last_milestone_year"
                    value={formData.age_last_milestone_year}
                    onChange={handleChange}
                    placeholder="2.5"
                    className={inputStyles}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h2 className={sectionTitle}>
                <Calendar className="w-6 h-6" />
                Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelStyles}>
                    Founded Date
                  </label>
                  <input
                    type="date"
                    name="founded_at"
                    value={formData.founded_at}
                    onChange={handleChange}
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    First Funding Date
                  </label>
                  <input
                    type="date"
                    name="first_funding_at"
                    value={formData.first_funding_at}
                    onChange={handleChange}
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyles}>
                    Last Funding Date
                  </label>
                  <input
                    type="date"
                    name="last_funding_at"
                    value={formData.last_funding_at}
                    onChange={handleChange}
                    className={inputStyles}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
              >
                {showAdvanced ? '▼' : '▶'} Advanced Options (Optional)
              </button>
              
              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-400 mb-4">Specify which funding rounds completed:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['A', 'B', 'C', 'D'].map(round => (
                      <label key={round} className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          name={`has_round${round}`}
                          checked={formData[`has_round${round}`] === 1}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        Series {round}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </span>
              ) : (
                'Calculate Success Score'
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-600 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium">Prediction Failed</p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by Advanced Stacking Ensemble (XGBoost + LightGBM + Random Forest)</p>
          <p className="mt-1">Model Accuracy: 79.5% • Precision: 79.3% • Recall: 92.5%</p>
        </div>
      </div>
    </div>
  );
};

export default ScorecardInput;
