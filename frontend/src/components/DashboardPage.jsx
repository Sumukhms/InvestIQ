// frontend/src/components/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);
    
    // Function to fetch news data from the backend
    useEffect(() => {
        const fetchNews = async () => {
            try {
                // This call hits the backend route configured for Finnhub
                const res = await axios.get('http://localhost:5000/api/news'); 
                setNews(res.data);
            } catch (err) {
                console.error("Failed to fetch news:", err);
                // Handle error display if necessary
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Helper function to format the time since publication
    const timeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Investor Dashboard</h1> 
            <h1 className="text-4xl font-bold mb-6 text-blue-400">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Scorecard Component Placeholder (Left Column) */}
                <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Investment Scorecard Overview</h2>
                    <p className="text-gray-400">
                        Run a new scorecard to analyze a startup idea and get an InvestIQ score.
                    </p>
                    {/* Placeholder for the main functionality/charts */}
                    <div className="mt-4 p-8 bg-gray-700 rounded text-center">
                         <p>Main Charts and User Data will go here.</p>
                    </div>
                </div>

                {/* Real-Time News Feed (Right Column) */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2 flex justify-between items-center">
                        Real-Time FinTech News
                        <span className="text-sm text-yellow-500">LIVE</span>
                    </h2>
                    
                    {loading && <p className="text-gray-500">Loading news feed...</p>}
                    
                    {!loading && news.length === 0 && <p className="text-gray-500">No news articles found.</p>}

                    {!loading && news.length > 0 && (
                        <div className="space-y-4">
                            {news.map((article, index) => (
                                <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                                    <a 
                                        href={article.url || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-lg font-medium text-blue-400 hover:text-blue-300 transition duration-150 block"
                                    >
                                        {article.title}
                                    </a>
                                    <p className="text-sm text-gray-400 mt-1">{article.description}</p>
                                    <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                        <span>Source: {article.source?.name || 'N/A'}</span>
                                        <span>{timeAgo(article.publishedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* End Real-Time News Feed */}
                
            </div>
        </div>
    );
};

export default DashboardPage;