import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CompetitorSetupPage = () => {
  const [searchQuery, setSearchQuery] = useState({ industry: '', location: '' });
  const [results, setResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load watchlist from local storage
  useEffect(() => {
    const saved = localStorage.getItem('competitorWatchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  // Save watchlist to local storage
  useEffect(() => {
    localStorage.setItem('competitorWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const params = new URLSearchParams(searchQuery).toString();
      const response = await fetch(`http://localhost:5000/api/competitors/search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data. Is the backend running?');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = (competitor) => {
    if (!watchlist.some(c => c.name === competitor.name)) {
      setWatchlist(prev => [...prev, competitor]);
    } else {
      alert(`${competitor.name} is already on the watchlist.`);
    }
  };

  const inputStyles = "w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">Real-Time Competitor Analysis</h1>
      
      <form onSubmit={handleSearch} className="mb-8 p-6 bg-gray-800 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
            <input type="text" name="industry" value={searchQuery.industry} onChange={handleInputChange} placeholder="e.g., 'fintech'" className={inputStyles} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <input type="text" name="location" value={searchQuery.location} onChange={handleInputChange} placeholder="e.g., 'mumbai'" className={inputStyles} required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-lg">
          {loading ? 'Searching...' : 'Find Competitors'}
        </button>
      </form>

      {error && <p className="text-red-400 text-center">{error}</p>}

      {/* Results Display */}
      <div className="space-y-6">
        {results.map(comp => (
          <div key={comp.name} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <a href={`https://${comp.domain}`} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-blue-400 hover:underline">{comp.name}</a>
                <div className="mt-2">
                  <h4 className="font-semibold text-gray-300">Key Strengths:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    {comp.strengths.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
              <button onClick={() => addToWatchlist(comp)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                Watch
              </button>
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-300">Recent News:</h4>
              <ul className="space-y-2 mt-2">
                {comp.news.map(article => (
                  <li key={article.url}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{article.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorSetupPage;