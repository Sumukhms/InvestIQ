const mongoose = require('mongoose');

const CompetitorReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  competitorName: {
    type: String,
    required: true,
  },
  competitorData: {
    type: Object, // Or a more detailed schema
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CompetitorReport', CompetitorReportSchema);