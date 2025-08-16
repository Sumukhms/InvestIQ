const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startupName: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    pitch: {
        type: String,
        required: true,
    },
    problem: {
        type: String,
        required: true,
    },
    marketSize: {
        type: String,
    },
    fundingStage: {
        type: String,
    },
    revenue: {
        type: Number,
    },
    // --- Fields for Prediction Results ---
    successPercentage: {
        type: Number,
    },
    risks: [
        {
            title: String,
            description: String,
        },
    ],
    recommendations: [
        {
            title: String,
            description: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
