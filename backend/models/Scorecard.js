const mongoose = require('mongoose');

const scorecardSchema = new mongoose.Schema({
  // Link to the user who owns this scorecard
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  // The name of the startup being evaluated
  startupName: {
    type: String,
    required: true,
    trim: true,
  },
  // The final calculated score
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  // An object to hold the scores for each category
  categoryScores: {
    team: { type: Number, min: 0, max: 100 },
    product: { type: Number, min: 0, max: 100 },
    market: { type: Number, min: 0, max: 100 },
    financials: { type: Number, min: 0, max: 100 },
  },
  // An array of strings highlighting the startup's strengths
  strengths: [
    {
      type: String,
      trim: true,
    },
  ],
  // An array of strings for areas needing improvement
  areasForImprovement: [
    {
      type: String,
      trim: true,
    },
  ],
  // The date the scorecard was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Scorecard = mongoose.model('Scorecard', scorecardSchema);

module.exports = Scorecard;
