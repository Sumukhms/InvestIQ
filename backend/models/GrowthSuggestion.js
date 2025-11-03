// backend/models/GrowthSuggestion.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrowthSuggestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Store the inputs used to generate the report
  inputs: {
    type: {
      idea: { type: String, required: true },
      industry: { type: String, required: true },
      stage: { type: String, required: true },
      // ✅ ADDED missing fields to match the frontend form
      targetMarket: { type: String, default: '' },
      currentChallenges: { type: String, default: '' },
    },
    required: true,
  },
  // Store the AI-generated suggestions
  suggestions: {
    type: {
      product: { type: [String], default: [] },
      marketing: { type: [String], default: [] },
      fundraising: { type: [String], default: [] },
    },
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

GrowthSuggestionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('GrowthSuggestion', GrowthSuggestionSchema);
