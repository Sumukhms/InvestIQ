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

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analysis', require('./routes/analysis')); // Add analysis routes

// Test endpoint to ensure the API is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the InvestIQ backend!' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend API is running');
});

const analysisRoutes = require('./routes/analysis');

// ... (existing code)

// Define Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/financials', require('./routes/analysis')); // Add this line


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
