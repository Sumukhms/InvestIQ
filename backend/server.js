// backend/server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Scorecard = require('./models/Scorecard'); // Import the Scorecard model

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// The connection string is now securely loaded from the .env file
const mongoURI = process.env.MONGO_URI;

// Check if the MONGO_URI is loaded correctly
if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined. Make sure you have a .env file with the connection string.');
  process.exit(1); // Exit the application if the connection string is missing
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- API Routes ---
app.get('/', (req, res) => {
  res.send('InvestIQ API is running...');
});

// Test route to create a new scorecard
app.post('/api/scorecards', async (req, res) => {
  try {
    // Create a new scorecard instance with sample data
    // In a real application, this data would come from req.body
    const newScorecard = new Scorecard({
      userId: new mongoose.Types.ObjectId(), // Using a dummy ObjectId for testing
      startupName: 'Test Startup',
      overallScore: 85,
      categoryScores: {
        team: 90,
        product: 80,
        market: 75,
        financials: 95,
      },
      strengths: ['Strong team', 'Great product'],
      areasForImprovement: ['Needs more marketing'],
    });

    // Save the new scorecard to the database
    const savedScorecard = await newScorecard.save();
    
    // Send the saved data back as a response
    res.status(201).json(savedScorecard);
    console.log('Successfully created a test scorecard!');

  } catch (error) {
    console.error('Error creating scorecard:', error);
    res.status(500).json({ message: 'Failed to create scorecard', error: error.message });
  }
});


// --- Start Server ---
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

