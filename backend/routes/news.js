// backend/routes/news.js

const express = require('express');
const axios = require('axios');
const router = express.Router();
const cache = require('memory-cache'); // Import the cache library

router.get('/', async (req, res) => {
  try {
    const cachedNews = cache.get('news');
    // If we have cached news, return it immediately
    if (cachedNews) {
      return res.json(cachedNews);
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error("News API key is not configured.");
    }
    
    const query = 'startup funding OR venture capital OR technology OR acquisition';
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    const response = await axios.get(url);
    const articles = response.data.articles;

    // --- NEW: Put the fresh news into the cache for 10 minutes ---
    // The duration is in milliseconds (10 * 60 * 1000 = 10 minutes)
    cache.put('news', articles, 10 * 60 * 1000);
    
    res.json(articles);

  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ message: "Failed to fetch news articles." });
  }
});

module.exports = router;