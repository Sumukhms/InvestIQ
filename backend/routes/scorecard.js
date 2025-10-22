const express = require('express');
const router = express.Router();
const Scorecard = require('../models/Scorecard');
const auth = require('../middleware/auth'); // <-- CORRECT: Using the JWT auth middleware

// @route   POST /api/scorecard
// @desc    Save a new scorecard report for the logged-in user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Destructure the fields matching the new Scorecard model and frontend
    const {
      startupName,
      formData,
      prediction 
    } = req.body;

    // The user's ID comes from the 'auth' middleware
    const newScorecard = new Scorecard({
      user: req.user.id, // <-- CORRECT: Use 'user' field and get ID from auth middleware
      startupName,
      formData,
      prediction,
    });

    const savedScorecard = await newScorecard.save();
    res.status(201).json({ message: 'Scorecard saved successfully!', scorecard: savedScorecard });

  } catch (error) {
    console.error('Error saving scorecard:', error);
    res.status(500).json({ message: 'Failed to save scorecard', error: error.message });
  }
});


// @route   GET /api/scorecard/history
// @desc    Get all scorecard reports for the logged-in user
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
      // Find scorecards matching the user ID from the token
      const scorecards = await Scorecard.find({ user: req.user.id }).sort({ date: -1 }); // Sort by newest first
      
      if (!scorecards) {
        // This case is unlikely, it would just return an empty array, but it's safe to have
        return res.status(404).json({ message: 'No scorecards found for this user.' });
      }
      
      res.status(200).json(scorecards);

    } catch (error) {
      console.error('Error fetching scorecards:', error);
      res.status(500).json({ message: 'Failed to fetch scorecards', error: error.message });
    }
});


module.exports = router;
