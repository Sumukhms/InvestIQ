const express = require('express');
const axios = require('axios'); // Import axios
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

// --- Create a New Analysis & Get Prediction ---
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { startupName, website, pitch, problem, marketSize, fundingStage, revenue } = req.body;

        // 1. Save the initial analysis details to our database
        const newAnalysis = new Analysis({
            user: req.user.id,
            startupName,
            website,
            pitch,
            problem,
            marketSize,
            fundingStage,
            revenue,
        });
        let analysis = await newAnalysis.save();

        // 2. Prepare data and call the FastAPI ML model
        const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:8000/predict';
        const mlResponse = await axios.post(mlApiUrl, {
            fundingStage: analysis.fundingStage,
            revenue: analysis.revenue,
        });

        // 3. Update the analysis with the prediction results from the ML model
        analysis.successPercentage = mlResponse.data.successPercentage;
        analysis.risks = mlResponse.data.risks;
        analysis.recommendations = mlResponse.data.recommendations;

        // 4. Save the updated analysis and send it back to the frontend
        const updatedAnalysis = await analysis.save();
        
        res.status(201).json(updatedAnalysis);

    } catch (err) {
        console.error('Error in analysis route:', err.message);
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
