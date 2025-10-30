// backend/routes/growth.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const GrowthSuggestion = require('../models/GrowthSuggestion');
const Alert = require('../models/Alert'); // Import the Alert model

const AI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`;

// @route   POST api/growth
// @desc    Get new growth suggestions and save them
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  // ✅ FIX: Extract all fields from the request body
  const { industry, stage, idea, targetMarket, currentChallenges } = req.body;
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!industry || !stage || !idea) {
    return res.status(400).json({ msg: 'Industry, stage, and the startup idea are required.' });
  }
  if (!API_KEY) {
    return res.status(500).json({ msg: 'Google AI API key is not configured on the server.' });
  }

  // ✅ FIX: Use all 5 fields in the prompt for better results
  const prompt = `
    Act as an elite, world-class Venture Capital analyst and startup mentor. A founder needs your expert advice.
    Your task is to provide the top 3 most critical and actionable priorities for them based on their specific startup IDEA, industry, and current stage.
    Your advice must be highly specific, unique, and directly tailored to the founder's idea. Do not give generic, pre-written advice.

    **Startup Idea:** "${idea}"
    **Industry:** "${industry}"
    **Stage:** "${stage}"
    ${targetMarket ? `**Target Market:** ${targetMarket}` : ''}
    ${currentChallenges ? `**Current Challenges:** ${currentChallenges}` : ''}

    Provide your response ONLY in a structured JSON format, with no other text before or after the JSON block:
    {
      "product": ["Advice 1", "Advice 2", "Advice 3"],
      "marketing": ["Advice 1", "Advice 2", "Advice 3"],
      "fundraising": ["Advice 1", "Advice 2", "Advice 3"]
    }
  `;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
    }
  };

  try {
    // 1. Call AI Service
    const response = await axios.post(AI_API_ENDPOINT, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    const rawResponse = response.data.candidates[0].content.parts[0].text;
    const cleanedResponse = rawResponse.replace(/```json\n|```/g, '').trim();
    const aiSuggestions = JSON.parse(cleanedResponse);

    // ✅ FIX: Create the complete inputs object to be saved
    const reportInputs = {
      industry,
      stage,
      idea,
      targetMarket: targetMarket || '',
      currentChallenges: currentChallenges || ''
    };

    // 2. Save the report to the database
    const newGrowthSuggestion = new GrowthSuggestion({
      user: req.user.id,
      inputs: reportInputs, // Save the complete inputs object
      suggestions: aiSuggestions,
    });

    await newGrowthSuggestion.save();

    // 3. ✅ Create a new Alert
    try {
      const ideaSnippet = newGrowthSuggestion.inputs.idea.substring(0, 30);
      await new Alert({
        userId: req.user.id,
        message: `Your new growth plan for "${ideaSnippet}..." is ready!`,
        link: '/growth-suggestions'
      }).save();
    } catch (alertErr) {
      console.error('Failed to create growth alert:', alertErr.message);
      // Do not fail the whole request if alert creation fails
    }

    // 4. Return the saved report
    res.status(201).json(newGrowthSuggestion);

  } catch (error) {
    console.error("Error calling Google AI API or saving report:", error.message);
    res.status(500).json({ msg: 'Failed to get and save suggestions.' });
  }
});

// @route   GET api/growth
// @desc    Get all saved growth suggestions for user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const suggestions = await GrowthSuggestion.find({ user: req.user.id }).sort({ date: -1 });
    res.json(suggestions);
  } catch (err) {
    console.error('Error fetching growth suggestions:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/growth/:id
// @desc    Get single saved growth suggestion
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const suggestion = await GrowthSuggestion.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!suggestion) {
      return res.status(4.04).json({ msg: 'Suggestion report not found' });
    }
    res.json(suggestion);
  } catch (err) {
    console.error('Error fetching suggestion report:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid report ID' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/growth/:id
// @desc    Delete a saved growth suggestion
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await GrowthSuggestion.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'Suggestion report not found' });
    }
    res.json({ msg: 'Suggestion report removed successfully' });
  } catch (err) {
    console.error('Error deleting suggestion report:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid report ID' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

