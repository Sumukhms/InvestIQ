const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Scorecard = require('../models/Scorecard');
const Alert = require('../models/Alert');

const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:5001/predict';

// @route   POST api/scorecard
// @desc    Create a new scorecard
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const formData = req.body;
  const startupName = formData.startup_name || 'Unnamed Startup';

  try {
    // 1. Call ML Service
    let predictionData;
    try {
      const mlResponse = await axios.post(ML_API_URL, formData, { timeout: 10000 });
      const rawPrediction = mlResponse.data;

      // ✅ FIX: ML model returns percentage (0-100), normalize to decimal (0-1)
      predictionData = {
        prediction_label: rawPrediction.prediction === 'Success' ? 'Success' : 'Failure',
        success_probability: rawPrediction.success_probability / 100, // Convert percentage to decimal
        confidence: rawPrediction.confidence,
        risk_level: rawPrediction.risk_level,
        recommendation: rawPrediction.recommendation,
        model_version: rawPrediction.model_version
      };

      console.log('Raw ML Response:', rawPrediction.success_probability + '%');
      console.log('Normalized to:', predictionData.success_probability);

      // Validate normalized probability is in valid range
      if (predictionData.success_probability < 0 || predictionData.success_probability > 1) {
        throw new Error('Invalid probability range after normalization');
      }

    } catch (mlError) {
      console.error('ML Service Error:', mlError.message);
      const status = mlError.code === 'ECONNREFUSED' ? 503 : 500;
      const message = mlError.code === 'ECONNREFUSED'
        ? 'The AI prediction service is currently unavailable.'
        : 'Failed to get prediction from AI service.';
      return res.status(status).json({ msg: message });
    }

    // 2. Save scorecard with normalized data
    const newScorecard = new Scorecard({
      user: req.user.id,
      startupName: startupName,
      formData: formData,
      prediction: predictionData,
    });

    await newScorecard.save();

    // 3. Create alert with correct percentage display
    const successProb = newScorecard.prediction.success_probability || 0;
    await new Alert({
      userId: req.user.id,
      message: `Your scorecard for "${newScorecard.startupName}" is complete! Success Score: ${(successProb * 100).toFixed(0)}%`,
      link: `/scorecard-result/${newScorecard._id}`
    }).save();

    // 4. Return saved scorecard
    res.status(201).json(newScorecard);

  } catch (error) {
    console.error('Error in scorecard route:', error);
    res.status(500).json({ msg: 'Server Error: Could not save scorecard.' });
  }
});

// @route   GET api/scorecard
// @desc    Get all scorecards for user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const scorecards = await Scorecard.find({ user: req.user.id }).sort({ date: -1 });
    res.json(scorecards);
  } catch (err) {
    console.error('Error fetching scorecards:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/scorecard/:id
// @desc    Get single scorecard
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const scorecard = await Scorecard.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!scorecard) {
      return res.status(404).json({ msg: 'Scorecard not found' });
    }

    res.json(scorecard);
  } catch (err) {
    console.error('Error fetching scorecard:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid scorecard ID' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/scorecard/:id
// @desc    Delete scorecard
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Scorecard.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'Scorecard not found' });
    }
    
    res.json({ msg: 'Scorecard removed successfully' });
  } catch (err) {
    console.error('Error deleting scorecard:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid scorecard ID' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;