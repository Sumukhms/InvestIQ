import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CompetitorSetupPage = () => {
  const [searchQuery, setSearchQuery] = useState({
    name: '',
    industry: '',
    location: ''
  });
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- NEW: State for the watchlist ---
  const [watchlist, setWatchlist] = useState([]);

  // --- NEW: Load watchlist from local storage on component mount ---
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('competitorWatchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  // --- NEW: Save watchlist to local storage whenever it changes ---
  useEffect(() => {
    localStorage.setItem('competitorWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.name && !searchQuery.industry) {
      setError('Please enter a startup name or an industry to search.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const params = new URLSearchParams({
        name: searchQuery.name,
        industry: searchQuery.industry,
        location: searchQuery.location
      }).toString();

      const response = await fetch(`http://localhost:5000/api/competitors/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch competitors. The server returned an error.');
      }
      const data = await response.json();
      setResults(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Function to add a competitor to the watchlist ---
  const addToWatchlist = (competitorToAdd) => {
    if (!watchlist.some(c => c.name === competitorToAdd.name)) {
      setWatchlist([...watchlist, competitorToAdd]);
    } else {
      alert(`${competitorToAdd.name} is already on your watchlist.`);
    }
  };

  // --- NEW: Function to remove a competitor from the watchlist ---
  const removeFromWatchlist = (competitorToRemove) => {
    setWatchlist(watchlist.filter(c => c.name !== competitorToRemove.name));
  };
  
  const inputStyles = "w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-400">Find Your Competitors</h1>
        <Link to="/alerts" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          View Alerts
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 p-6 bg-gray-800 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Startup Name (Optional)</label>
            <input type="text" name="name" value={searchQuery.name} onChange={handleInputChange} placeholder="e.g., 'Stripe'" className={inputStyles} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
            <input type="text" name="industry" value={searchQuery.industry} onChange={handleInputChange} placeholder="e.g., 'fintech'" className={inputStyles} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location (Optional)</label>
            <input type="text" name="location" value={searchQuery.location} onChange={handleInputChange} placeholder="e.g., 'San Francisco'" className={inputStyles} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-500">
          {loading ? 'Searching...' : 'Find Competitors'}
        </button>
      </form>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {results.map((company, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-blue-300">{company.name}</h3>
                  {company.domain && <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">{company.domain}</a>}
                </div>
                <button
                  onClick={() => addToWatchlist(company)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Add to Watchlist
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- UPDATED: Watchlist Display --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Watchlist</h2>
        {watchlist.length > 0 ? (
          <div className="space-y-4">
            {watchlist.map((company, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold">{company.name}</h3>
                    <p className="text-gray-400">{company.domain}</p>
                </div>
                <button
                  onClick={() => removeFromWatchlist(company)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Your saved competitors will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default CompetitorSetupPage;