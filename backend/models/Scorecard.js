// backend/models/Scorecard.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScorecardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // --- MODIFIED: Use startup_name from the form ---
  startupName: {
    type: String,
    required: true,
  },
  // --- NEW: Store the full form data object ---
  formData: {
    // Basic Info
    startup_name: String,
    problem_statement: String,
    category_code: String,
    
    // Funding & Financials
    funding_total_usd: Number,
    funding_rounds: Number,
    avg_participants: Number,
    is_top500: Number, // 0 or 1
    
    // Milestones & Network
    milestones: Number,
    relationships: Number,
    age_first_milestone_year: Number,
    age_last_milestone_year: Number,
    
    // Timeline
    founded_at: String, // Storing as string from date input
    first_funding_at: String,
    last_funding_at: String,

    // Advanced
    has_roundA: Number, // 0 or 1
    has_roundB: Number,
    has_roundC: Number,
    has_roundD: Number,
  },
  // --- MODIFIED: Store the new prediction object structure ---
  prediction: {
    prediction_label: String, // 'Success' or 'Failure'
    success_probability: Number, // The score e.g., 85.34
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scorecard', ScorecardSchema);
