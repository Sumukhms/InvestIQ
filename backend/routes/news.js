// backend/routes/news.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

// This endpoint will fetch real-time news
router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error("News API key is not configured.");
    }
    
    // We'll search for topics relevant to your app like "startup funding", "venture capital", etc.
    const query = 'startup funding OR venture capital OR technology OR acquisition';
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    const response = await axios.get(url);
    
    // Send the articles back to the frontend
    res.json(response.data.articles);

  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ message: "Failed to fetch news articles." });
  }
});

module.exports = router;