const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startupName: {
    type: String,
    required: true,
  },
  prediction: String,
  success_probability: Number,
  confidence: String,
  risk_level: String,
  recommendation: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prediction', PredictionSchema);