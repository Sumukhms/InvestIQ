// backend/routes/analysis.js

const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// --- NEW CODE BLOCK TO FETCH NEWS FROM FINNHUB ---
const fetchMarketNews = async () => {
    try {
        const apiKey = process.env.FINNHUB_API_KEY;
        if (!apiKey) {
            console.error("Finnhub API key not found in .env file.");
            return []; // Return empty if no key
        }
        // 'general' is the category for general market news.
        const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
        const response = await axios.get(url);
        
        // Return the first 5 news articles
        return response.data.slice(0, 5);
    } catch (error) {
        console.error("Error fetching news from Finnhub:", error.message);
        return []; // Return an empty array on error
    }
};

// @route   GET /api/analysis/market-news
// @desc    Get the latest tech and market news from Finnhub
// @access  Private
router.get('/market-news', auth, async (req, res) => {
    try {
        const news = await fetchMarketNews();
        res.json(news);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// --- END OF NEW CODE BLOCK ---


// --- ALL YOUR EXISTING CODE REMAINS THE SAME ---

// --- Helper function to find competitors (Your existing code) ---
const findCompetitors = async (industry, location) => {
    console.log(`Simulating competitor search for: "${industry}" in "${location}"`);
    return [
        { name: 'Global Tech Inc.', strength: 'Dominant market share' },
        { name: 'Innovate Solutions', strength: 'Strong IP portfolio' },
    ];
};

// --- Gemini API Helper for Personalized Suggestions (Your existing code) ---
const getPersonalizedInsights = async (ventureData, scores) => {
    const prompt = `
        Analyze the following startup venture based on the data and scores provided.
        Your goal is to provide highly specific, actionable advice.

        Venture Data:
        - Name: ${ventureData.startupName}
        - Industry: ${ventureData.industry}
        - Pitch: "${ventureData.pitch}"
        - Key Scores: 
            - Market Potential: ${scores.detailedScores.marketPotential}/100
            - Product Innovation: ${scores.detailedScores.productInnovation}/100
            - Team Strength: ${scores.detailedScores.teamStrength}/100
            - Financial Viability: ${scores.detailedScores.financialViability}/100

        Based on this, generate:
        1.  Two "risks" with a "title" and a "description". The risks should be specific to the venture's industry and weakest scores.
        2.  Two "recommendations" with a "title" and a "description". The recommendations should be actionable and help the founder leverage their strengths and address their weaknesses.

        Return nothing but a JSON object with "risks" and "recommendations" keys.
    `;
    const mockGeminiResponse = {
        risks: [
            {
                title: "Weakness in Team Composition",
                description: `Your lowest score is Team Strength (${scores.detailedScores.teamStrength}/100). For a ${ventureData.industry} venture, not having a key member with deep domain expertise or a strong sales background can be a significant risk.`
            },
            {
                title: "Market Entry Barrier",
                description: "With a high Market Potential score, the market is attractive but likely crowded. Your go-to-market strategy needs to be exceptionally strong to stand out."
            }
        ],
        recommendations: [
            {
                title: "Leverage Product Innovation",
                description: `Your highest score is Product Innovation (${scores.detailedScores.productInnovation}/100). Double down on what makes your product unique. Create marketing content that showcases this innovation to attract early adopters.`
            },
            {
                title: "Recruit a Strategic Advisor",
                description: "To address the team weakness, consider bringing on an advisor with a strong network in the " + ventureData.industry + " space. This can provide immediate credibility and strategic guidance."
            }
        ]
    };
    return mockGeminiResponse;
};

// --- ALL YOUR OTHER ROUTES (Unchanged) ---
router.get('/competitors', auth, async (req, res) => {
    const { industry, location } = req.query;
    if (!industry || !location) {
        return res.status(400).json({ msg: 'Industry and location are required' });
    }
    try {
        const competitors = await findCompetitors(industry, location);
        res.json(competitors);
    } catch (err) {
        console.error('Error finding competitors:', err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const analysisData = { ...req.body, user: req.user.id };
        const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:8000/predict';
        const scoringResponse = await axios.post(mlApiUrl, analysisData);
        const insights = await getPersonalizedInsights(analysisData, scoringResponse.data);
        const finalAnalysis = new Analysis({
            ...analysisData,
            successPercentage: scoringResponse.data.successPercentage,
            detailedScores: scoringResponse.data.detailedScores,
            risks: insights.risks,
            recommendations: insights.recommendations,
        });
        const savedAnalysis = await finalAnalysis.save();
        res.status(201).json(savedAnalysis);
    } catch (err) {
        console.error('Error in analysis route:', err.response ? err.response.data : err.message);
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

router.post('/generate-idea', auth, async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) {
        return res.status(400).json({ msg: 'A keyword is required.' });
    }
    try {
        const mockIdeas = [
            `An AI-powered meal planning app for busy professionals focused on ${keyword}.`,
            `A subscription box service for eco-friendly products related to ${keyword}.`,
            `A virtual reality (VR) training platform for skills in the ${keyword} industry.`
        ];
        res.json({ ideas: mockIdeas });
    } catch (err) {
        console.error('Error generating ideas:', err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/market-size', auth, async (req, res) => {
    const { industry } = req.body;
    if (!industry) {
        return res.status(400).json({ msg: 'An industry is required.' });
    }
    try {
        const marketData = {
            "fintech": { tam: "$12.5 Trillion", insight: "Driven by digital payments and neo-banking." },
            "healthtech": { tam: "$660 Billion", insight: "Growing rapidly due to AI in diagnostics and telehealth." },
            "agritech": { tam: "$25 Billion", insight: "Focus on sustainability and supply chain optimization." },
            "saas": { tam: "$1.2 Trillion", insight: "Dominated by enterprise software, with growing SMB adoption." }
        };
        const result = marketData[industry.toLowerCase()] || { tam: "N/A", insight: "Select a core industry to see an estimate." };
        res.json(result);
    } catch (err) {
        console.error('Error estimating market size:', err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/financial-analyze', auth, async (req, res) => {
    try {
        const { startingCash, monthlyRevenue, monthlyExpenses, projectionMonths } = req.body;
        if (startingCash == null || monthlyRevenue == null || monthlyExpenses == null || projectionMonths == null) {
            return res.status(400).json({ msg: 'Please provide all required financial fields.' });
        }
        const netBurnRate = monthlyExpenses - monthlyRevenue;
        const runway = netBurnRate > 0 ? startingCash / netBurnRate : Infinity;
        let projectedData = [];
        let currentCash = startingCash;
        for (let i = 1; i <= projectionMonths; i++) {
            currentCash -= netBurnRate;
            projectedData.push({
                month: `Month ${i}`,
                cashBalance: currentCash.toFixed(2)
            });
        }
        res.json({
            netBurnRate: netBurnRate.toFixed(2),
            runway: runway === Infinity ? 'Infinite' : runway.toFixed(2),
            projections: projectedData
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;