// PUT THIS AT THE VERY TOP, BEFORE ANYTHING ELSE
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

// --- MODEL IMPORTS ---
const Scorecard = require('./models/Scorecard');
const Prediction = require('./models/Prediction');
// ✅ NEW: Added models needed for the watchdog
const CompetitorReport = require('./models/CompetitorReport');
const Alert = require('./models/Alert');

// ✅ NEW: Import cron and the shared API helper
const cron = require('node-cron');
// We assume you created 'utils/apiHelpers.js' as per the previous step
const { getCompanyNewsAPI } = require('./utils/apiHelpers'); 

// --- For Debugging: Let's check if the keys are loaded ---
console.log('SENDGRID_API_KEY loaded:', !!process.env.SENDGRID_API_KEY);
console.log('EMAIL_USER loaded:', process.env.EMAIL_USER);
// ---------------------------------------------------------

require('./config/passport-setup'); // Passport config

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
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

// ---------------------------------------------------------
// ✅ NEW: Background Watchdog Function
// ---------------------------------------------------------
async function runCompetitorWatchdog() {
  console.log('Running Competitor Watchdog...');
  try {
    // 1. Get all competitors from all users
    const allReports = await CompetitorReport.find({});

    for (const report of allReports) {
      // 2. Get fresh news for each one
      const companyName = report.competitorData.name;
      const freshNews = await getCompanyNewsAPI(companyName);
      const oldNews = report.competitorData.news || [];

      // 3. Compare new news with old news (by title)
      const newArticles = freshNews.filter(fresh => 
        !oldNews.some(old => old.title === fresh.title)
      );

      // 4. If new news exists, create an alert and update the report
      if (newArticles.length > 0) {
        console.log(`Found ${newArticles.length} new articles for ${companyName} (User: ${report.userId})`);
        
        // 5. Create the alert for the user
        await new Alert({
          userId: report.userId,
          message: `Found ${newArticles.length} new news article(s) for ${companyName}.`,
          link: '/competitors'
        }).save();

        // 6. Update the report with the new news
        report.competitorData.news = freshNews;
        report.lastUpdated = new Date();
        await report.save();
      }
    }
  } catch (err) {
    console.error('Error during competitor watchdog run:', err);
  }
  console.log('Competitor Watchdog finished.');
}
// ---------------------------------------------------------


// --- Define Routes ---
const newsRoutes = require('./routes/news');
const fundingRoutes = require('./routes/funding');
const competitorsRoute = require('./routes/competitors');
const scorecardRoutes = require('./routes/scorecard');
const settingsRoutes = require('./routes/settings');
const chatbotRoutes = require('./routes/chatbot');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', newsRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/competitors', competitorsRoute); 
app.use('/api/scorecard', scorecardRoutes); 
app.use('/api/settings', settingsRoutes);
app.use('/api/chatbot', chatbotRoutes);
// ✅ NEW: Register the alerts route
app.use('/api/alerts', require('./routes/alerts'));


// --- One-off API Routes ---

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

        const rawResponse = response.data.candidates[0].content.parts[0].text;
        const cleanedResponse = rawResponse.replace(/```json\n|```/g, '').trim();

        const aiSuggestions = JSON.parse(cleanedResponse);
        console.log("Received a unique, AI-generated response from Gemini.");

        res.json(aiSuggestions);

    } catch (error) {
        console.error("Error calling Google AI API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get a response from the AI service.' });
    }
});

// Test route to create a new scorecard
app.post('/api/scorecards', async (req, res) => {
  try {
    const newScorecard = new Scorecard({
      userId: new mongoose.Types.ObjectId(), 
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

    const savedScorecard = await newScorecard.save();
    res.status(201).json(savedScorecard);
    console.log('Successfully created a test scorecard!');

  } catch (error) {
    console.error('Error creating scorecard:', error);
    res.status(500).json({ message: 'Failed to create scorecard', error: error.message });
  }
});

app.post('/api/predict-and-save', async (req, res) => {
    const { startupData, userId } = req.body; // Assuming you send userId from the frontend

    try {
        // ✅ FIX: Use an environment variable for the ML service URL
        // This fixes the hard-coded 'localhost' flaw
        const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001/predict';

        // 1. Call the Python ML Service
        const mlResponse = await axios.post(ML_API_URL, startupData);
        const predictionData = mlResponse.data;

        // 2. Save the prediction to the database
        const newPrediction = new Prediction({
            userId,
            startupName: startupData.name, // Or another identifier
            ...predictionData
        });
        await newPrediction.save();

        // 3. Send the result back to the frontend
        res.json(predictionData);

    } catch (error) {
        console.error("Error in prediction flow:", error.message);
        res.status(500).json({ error: 'Failed to get and save prediction.' });
    }
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`InvestIQ MERN Backend is running on port: ${port}`);

  // ✅ NEW: Schedule the background job
  // This runs at 3:00 AM every day.
  cron.schedule('0 3 * * *', () => {
    runCompetitorWatchdog();
  }, {
    timezone: "Asia/Kolkata" // Set this to your server's timezone
  });

  console.log('Competitor watchdog scheduled to run daily at 3:00 AM.');
});