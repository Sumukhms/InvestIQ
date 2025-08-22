const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// --- Helper function to find competitors ---
const findCompetitors = async (industry, location) => {
    console.log(`Simulating competitor search for: "${industry}" in "${location}"`);
<<<<<<< HEAD
    // This is where you could connect to a real competitor API in the future.
=======
    // In a real application, you would use a service like Google Places API or a business directory API
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
    return [
        { name: 'Global Tech Inc.', strength: 'Dominant market share' },
        { name: 'Innovate Solutions', strength: 'Strong IP portfolio' },
        { name: 'Market Disruptors Co.', strength: 'Agile development cycle' },
    ];
};

// --- Gemini API Helper for Personalized Suggestions ---
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

<<<<<<< HEAD
    // Simulating a high-quality response for development
    return {
=======
    console.log("--- PROMPT FOR PERSONALIZED SUGGESTIONS ---");
    console.log(prompt);

    // In a real application, you would call the Gemini API here.
    // We'll simulate a high-quality response for demonstration.
    const mockGeminiResponse = {
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
        risks: [
            {
                title: "Weakness in Team Composition",
                description: `Your lowest score is Team Strength (${scores.detailedScores.teamStrength}/100). For a ${ventureData.industry} venture, not having a key member with deep domain expertise can be a significant risk.`
            },
            {
                title: "Market Entry Barrier",
                description: "With a high Market Potential score, the market is attractive but likely crowded. Your go-to-market strategy needs to be exceptionally strong."
            }
        ],
        recommendations: [
            {
                title: "Leverage Product Innovation",
                description: `Your highest score is Product Innovation (${scores.detailedScores.productInnovation}/100). Double down on what makes your product unique to attract early adopters.`
            },
            {
                title: "Recruit a Strategic Advisor",
                description: "To address the team weakness, consider bringing on an advisor with a strong network in the " + ventureData.industry + " space."
            }
        ]
    };
};


<<<<<<< HEAD
// --- Route to find competitors (used by NewAnalysisPage) ---
router.get('/competitors', authMiddleware, async (req, res) => {
=======
// @route   GET /api/analysis/competitors
// @desc    Find competitors based on industry and location
// @access  Private
router.get('/competitors', auth, async (req, res) => {
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
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
// --- Create a New Analysis (Main route) ---
router.post('/', authMiddleware, async (req, res) => {
    try {
        const analysisData = { ...req.body, user: req.user.id };

        // STEP 1: Get quantitative scores from ML model
=======
// @route   POST /api/analysis
// @desc    Create a New Analysis (Hybrid Approach)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const analysisData = { ...req.body, user: req.user.id };

        // STEP 1: Get quantitative scores from a specialized ML model
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
        const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:8000/predict';
        const scoringResponse = await axios.post(mlApiUrl, analysisData);

        // STEP 2: Get personalized text insights from Gemini
        const insights = await getPersonalizedInsights(analysisData, scoringResponse.data);

        // STEP 3: Get competitors (This was the missing piece!)
        const competitors = await findCompetitors(analysisData.industry, analysisData.location);

        // STEP 4: Combine everything and save to the database
        const finalAnalysis = new Analysis({
            ...analysisData,
            successPercentage: scoringResponse.data.successPercentage,
            detailedScores: scoringResponse.data.detailedScores,
            risks: insights.risks,
            recommendations: insights.recommendations,
            competitors: competitors, // Ensure competitors are included here
        });

        const savedAnalysis = await finalAnalysis.save();
        res.status(201).json(savedAnalysis);

    } catch (err) {
        console.error('Error in analysis route:', err.response ? err.response.data : err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/analysis
// @desc    Get All Analyses for a User
// @access  Private
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
module.exports = router;
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
module.exports = router;
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38
