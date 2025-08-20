const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// --- Helper function to find competitors ---
const findCompetitors = async (industry, location) => {
    console.log(`Simulating competitor search for: "${industry}" in "${location}"`);
    return [
        { name: 'Global Tech Inc.', strength: 'Dominant market share' },
        { name: 'Innovate Solutions', strength: 'Strong IP portfolio' },
    ];
};

// --- NEW: Gemini API Helper for Personalized Suggestions ---
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
    // We'll simulate a high-quality response.
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


// --- Route to find competitors ---
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

// --- Create a New Analysis (Hybrid Approach) ---
router.post('/', authMiddleware, async (req, res) => {
    try {
        const analysisData = { ...req.body, user: req.user.id };

        // STEP 1: Get quantitative scores from our specialized ML model
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