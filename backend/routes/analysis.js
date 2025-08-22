const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// --- Helper function to find competitors ---
const findCompetitors = async (industry, location) => {
    console.log(`Simulating competitor search for: "${industry}" in "${location}"`);
    // In a real application, you would use a service like Google Places API or a business directory API
    return [
        { name: 'Global Tech Inc.', strength: 'Dominant market share' },
        { name: 'Innovate Solutions', strength: 'Strong IP portfolio' },
    ];
};

<<<<<<< HEAD
// --- Gemini API Helper for Personalized Suggestions (MOCK) ---
=======
// --- Gemini API Helper for Personalized Suggestions ---
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
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


<<<<<<< HEAD
// --- Route to find competitors ---
=======
// @route   GET /api/analysis/competitors
// @desc    Find competitors based on industry and location
// @access  Private
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
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

<<<<<<< HEAD
// --- Create a New Analysis (Hybrid Approach) ---
=======
// @route   POST /api/analysis
// @desc    Create a New Analysis (Hybrid Approach)
// @access  Private
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
router.post('/', auth, async (req, res) => {
    try {
        const analysisData = { ...req.body, user: req.user.id };

        // STEP 1: Get quantitative scores from a specialized ML model
        const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:8000/predict';
        const scoringResponse = await axios.post(mlApiUrl, analysisData);

        // STEP 2: Get personalized text insights from the generative AI
        const insights = await getPersonalizedInsights(analysisData, scoringResponse.data);

        // STEP 3: Combine everything and save to the database
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

<<<<<<< HEAD
// --- Get All Analyses for a User ---
=======
// @route   GET /api/analysis
// @desc    Get All Analyses for a User
// @access  Private
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
router.get('/', auth, async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


<<<<<<< HEAD
// @route   POST /api/financials/analyze
// @desc    Analyze startup financials and generate projections
// @access  Private
router.post('/analyze', auth, async (req, res) => {
    try {
        const { startingCash, monthlyRevenue, monthlyExpenses, projectionMonths } = req.body;

        // Perform calculations here
        const netBurnRate = monthlyExpenses - monthlyRevenue;
        const runway = netBurnRate > 0 ? startingCash / netBurnRate : Infinity;

        let projectedData = [];
        let currentCash = startingCash;

        for (let i = 1; i <= projectionMonths; i++) {
            currentCash -= netBurnRate;
            projectedData.push({
                month: `Month ${i}`,
                cashBalance: currentCash
            });
        }

        res.json({
            netBurnRate,
            runway,
            projections: projectedData
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- NEW: Route for AI Idea Generation ---
router.post('/generate-idea', auth, async (req, res) => {
=======
// @route   POST /api/analysis/generate-idea
// @desc    Route for AI Idea Generation
// @access  Private
router.post('/generate-idea', auth, async (req, res) => { // Fixed: Changed authMiddleware to auth
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
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

<<<<<<< HEAD
// --- NEW: Route for AI Market Size Estimation ---
router.post('/market-size', auth, async (req, res) => {
=======
// @route   POST /api/analysis/market-size
// @desc    Route for AI Market Size Estimation
// @access  Private
router.post('/market-size', auth, async (req, res) => { // Fixed: Changed authMiddleware to auth
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
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

<<<<<<< HEAD
=======
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
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
module.exports = router;
