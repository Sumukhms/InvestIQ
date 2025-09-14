const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startupName: { type: String, required: true },
  website: { type: String, required: true },
  elevatorPitch: { type: String, required: true },
  problemItSolves: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  targetMarketSize: { type: Number, required: true },
  founderBios: { type: String, default: '' },
  teamSize: { type: Number, default: 1 },
  developmentStage: { type: String, enum: ['Idea', 'Prototype', 'MVP', 'Live'], default: 'Idea' },
  uniqueSellingProposition: { type: String, default: '' },
  goToMarketStrategy: { type: String, default: '' },
  revenueModel: { type: String, default: '' },
  currentTraction: { type: String, default: 'None' },
  fundingStage: { type: String, enum: ['Pre-seed', 'Seed', 'Series A'], default: 'Pre-seed' },
  successPercentage: { type: Number },
  detailedScores: { type: Object },
  risks: { type: Array },
  recommendations: { type: Array },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);