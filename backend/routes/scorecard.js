// backend/routes/scorecard.js
const express = require('express');
const router = express.Router();
const Scorecard = require('../models/Scorecard');
const mongoose = require('mongoose');

// Middleware to check for a valid user ID
const checkAuth = (req, res, next) => {
  // In a real app, this would come from a decoded JWT token or session.
  // For now, we'll get it from the request body or query params.
  const userId = req.body.userId || req.query.userId || req.params.userId;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: 'Authentication failed: User ID is missing or invalid.' });
  }
  req.userData = { userId }; // Attach userId to the request object
  next();
};


// @route   POST /api/scorecards/save
// @desc    Save a new scorecard report to the database
// @access  Private (uses checkAuth middleware)
router.post('/save', checkAuth, async (req, res) => {
  try {
    const {
      startupName,
      overallScore,
      strengths,
      areasForImprovement,
      predictionDetails,
      formDataSnapshot,
      categoryScores // This is an object with confidence, risk, etc.
    } = req.body;

    const newScorecard = new Scorecard({
      userId: req.userData.userId,
      startupName,
      overallScore,
      strengths,
      areasForImprovement,
      predictionDetails,
      formDataSnapshot,
      categoryScores
    });

    const savedScorecard = await newScorecard.save();
    res.status(201).json({ message: 'Scorecard saved successfully!', scorecard: savedScorecard });

  } catch (error) {
    console.error('Error saving scorecard:', error);
    res.status(500).json({ message: 'Failed to save scorecard', error: error.message });
  }
});


// @route   GET /api/scorecards/:userId
// @desc    Get all scorecard reports for a specific user
// @access  Private
router.get('/:userId', checkAuth, async (req, res) => {
    try {
        const scorecards = await Scorecard.find({ userId: req.params.userId }).sort({ createdAt: -1 }); // Sort by newest first
        
        if (!scorecards) {
            return res.status(404).json({ message: 'No scorecards found for this user.' });
        }
        
        res.status(200).json(scorecards);

    } catch (error) {
        console.error('Error fetching scorecards:', error);
        res.status(500).json({ message: 'Failed to fetch scorecards', error: error.message });
    }
});


module.exports = router;
