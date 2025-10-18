// frontend/src/components/GrowthSuggestions.jsx
// Enhanced version with better prompts, UI, and save functionality

import React, { useState, useEffect } from 'react';

const GrowthSuggestions = () => {
  const [industry, setIndustry] = useState('FinTech');
  const [stage, setStage] = useState('Idea');
  const [idea, setIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedSuggestions, setSavedSuggestions] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load saved suggestions on mount
  useEffect(() => {
    const saved = localStorage.getItem('growthSuggestions');
    if (saved) {
      setSavedSuggestions(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuggestions(null);

    // Enhanced prompt for better Gemini responses
    const enhancedPrompt = `
You are an experienced startup advisor and venture capitalist. Provide actionable, specific growth advice for this startup:

**Startup Idea:** ${idea}
**Industry:** ${industry}
**Growth Stage:** ${stage}
${targetMarket ? `**Target Market:** ${targetMarket}` : ''}
${currentChallenges ? `**Current Challenges:** ${currentChallenges}` : ''}

Provide comprehensive, structured advice in the following categories. Be specific, actionable, and include real examples where possible:

1. **Growth Strategy** (3-4 specific tactics)
2. **Marketing & Customer Acquisition** (3-4 channel recommendations)
3. **Product Development** (3-4 feature or improvement suggestions)
4. **Fundraising Tips** (3-4 investor approach strategies)
5. **Key Metrics to Track** (3-4 essential KPIs)
6. **Potential Risks** (2-3 major risks and mitigation strategies)

Format each point as a clear, actionable recommendation. Use bold text for emphasis using **text**.
`;

    try {
      const response = await fetch('http://localhost:5000/api/growth-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          industry, 
          stage, 
          idea,
          targetMarket,
          currentChallenges,
          prompt: enhancedPrompt 
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get suggestions.');
      }
      
      const result = await response.json();
      setSuggestions(result);

    } catch (err) {
      setError(err.message || 'Failed to connect to AI advisor. Please check your backend.');
      console.error("Suggestion API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuggestion = () => {
    if (!suggestions) {
      alert('No suggestions to save. Please generate suggestions first.');
      return;
    }

    const reportName = prompt('Name this advice session:', `${industry} - ${stage} - ${new Date().toLocaleDateString()}`);
    if (!reportName) return;

    const newSuggestion = {
      id: Date.now(),
      name: reportName,
      date: new Date().toISOString(),
      data: {
        industry,
        stage,
        idea,
        targetMarket,
        currentChallenges,
        suggestions,
      }
    };

    const updated = [newSuggestion, ...savedSuggestions];
    setSavedSuggestions(updated);
    localStorage.setItem('growthSuggestions', JSON.stringify(updated));
    alert('Advice saved successfully!');
  };

  const handleLoadSuggestion = (saved) => {
    setIndustry(saved.data.industry);
    setStage(saved.data.stage);
    setIdea(saved.data.idea);
    setTargetMarket(saved.data.targetMarket || '');
    setCurrentChallenges(saved.data.currentChallenges || '');
    setSuggestions(saved.data.suggestions);
    setShowSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSuggestion = (id) => {
    if (!confirm('Are you sure you want to delete this saved advice?')) return;
    const updated = savedSuggestions.filter(s => s.id !== id);
    setSavedSuggestions(updated);
    localStorage.setItem('growthSuggestions', JSON.stringify(updated));
  };

  const handleExportPDF = () => {
    if (!suggestions) return;
    
    // Create a formatted text version
    let content = `Growth Advice for ${idea}\n`;
    content += `Industry: ${industry} | Stage: ${stage}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `\n${'='.repeat(60)}\n\n`;
    
    Object.entries(suggestions).forEach(([category, items]) => {
      content += `${category.toUpperCase()}\n${'-'.repeat(40)}\n`;
      items.forEach((item, idx) => {
        const cleanItem = item.replace(/\*\*(.*?)\*\*/g, '$1');
        content += `${idx + 1}. ${cleanItem}\n\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth-advice-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyles = "w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-2";

  const getCategoryIcon = (category) => {
    const icons = {
      'growth strategy': '🚀',
      'marketing & customer acquisition': '📈',
      'product development': '💡',
      'fundraising tips': '💰',
      'key metrics to track': '📊',
      'potential risks': '⚠️',
    };
    return icons[category.toLowerCase()] || '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                AI Growth Advisor
              </h1>
              <p className="text-gray-400">Powered by Google Gemini 2.5 Flash • Personalized startup guidance</p>
            </div>
            <div className="flex gap-2">
              {suggestions && (
                <>
                  <button
                    onClick={handleSaveSuggestion}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    💾 Save Advice
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    📄 Export
                  </button>
                </>
              )}
              <button
                onClick={() => setShowSaved(!showSaved)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                📁 Saved ({savedSuggestions.length})
              </button>
            </div>
          </div>

          {/* Saved Suggestions Panel */}
          {showSaved && (
            <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">💡 Saved Growth Advice</h3>
              {savedSuggestions.length === 0 ? (
                <p className="text-gray-500">No saved advice yet. Generate and save your first session!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedSuggestions.map(saved => (
                    <div key={saved.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{saved.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {saved.data.industry} • {saved.data.stage}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(saved.date).toLocaleDateString()} at {new Date(saved.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{saved.data.idea}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadSuggestion(saved)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteSuggestion(saved.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">📝 Your Startup Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="idea" className={labelStyles}>
                    Startup Idea (One-liner) *
                  </label>
                  <textarea
                    id="idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className={`${inputStyles} min-h-[100px] resize-y`}
                    placeholder="e.g., A platform for fractional ownership of collectible sneakers."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="industry" className={labelStyles}>
                      Industry *
                    </label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className={inputStyles}
                    >
                      <option>FinTech</option>
                      <option>SaaS</option>
                      <option>EdTech</option>
                      <option>HealthTech</option>
                      <option>Hardware & IoT</option>
                      <option>E-commerce</option>
                      <option>AI/ML</option>
                      <option>CleanTech</option>
                      <option>FoodTech</option>
                      <option>PropTech</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="stage" className={labelStyles}>
                      Growth Stage *
                    </label>
                    <select
                      id="stage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className={inputStyles}
                    >
                      <option>Idea</option>
                      <option>MVP</option>
                      <option>Early Revenue</option>
                      <option>Scaling</option>
                      <option>Growth</option>
                      <option>Mature</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Options */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <span>{showAdvanced ? '▼' : '▶'}</span>
                    <span>Additional Context (Optional)</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Target Market
                        </label>
                        <input
                          type="text"
                          value={targetMarket}
                          onChange={(e) => setTargetMarket(e.target.value)}
                          className={`${inputStyles} text-sm`}
                          placeholder="e.g., Millennials interested in sneakers"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Current Challenges
                        </label>
                        <textarea
                          value={currentChallenges}
                          onChange={(e) => setCurrentChallenges(e.target.value)}
                          className={`${inputStyles} text-sm min-h-[60px]`}
                          placeholder="e.g., Struggling with user acquisition, need better monetization"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Consulting AI Advisor...
                    </span>
                  ) : (
                    '🤖 Get Personalized Advice'
                  )}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  Powered by Google Gemini 2.5 Flash
                </div>
              </form>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 min-h-[600px]">
              {isLoading && (
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                  <p className="text-gray-400 animate-pulse">Analyzing your startup...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 10-15 seconds</p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-2xl">⚠️</span>
                    <div>
                      <h3 className="text-red-400 font-bold mb-2">Error Getting Advice</h3>
                      <p className="text-red-300">{error}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Make sure your backend server is running on port 5000 and the Gemini API key is configured.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {suggestions && (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Your Personalized Growth Roadmap</h2>
                    <p className="text-gray-400 mt-1">
                      Tailored advice for {idea.substring(0, 60)}...
                    </p>
                  </div>

                  {Object.entries(suggestions).map(([category, items]) => (
                    <div key={category} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                      <h3 className="text-xl font-semibold text-blue-300 capitalize flex items-center gap-2 mb-4">
                        <span className="text-2xl">{getCategoryIcon(category)}</span>
                        {category}
                      </h3>
                      <ul className="space-y-3">
                        {items.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300">
                            <span className="text-blue-400 font-bold mt-1 flex-shrink-0">{index + 1}.</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Action Footer */}
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">🎯 Next Steps</h3>
                    <p className="text-gray-300 mb-4">
                      Use these insights to refine your strategy. Consider saving this advice for future reference and revisiting it as your startup evolves.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleSaveSuggestion}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                      >
                        💾 Save This Advice
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                      >
                        📄 Export as Text
                      </button>
                      <button
                        onClick={() => {
                          setSuggestions(null);
                          setIdea('');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                      >
                        🔄 New Consultation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && !suggestions && !error && (
                <div className="flex flex-col justify-center items-center h-full text-center px-8">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    AI-Powered Growth Consulting
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Fill in your startup details and get personalized, actionable advice powered by advanced AI.
                    Our advisor analyzes your industry, stage, and specific challenges to provide tailored recommendations.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="text-2xl mb-2">🎯</div>
                      <p className="text-gray-400">Personalized Strategy</p>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-gray-400">Key Metrics</p>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="text-2xl mb-2">💡</div>
                      <p className="text-gray-400">Product Insights</p>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="text-2xl mb-2">💰</div>
                      <p className="text-gray-400">Fundraising Tips</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthSuggestions;