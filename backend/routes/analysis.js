const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

const generateMlInputs = (formData) => {
    let funding_total_usd = 500000;
    let funding_rounds = 1;
    let teamSizeEffect = (formData.teamSize || 1) * 100000;
    if (formData.fundingStage === 'Seed') {
        funding_total_usd = 2000000 + teamSizeEffect;
        funding_rounds = 2;
    } else if (formData.fundingStage === 'Series A') {
        funding_total_usd = 10000000 + teamSizeEffect;
        funding_rounds = 3;
    }
    if (formData.developmentStage === 'Live' || formData.currentTraction !== 'None') {
        funding_total_usd *= 1.5;
    }
    const isMajorHub = ['San Francisco, CA', 'New York, NY', 'Bengaluru, Karnataka'].includes(formData.location);
    return {
        name: formData.startupName || "Unnamed Startup",
        funding_total_usd: Math.round(funding_total_usd),
        status: "operating", country_code: isMajorHub ? "USA" : "IND",
        state_code: isMajorHub ? "CA" : "KA",
        region: formData.location || "Unknown",
        city: formData.location ? formData.location.split(',')[0] : "Unknown",
        funding_rounds: funding_rounds,
        founded_at: "2021-01-01",
        first_funding_at: "2022-01-01",
        last_funding_at: "2023-01-01",
        main_category: formData.industry || "Software"
    };
};

// --- CORRECTED ROUTE ORDER ---
// Specific routes MUST come BEFORE general routes like /:id

// @route   GET /api/analysis/competitors (SPECIFIC)
router.get('/competitors', auth, async (req, res) => {
    const { industry, location } = req.query;
    if (!industry || !location) {
        return res.status(400).json({ msg: 'Industry and location are required' });
    }
    const mockCompetitors = {
        "fintech": [{ name: 'Stripe' }], "healthtech": [{ name: 'Teladoc' }],
        "saas": [{ name: 'Salesforce' }], "ecommerce": [{ name: 'Shopify' }],
        "devops & cloud computing": [{ name: 'AWS' }, { name: 'GCP' }],
        "social networking": [{ name: 'Meta' }, { name: 'TikTok' }]
    };
    res.json(mockCompetitors[industry.toLowerCase()] || []);
});

// @route   POST /api/analysis (SPECIFIC)
router.post('/', auth, async (req, res) => {
    try {
        const frontendData = req.body;
        const dataForMlApi = generateMlInputs(frontendData);
        
        const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:8000/predict';
        const scoringResponse = await axios.post(mlApiUrl, dataForMlApi);
        
        const insights = { risks: [{title: "Market Competition", description:"The market is competitive."}], recommendations: [{title:"Focus on Niche", description:"Focus on a niche market."}]};

        const finalAnalysis = new Analysis({
            ...frontendData,
            user: req.user.id,
            successPercentage: scoringResponse.data.success_probability,
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

// @route   GET /api/analysis (GENERAL)
router.get('/', auth, async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/analysis/:id (GENERAL with parameter)
// This route MUST be last.
router.get('/:id', auth, async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);
        if (!analysis || analysis.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Analysis not found' });
        }
        res.json(analysis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;