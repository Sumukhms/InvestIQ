// backend/models/FinancialReport.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FinancialReportSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  reportName: {
    type: String,
    required: true,
    trim: true,
  },
  // Using Mixed type to allow storing flexible JSON data
  reportData: {
    type: Schema.Types.Mixed,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

FinancialReportSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('FinancialReport', FinancialReportSchema);