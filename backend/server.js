// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// --- API Routes (Corrected and Cleaned) ---
// All routes starting with /api/auth will be handled by auth.js
app.use('/api/auth', require('./routes/auth'));

// All routes starting with /api/analysis will be handled by analysis.js
app.use('/api/analysis', require('./routes/analysis'));

// All routes starting with /api/financials will be handled by financials.js
app.use('/api/financials', require('./routes/financials'));


// Test endpoint to ensure the API is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the InvestIQ backend!' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend API is running');
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));