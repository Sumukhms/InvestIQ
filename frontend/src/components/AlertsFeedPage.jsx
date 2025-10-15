// frontend/src/components/AlertsFeedPage.jsx

import React, { useState, useEffect } from 'react';

const AlertsFeedPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  // We can keep the filters, but the data will come from the API now.
  // Note: The category might not perfectly match, as it depends on the API's data.
  const filterTopics = ['All', 'Technology', 'Startups', 'Funding'];

  useEffect(() => {
    // Fetch news from YOUR backend API when the component loads
    const fetchNews = async () => {
      try {
        // This proxy is set up in vite.config.js to point to your backend (e.g., http://localhost:5000)
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Add a category property for filtering (optional, based on title analysis)
        const processedData = data.map(article => ({
            ...article,
            id: article.url, // Use URL as a unique ID
            category: getCategoryFromTitle(article.title)
        }));
        setArticles(processedData);
        setError(null);
      } catch (error) {
        setError(error.message);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Helper function to assign a category based on keywords in the title
  const getCategoryFromTitle = (title) => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('funding') || lowerTitle.includes('series') || lowerTitle.includes('raise')) {
          return 'Funding';
      }
      if (lowerTitle.includes('startup') || lowerTitle.includes('yc') || lowerTitle.includes('venture')) {
          return 'Startups';
      }
      return 'Technology'; // Default category
  };

  const filteredArticles = articles.filter(article => {
    const matchesFilter = activeFilter === 'All' || article.category === activeFilter;
    const matchesSearch = searchTerm === '' ||
      (article.title && article.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (isLoading) return <div className="p-10 text-center text-white">Loading Real-Time News...</div>;
  if (error) return <div className="p-10 text-center text-red-400">Error: {error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Alerts & News Feed</h1>

      {/* Filter and Search UI remains the same */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <input type="text" placeholder="Search news..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white" />
          <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-400">Filter by:</span>
          {filterTopics.map(topic => (<button key={topic} onClick={() => setActiveFilter(topic)} className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeFilter === topic ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{topic}</button>))}
        </div>
      </div>

      {/* Articles Grid now displays real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div key={article.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">{article.category}</span>
                  <span className="text-xs text-gray-400">{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-100">{article.title}</h2>
                <p className="text-gray-300 text-sm">{article.description}</p>
              </div>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mt-4 font-semibold">
                Read More &rarr;
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h2 className="text-xl text-gray-400">No articles found for your criteria.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsFeedPage;