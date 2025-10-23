const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String, // e.g., '/competitors'
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add an index on userId and read for fast querying
AlertSchema.index({ userId: 1, read: 1 });
AlertSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', AlertSchema);