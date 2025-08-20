const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// --- Helper function to find competitors ---
const findCompetitors = async (industry, location) => {
    // This is a placeholder for a real search API call
    console.log(`Simulating competitor search for: "${industry}" in "${location}"`);
    return [
        { name: 'Global Tech Inc.', strength: 'Dominant market share' },
        { name: 'Innovate Solutions', strength: 'Strong IP portfolio' },
        { name: 'NextGen Startups', strength: 'Rapidly growing user base' },
    ];
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
        console.error('Error fetching competitors:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- Create a New Analysis & Get Prediction ---
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { startupName, website, pitch, problem, industry, location, marketSize, fundingStage, revenue, competitors } = req.body;

        // 1. Save initial data to the database
        const newAnalysis = new Analysis({
            user: req.user.id,
            startupName, website, pitch, problem, industry, location, marketSize, fundingStage, revenue, competitors
        });
        let analysis = await newAnalysis.save();

        // 2. Call the FastAPI ML model with the complete data
        const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:8000/predict';
        const mlResponse = await axios.post(mlApiUrl, {
            startupName, pitch, problem, industry, location, marketSize, fundingStage, revenue, competitors
        });
        
        // 3. Update the analysis with the dynamic prediction results
        analysis.successPercentage = mlResponse.data.successPercentage;
        analysis.detailedScores = mlResponse.data.detailedScores; // Save detailed scores
        analysis.risks = mlResponse.data.risks;
        analysis.recommendations = mlResponse.data.recommendations;

        const updatedAnalysis = await analysis.save();
        
        res.status(201).json(updatedAnalysis);

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