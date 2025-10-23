// backend/models/Scorecard.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScorecardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // ✅ Added index for faster queries
  },
  startupName: {
    type: String,
    required: true,
    trim: true, // ✅ Automatically trim whitespace
  },
  // ✅ FIXED: Properly nested schema for formData with explicit type definitions
  formData: {
    type: {
      // Basic Info
      startup_name: { type: String, trim: true },
      problem_statement: { type: String, default: '' },
      category_code: { type: String, default: 'software' },
      
      // Funding & Financials
      funding_total_usd: { type: Number, default: 0 },
      funding_rounds: { type: Number, default: 0 },
      avg_participants: { type: Number, default: 0 },
      is_top500: { type: Number, default: 0, min: 0, max: 1 }, // ✅ Added validation
      
      // Milestones & Network
      milestones: { type: Number, default: 0 },
      relationships: { type: Number, default: 0 },
      age_first_milestone_year: { type: Number, default: 0 },
      age_last_milestone_year: { type: Number, default: 0 },
      
      // Timeline - ✅ Changed to Date type for proper date handling
      founded_at: { type: String, default: '' }, // Keep as String since frontend sends date strings
      first_funding_at: { type: String, default: '' },
      last_funding_at: { type: String, default: '' },

      // Advanced - ✅ Added validation for binary values
      has_roundA: { type: Number, default: 0, min: 0, max: 1 },
      has_roundB: { type: Number, default: 0, min: 0, max: 1 },
      has_roundC: { type: Number, default: 0, min: 0, max: 1 },
      has_roundD: { type: Number, default: 0, min: 0, max: 1 },
    },
    required: true, // ✅ Make formData required
  },
  // ✅ FIXED: Properly nested prediction schema with all ML model fields
  prediction: {
    type: {
      prediction_label: { 
        type: String, 
        required: true,
        enum: ['Success', 'Failure'],
      },
      success_probability: { 
        type: Number, 
        required: true,
        min: 0,
        max: 1,
      },
      confidence: { 
        type: String, 
        enum: ['Very Low', 'Low', 'Medium', 'High'],
        default: 'Medium' 
      },
      risk_level: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
      },
      recommendation: {
        type: String,
        default: 'Review required'
      },
      model_version: {
        type: String,
        default: 'Unknown'
      }
    },
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true, // ✅ Added index for sorting queries
  },
});

// ✅ ADDED: Compound index for user + date for efficient dashboard queries
ScorecardSchema.index({ user: 1, date: -1 });

// ✅ ADDED: Virtual for calculating age in months (useful for analytics)
ScorecardSchema.virtual('ageInMonths').get(function() {
  return Math.floor((Date.now() - this.date.getTime()) / (1000 * 60 * 60 * 24 * 30));
});

// ✅ ADDED: Instance method to check if prediction is successful
ScorecardSchema.methods.isSuccess = function() {
  return this.prediction.prediction_label === 'Success';
};

// ✅ ADDED: Instance method to get formatted success percentage
ScorecardSchema.methods.getSuccessPercentage = function() {
  return (this.prediction.success_probability * 100).toFixed(1);
};

// ✅ ADDED: Static method to get user statistics
ScorecardSchema.statics.getUserStats = async function(userId) {
  const scorecards = await this.find({ user: userId });
  
  if (scorecards.length === 0) {
    return {
      total: 0,
      avgSuccessScore: 0,
      successfulPredictions: 0,
      failedPredictions: 0,
    };
  }

  const total = scorecards.length;
  const avgSuccessScore = scorecards.reduce((sum, sc) => 
    sum + (sc.prediction.success_probability * 100), 0) / total;
  const successfulPredictions = scorecards.filter(sc => 
    sc.prediction.prediction_label === 'Success').length;
  const failedPredictions = total - successfulPredictions;

  return {
    total,
    avgSuccessScore: avgSuccessScore.toFixed(1),
    successfulPredictions,
    failedPredictions,
  };
};

// ✅ ADDED: Pre-save hook to ensure data consistency
ScorecardSchema.pre('save', function(next) {
  // Ensure startupName matches formData.startup_name
  if (this.formData && this.formData.startup_name) {
    this.startupName = this.formData.startup_name;
  }
  next();
});

module.exports = mongoose.model('Scorecard', ScorecardSchema);