// frontend/src/components/AlertsFeedPage.jsx

import React, { useState, useEffect } from 'react';

const AlertsFeedPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filterTopics = ['All', 'Technology', 'Startups', 'Funding'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const processedData = data.map(article => ({
            ...article,
            id: article.url,
            category: getCategoryFromTitle(article.title || '') // Safely handle null titles
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

  const getCategoryFromTitle = (title) => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('funding') || lowerTitle.includes('series') || lowerTitle.includes('raise')) {
          return 'Funding';
      }
      if (lowerTitle.includes('startup') || lowerTitle.includes('yc') || lowerTitle.includes('venture')) {
          return 'Startups';
      }
      return 'Technology';
  };

  // --- THIS IS THE CORRECTED FILTERING LOGIC ---
  const filteredArticles = articles.filter(article => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Safely check title and description before calling toLowerCase()
    const titleMatch = article.title && article.title.toLowerCase().includes(lowerSearchTerm);
    const descriptionMatch = article.description && article.description.toLowerCase().includes(lowerSearchTerm);
    
    const matchesFilter = activeFilter === 'All' || article.category === activeFilter;
    const matchesSearch = searchTerm === '' || titleMatch || descriptionMatch;

    return matchesFilter && matchesSearch;
  });
  // --- END OF CORRECTION ---

  if (isLoading) return <div className="p-10 text-center text-white">Loading Real-Time News...</div>;
  if (error) return <div className="p-10 text-center text-red-400">Error: {error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Alerts & News Feed</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div key={article.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">{article.category}</span>
                  <span className="text-xs text-gray-400">{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-100">{article.title || "No Title Available"}</h2>
                <p className="text-gray-300 text-sm">{article.description || "No summary available."}</p>
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