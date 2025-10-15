import React, { useState } from 'react';
import ScorecardInput from './ScorecardInput';
import GrowthSuggestions from './GrowthSuggestions';
import ScorecardOutputPage from './ScorecardOutputPage'; // Corrected import path

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('scorecard');
  const [predictionData, setPredictionData] = useState(null);
  const [formData, setFormData] = useState(null);

  // This function is called by ScorecardInput upon a successful prediction
  const handlePredictionSuccess = (prediction, originalData) => {
    setPredictionData(prediction);
    setFormData(originalData);
  };

  // This function allows the user to go back to the input form from the results
  const handleGoBack = () => {
    setPredictionData(null);
    setFormData(null);
  };

  const tabStyles = "px-6 py-2 rounded-t-lg text-lg font-medium transition-colors focus:outline-none";
  const activeStyles = "bg-gray-800 text-blue-400";
  const inactiveStyles = "bg-gray-700 text-gray-400 hover:bg-gray-600";

  return (
    <>
      <header className="pt-8 px-8 max-w-7xl mx-auto">
        <nav className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`${tabStyles} ${activeTab === 'scorecard' ? activeStyles : inactiveStyles}`}
          >
            Instant Scorecard
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`${tabStyles} ${activeTab === 'suggestions' ? activeStyles : inactiveStyles}`}
          >
            Growth Suggestions
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'scorecard' && (
          predictionData && formData ? (
            <ScorecardOutputPage
              prediction={predictionData}
              formData={formData}
              onBack={handleGoBack}
            />
          ) : (
            <ScorecardInput onPredictionSuccess={handlePredictionSuccess} />
          )
        )}
        {activeTab === 'suggestions' && <GrowthSuggestions />}
      </main>
    </>
  );
}

export default DashboardPage;