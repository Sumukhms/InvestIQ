// backend/routes/analysis.js

const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// --- Finnhub API Fetchers ---
const fetchMarketNews = async () => {
    if (!FINNHUB_API_KEY) {
        console.error("Finnhub API key not found.");
        return [];
    }
    try {
        const url = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(url);
        return (response.data || []).slice(0, 5);
    } catch (error) {
        console.error("Error fetching news from Finnhub:", error.message);
        return [];
    }
};

const fetchIPOCalendar = async () => {
    if (!FINNHUB_API_KEY) return [];
    try {
        const today = new Date().toISOString().split('T')[0];
        const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const url = `https://finnhub.io/api/v1/calendar/ipo?from=${today}&to=${future}&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(url);
        return (response.data.ipoCalendar || []).slice(0, 5);
    } catch (error) {
        console.error("Error fetching IPO calendar from Finnhub:", error.message);
        return [];
    }
};

const fetchMarketHealth = async () => {
    if (!FINNHUB_API_KEY) return {};
    try {
        const url = `https://finnhub.io/api/v1/quote?symbol=^NDX&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(url);
        return {
            change: response.data.d || 0,
            percentChange: response.data.dp || 0,
            currentPrice: response.data.c || 0
        };
    } catch (error) {
        console.error("Error fetching market health from Finnhub:", error.message);
        return {};
    }
};

// --- API Routes ---

router.get('/market-news', auth, async (req, res) => {
    try {
        const news = await fetchMarketNews();
        res.json(news);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/ipos', auth, async (req, res) => {
    try {
        const ipos = await fetchIPOCalendar();
        res.json(ipos);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/market-health', auth, async (req, res) => {
    try {
        const health = await fetchMarketHealth();
        res.json(health);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- (Your other existing POST and GET routes for analysis, competitors etc. go here) ---
// Make sure the rest of your routes from the previous versions of the file are also present.

module.exports = router;