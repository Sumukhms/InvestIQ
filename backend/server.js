// PUT THIS AT THE VERY TOP, BEFORE ANYTHING ELSE
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

// --- For Debugging: Let's check if the keys are loaded ---
console.log('SENDGRID_API_KEY loaded:', !!process.env.SENDGRID_API_KEY);
console.log('EMAIL_USER loaded:', process.env.EMAIL_USER);
// ---------------------------------------------------------

require('./config/passport-setup'); // Passport config

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Mongoose Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Passport & Session Middleware ---
app.use(session({ secret: 'some_session_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define Routes
const newsRoutes = require('./routes/news'); // <-- NEW: Import the news route
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', newsRoutes); // <-- NEW: Register the news route

app.post('/api/growth-suggestions', async (req, res) => {
  const { industry, stage, idea } = req.body;

  if (!industry || !stage || !idea) {
    return res.status(400).json({ error: 'Industry, stage, and the startup idea are required.' });
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  const AI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Google AI API key is not configured on the server.' });
  }

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
    console.log("Sending request to the documented Gemini v1beta endpoint...");
    const response = await axios.post(AI_API_ENDPOINT, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    const aiSuggestions = JSON.parse(response.data.candidates[0].content.parts[0].text);
    console.log("Received a unique, AI-generated response from Gemini.");

    res.json(aiSuggestions);

  } catch (error) {
    console.error("Error calling Google AI API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get a response from the AI service.' });
  }
});

app.listen(port, () => {
  console.log(`InvestIQ MERN Backend is running on port: ${port}`);
});