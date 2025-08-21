const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// --- Helper function to find competitors ---
const findCompetitors = async (industry, location) => {
    console.log(`Simulating competitor search for: "${industry}" in "${location}"`);
    // This is where you could connect to a real competitor API in the future.
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

    // Simulating a high-quality response for development
    return {
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


// --- Route to find competitors (used by NewAnalysisPage) ---
router.get('/competitors', authMiddleware, async (req, res) => {
    const { industry, location } = req.query;
    if (!industry || !location) {
        return res.status(400).json({ msg: 'Industry and location are required' });
    }
    try {
        const competitors = await findCompetitors(industry, location);
        res.json(competitors);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- Create a New Analysis (Main route) ---
router.post('/', authMiddleware, async (req, res) => {
    try {
        const analysisData = { ...req.body, user: req.user.id };

        // STEP 1: Get quantitative scores from ML model
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

// --- Get All Analyses for a User ---
router.get('/', authMiddleware, async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;