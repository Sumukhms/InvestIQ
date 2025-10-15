// PUT THIS AT THE VERY TOP, BEFORE ANYTHING ELSE
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // Your existing auth routes

// Initialize Passport config
require('./config/passport-setup'); 

const app = express();
const port = process.env.PORT || 5000;

// --- 1. MIDDLEWARE SETUP (should come first) ---
app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend to make requests
  credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a_fallback_secret_key', // Use an environment variable for the secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if you are using https in production
      httpOnly: true,
    }
  })
);

// Passport middleware (must come after session)
app.use(passport.initialize());
app.use(passport.session());

// --- 2. MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- 3. API ROUTES ---

// Route for authentication (login, signup, etc.)
app.use('/api/auth', authRoutes);

// Route for getting AI-powered growth suggestions
app.post('/api/growth-suggestions', async (req, res) => {
  const { industry, stage, idea } = req.body;

  if (!industry || !stage || !idea) {
    return res.status(400).json({ error: 'Industry, stage, and the startup idea are required.' });
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  if (!API_KEY) {
    console.error('GOOGLE_API_KEY is not defined in the .env file.');
    return res.status(500).json({ error: 'Google AI API key is not configured on the server.' });
  }

  const AI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-1.5:generateContent?key=${API_KEY}`;
  
  const prompt = `
    Act as an elite, world-class Venture Capital analyst and startup mentor. A founder needs your expert advice.
    Your task is to provide the top 3 most critical and actionable priorities for them based on their specific startup IDEA, industry, and current stage.
    Your advice must be highly specific, unique, and directly tailored to the founder's idea. Do not give generic, pre-written advice.

    **Startup Idea:** "${idea}"
    **Industry:** "${industry}"
    **Stage:** "${stage}"

    Provide your response ONLY in a structured JSON format, with no other text before or after the JSON block:
    {
      "product": ["Advice 1", "Advice 2", "Advice 3"],
      "marketing": ["Advice 1", "Advice 2", "Advice 3"],
      "fundraising": ["Advice 1", "Advice 2", "Advice 3"]
    }
  `;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
    }
  };

  try {
    console.log("Sending request to Gemini AI endpoint...");
    
    const response = await axios.post(AI_API_ENDPOINT, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    // The AI response is nested. We need to access it correctly.
    const aiResponseText = response.data.candidates[0].content.parts[0].text;
    const aiSuggestions = JSON.parse(aiResponseText);
    
    console.log("Received AI-generated response from Gemini.");
    res.json(aiSuggestions);

  } catch (error) {
    console.error("Error calling Google AI API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get a response from the AI service.' });
  }
});


// --- 4. START THE SERVER (should be the very last thing) ---
app.listen(port, () => {
  console.log(`InvestIQ MERN Backend is running on port: ${port}`);
});