// backend/routes/analysis.js

const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

<<<<<<< HEAD
// --- Finnhub API Fetchers ---
const fetchMarketNews = async () => {
    if (!FINNHUB_API_KEY) {
        console.error("Finnhub API key not found.");
        return [];
=======
// --- Helper function to find competitors ---
const findCompetitors = async (industry, location) => {
    console.log(`Simulating competitor search for: "${industry}" in "${location}"`);
    
    // In a real application, you would use a service like Google Places API or a business directory API.
    // For now, we'll use a more detailed mock database.
    const mockCompetitorDB = {
        "fintech": [
            { name: 'Stripe', strength: 'Developer-friendly APIs' },
            { name: 'PayPal', strength: 'Global brand recognition' },
            { name: 'Square', strength: 'Strong presence in SMB payment processing' },
        ],
        "healthtech": [
            { name: 'Teladoc Health', strength: 'Leading telehealth platform' },
            { name: 'Cerner Corporation', strength: 'Dominant in electronic health records (EHR)' },
        ],
        "saas": [
            { name: 'Salesforce', strength: 'Market leader in CRM' },
            { name: 'Microsoft 365', strength: 'Ubiquitous in enterprise productivity' },
        ],
        "agritech": [
            { name: 'John Deere', strength: 'Hardware and precision agriculture leader' },
            { name: 'Farmers Business Network', strength: 'Strong data and analytics platform' },
        ]
    };

    const industryKey = industry.toLowerCase();
    const competitors = mockCompetitorDB[industryKey] || [
        { name: 'General Competitor A', strength: 'Broad market appeal' },
        { name: 'General Competitor B', strength: 'Strong brand loyalty' },
    ];
    
    // Simulate location-based filtering (optional, for more realism)
    if (location.toLowerCase().includes("san francisco")) {
        competitors.push({ name: 'SF-Based Rival', strength: 'Access to venture capital' });
    }

    return competitors.slice(0, 2); // Return the top 2-3 competitors
};


// --- Gemini API Helper for Personalized Suggestions ---
const getPersonalizedInsights = async (ventureData, scores) => {
    // Construct a detailed prompt with all available data for the best results
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

    console.log("--- PROMPT FOR PERSONALIZED SUGGESTIONS ---");
    console.log(prompt);

    // In a real application, you would call the Gemini API here.
    // We'll simulate a high-quality response for demonstration.
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


// @route   GET /api/analysis/competitors
// @desc    Find competitors based on industry and location
// @access  Private
router.get('/competitors', auth, async (req, res) => {
    const { industry, location } = req.query;
    if (!industry || !location) {
        return res.status(400).json({ msg: 'Industry and location are required' });
>>>>>>> 840abb684ac1614125eaf4daddf5be7b6708bea7
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

<<<<<<< HEAD
=======
// @route   POST /api/analysis/generate-idea
// @desc    Route for AI Idea Generation
// @access  Private
router.post('/generate-idea', auth, async (req, res) => { // Fixed: Changed authMiddleware to auth
    const { keyword } = req.body;

    if (!keyword) {
        return res.status(400).json({ msg: 'A keyword is required.' });
    }

    try {
        // In a real application, this prompt would be sent to the Gemini API.
        console.log(`Simulating AI idea generation for keyword: "${keyword}"`);

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

// @route   POST /api/analysis/market-size
// @desc    Route for AI Market Size Estimation
// @access  Private
router.post('/market-size', auth, async (req, res) => { // Fixed: Changed authMiddleware to auth
    const { industry } = req.body;
    if (!industry) {
        return res.status(400).json({ msg: 'An industry is required.' });
    }
    try {
        console.log(`Simulating AI market size estimation for: "${industry}"`);
        
        // Mock data for different industries
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

// @route   POST /api/analysis/financial-analyze
// @desc    Analyze startup financials and generate projections
// @access  Private
router.post('/financial-analyze', auth, async (req, res) => { // Changed route to be more specific
    try {
        const { startingCash, monthlyRevenue, monthlyExpenses, projectionMonths } = req.body;

        // Basic validation
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
                cashBalance: currentCash.toFixed(2) // Format to 2 decimal places
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

// Fixed: Only one module.exports at the end of the file
>>>>>>> 840abb684ac1614125eaf4daddf5be7b6708bea7
module.exports = router;