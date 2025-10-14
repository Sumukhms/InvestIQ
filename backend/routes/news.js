// backend/routes/news.js
const express = require('express');
const axios = require('axios'); // Requires 'axios' package installed in backend
const router = express.Router();

// Get API Key from environment variables. 
// *** YOU MUST SET THIS IN YOUR .ENV FILE: FINNHUB_API_KEY=YOUR_KEY ***
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY_PLACEHOLDER'; 

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1/news?';

// Helper function to map Finnhub data to a generic format
const formatFinnhubArticle = (article) => ({
    title: article.headline,
    source: { name: article.source },
    url: article.url,
    // Convert Unix timestamp (seconds) to ISO string
    publishedAt: new Date(article.datetime * 1000).toISOString(), 
    description: article.summary,
});

// @route   GET /api/news
// @desc    Fetch real-time Finnhub news (using 'general' category for broad market news)
// @access  Public (or protected if needed)
router.get('/', async (req, res) => {
    // --- Mock Data Fallback ---
    if (FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY_PLACEHOLDER' || !FINNHUB_API_KEY) {
        console.warn("Finnhub API key not configured. Returning mock data.");
        
        const mockArticles = [
            {
                headline: "Simulated Finnhub Data: Please set FINNHUB_API_KEY to see real news.",
                source: "InvestIQ Insights",
                url: "#",
                datetime: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
                summary: "FinTech startup 'InvestIQ' secures $10M seed funding to scale AI platform.",
            },
            {
                headline: "Market News: Global VC investment slows down in early-stage deals.",
                source: "Bloomberg",
                url: "#",
                datetime: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
                summary: "Analysts note caution among investors despite strong public market performance.",
            }
        ];
        return res.json(mockArticles.map(formatFinnhubArticle));
    }
    // --- End Mock Data Fallback ---
    
    try {
        const category = 'general'; // Suitable for broad market/startup news
        const url = `${FINNHUB_BASE_URL}category=${category}&token=${FINNHUB_API_KEY}`;
        
        const response = await axios.get(url);
        // Finnhub returns an array of news objects directly
        const articles = response.data;

        // Map and format the articles
        const formattedArticles = articles.map(formatFinnhubArticle);

        // Return up to 10 articles
        return res.json(formattedArticles.slice(0, 10));

    } catch (err) {
        console.error('Error fetching news from Finnhub:', err.message);
        return res.status(500).json({ msg: 'Failed to fetch real-time news from Finnhub API.' });
    }
});

module.exports = router;