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
    industry: {
        type: String,
    },
    location: {
        type: String,
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
    competitors: [{
        name: String,
        strength: String,
    }],
    // --- Fields for Prediction Results ---
    successPercentage: {
        type: Number,
    },
    // NEWLY ADDED FIELD
    detailedScores: {
        marketPotential: Number,
        productInnovation: Number,
        teamStrength: Number,
        financialViability: Number,
    },
    risks: [{
        title: String,
        description: String,
    }, ],
    recommendations: [{
        title: String,
        description: String,
    }, ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
     financials: {
        startingCash: Number,
        monthlyRevenue: Number,
        monthlyExpenses: Number,
        projections: [{
            month: String,
            cashBalance: Number
        }],
        netBurnRate: Number,
        runway: Number
    }
});


module.exports = mongoose.model('Analysis', AnalysisSchema);