// backend/models/Scorecard.js
const mongoose = require('mongoose');

const ScorecardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startupName: {
    type: String,
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
  },
  categoryScores: {
    type: Object, // Stores confidence, risk, etc.
  },
  strengths: {
    type: [String],
    default: [],
  },
  areasForImprovement: {
    type: [String],
    default: [],
  },
  // Store the full prediction and form data for detailed historical review
  predictionDetails: {
      type: Object,
  },
  formDataSnapshot: {
      type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scorecard', ScorecardSchema);
