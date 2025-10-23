import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertTriangle } from 'lucide-react';

const CustomCircularProgressbar = ({ value, text, styles }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <circle
        stroke={styles.trailColor}
        cx="50"
        cy="50"
        r={radius}
        strokeWidth="10"
        fill="transparent"
      />
      <circle
        stroke={styles.pathColor}
        cx="50"
        cy="50"
        r={radius}
        strokeWidth="10"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="50"
        dy=".3em"
        textAnchor="middle"
        fontSize={styles.textSize}
        fill={styles.textColor}
        className="font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

const ScorecardResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scorecardData, setScorecardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScorecard = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(`/api/scorecard/${id}`, config);
        
        // ✅ Log to verify data structure
        console.log('Fetched scorecard:', res.data);
        
        setScorecardData(res.data);
      } catch (err) {
        console.error("Failed to fetch scorecard:", err);
        setError(err.response?.data?.msg || 'Failed to load scorecard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl text-gray-400">Loading Scorecard...</p>
      </div>
    );
  }

  if (error || !scorecardData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-red-400">Error Loading Report</h1>
        <p className="text-gray-400 text-center mb-6">{error || 'Could not find the requested scorecard.'}</p>
        <Link to="/dashboard" className="mt-6 px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const { prediction, formData } = scorecardData;

  if (!prediction || !formData) {
     return (
       <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
         <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
         <h1 className="text-2xl font-bold mb-4 text-yellow-400">Incomplete Data</h1>
         <p className="text-gray-400 text-center mb-6">The scorecard data seems incomplete. Please try generating it again.</p>
         <Link to="/scorecard" className="mt-6 px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
           Generate New Scorecard
         </Link>
       </div>
     );
  }

  // ✅ FIXED: success_probability is already 0-1, multiply by 100 for display
  const overallScorePercent = (prediction.success_probability || 0) * 100;
  const isPredictedSuccess = prediction.prediction_label === 'Success';

  // Use data from ML model response
  const confidence = prediction.confidence || 'Medium';
  const riskLevel = prediction.risk_level || (overallScorePercent < 50 ? 'High' : (overallScorePercent < 70 ? 'Medium' : 'Low'));
  const recommendation = prediction.recommendation || (isPredictedSuccess ? 'Favorable outlook, consider for investment.' : 'High risk detected, proceed with caution.');

  const getScoreColor = (score) => {
    if (score >= 70) return { bg: 'bg-green-900/20', border: 'border-green-600', text: 'text-green-400', path: '#10B981' };
    if (score >= 50) return { bg: 'bg-yellow-900/20', border: 'border-yellow-600', text: 'text-yellow-400', path: '#F59E0B' };
    return { bg: 'bg-red-900/20', border: 'border-red-600', text: 'text-red-400', path: '#EF4444' };
  };

  const scoreColors = getScoreColor(overallScorePercent);

  const generateInsights = () => {
     const insights = {
       strengths: [],
       improvements: [],
       keyMetrics: []
     };

     const fundingM = (formData.funding_total_usd || 0) / 1000000;
     if (fundingM > 5) {
       insights.strengths.push(`Strong funding base with $${fundingM.toFixed(1)}M raised`);
     } else if (fundingM < 1 && formData.funding_rounds > 0) {
       insights.improvements.push('Consider raising more capital to accelerate growth');
     } else if (formData.funding_rounds === 0) {
        insights.improvements.push('Explore seed funding opportunities');
     }

     if (formData.relationships > 20) {
       insights.strengths.push(`Excellent network with ${formData.relationships} key relationships`);
     } else if (formData.relationships < 10) {
       insights.improvements.push('Build more strategic partnerships and advisor relationships');
     }

     if (formData.milestones > 10) {
       insights.strengths.push(`Impressive milestone achievement (${formData.milestones} completed)`);
     } else if (formData.milestones < 5) {
       insights.improvements.push('Focus on achieving more measurable milestones');
     }

     if (formData.funding_rounds >= 3) {
       insights.strengths.push('Multiple funding rounds demonstrate investor confidence');
     } else if (formData.funding_rounds === 1) {
       insights.improvements.push('Consider readiness for the next funding stage (e.g., Series A/B)');
     }

     insights.keyMetrics.push({
       label: 'Funding Efficiency',
       value: formData.funding_rounds > 0 ?
         `$${(fundingM / formData.funding_rounds).toFixed(2)}M/round` :
         'N/A'
     });

     insights.keyMetrics.push({
       label: 'Network Strength',
       value: `${formData.relationships || 0} connections`
     });

     insights.keyMetrics.push({
       label: 'Milestone Velocity',
       value: formData.milestones > 0 && formData.age_last_milestone_year > 0 ?
         `${(formData.milestones / formData.age_last_milestone_year).toFixed(1)}/year` :
         'N/A'
     });

     if (insights.strengths.length === 0) {
       insights.strengths.push(`Operating in the ${formData.category_code || 'specified'} sector`);
     }
     if (insights.improvements.length === 0) {
       insights.improvements.push('Continue building on current momentum and track key metrics');
     }

     return insights;
  };
  
  const insights = generateInsights();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Startup Analysis Complete
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300">{scorecardData.startupName}</h2>
          <p className="text-gray-400 mt-2">{formData.category_code || 'N/A'} • {(formData.problem_statement || 'No description').substring(0, 100)}...</p>
        </div>

        {/* Main Score Card */}
        <div className={`${scoreColors.bg} border ${scoreColors.border} rounded-xl p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Circular Progress */}
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Success Probability</h3>
              <div style={{ width: 180, height: 180 }}>
                <CustomCircularProgressbar
                  value={overallScorePercent}
                  text={`${overallScorePercent.toFixed(1)}%`}
                  styles={{
                    textSize: '20px',
                    textColor: '#fff',
                    pathColor: scoreColors.path,
                    trailColor: '#374151'
                  }}
                />
              </div>
              <div className={`mt-4 px-4 py-2 rounded-full ${scoreColors.bg} border ${scoreColors.border}`}>
                <span className={`font-bold ${scoreColors.text}`}>
                  {isPredictedSuccess ? '✓ Predicted Success' : '✗ High Risk'}
                </span>
              </div>
            </div>

            {/* Prediction Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Confidence Level</h4>
                <p className={`text-xl font-bold ${scoreColors.text}`}>{confidence}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Risk Assessment</h4>
                <p className="text-xl font-bold text-gray-200">{riskLevel} Risk</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Investment Recommendation</h4>
                <p className="text-lg text-gray-200">{recommendation}</p>
              </div>
              {prediction.model_version && (
                <div className="text-xs text-gray-500 mt-2">
                  Analysis by: {prediction.model_version}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {insights.keyMetrics.map((metric, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-gray-400 mb-1">{metric.label}</h4>
              <p className="text-2xl font-bold text-blue-400">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💪</span>
              <h3 className="text-xl font-semibold text-green-400">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {insights.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📈</span>
              <h3 className="text-xl font-semibold text-yellow-400">Growth Opportunities</h3>
            </div>
            <ul className="space-y-3">
              {insights.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <span className="text-yellow-400 mt-1">→</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Startup Details Summary */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">📊 Startup Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Funding</p>
              <p className="text-lg font-semibold text-gray-200">
                ${((formData.funding_total_usd || 0) / 1000000).toFixed(2)}M
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Funding Rounds</p>
              <p className="text-lg font-semibold text-gray-200">{formData.funding_rounds || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Milestones</p>
              <p className="text-lg font-semibold text-gray-200">{formData.milestones || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Network</p>
              <p className="text-lg font-semibold text-gray-200">{formData.relationships || 0}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
                to="/dashboard"
                className="w-full sm:w-auto text-center px-6 py-3 font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
                ← Back to Dashboard
            </Link>

            <button
               disabled
               className="w-full sm:w-auto px-6 py-3 font-semibold text-gray-400 bg-gray-800 rounded-lg cursor-not-allowed border border-gray-700"
             >
               ✓ Scorecard Saved
             </button>

            <Link
                to="/scorecard"
                className="w-full sm:w-auto text-center px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
                + Generate New Report
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ScorecardResultPage;