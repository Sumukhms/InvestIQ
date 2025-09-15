// frontend/src/components/FundingAlerts.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Ensure this path is correct
import { IconBookOpen, IconChevronRight, IconLoader } from './Icons';

const NewsAlerts = () => {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await api.get('/analysis/market-news');
                setNews(res.data);
            } catch (err) {
                setError('Failed to fetch market news.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <IconLoader className="animate-spin w-8 h-8 text-gray-400" />
                </div>
            );
        }

        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }

        if (news.length === 0) {
            return <p className="text-center text-gray-500">No recent news available.</p>;
        }

        return (
            <div className="space-y-4">
                {news.map((article) => (
                    <a 
                        key={article.id} 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                        <div className="bg-blue-100 p-3 rounded-xl mr-4">
                            <IconBookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <p className="font-bold text-gray-800 text-sm truncate">{article.headline}</p>
                            <p className="text-xs text-gray-500">{article.source}</p>
                        </div>
                        <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Latest Tech News</h3>
            {renderContent()}
        </div>
    );
};

export default NewsAlerts;