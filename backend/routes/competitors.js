const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper function to get company news
const getCompanyNews = async (companyName) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q="${companyName}"&apiKey=${process.env.NEWS_API_KEY}&pageSize=3&sortBy=publishedAt`);
    return response.data.articles.map(article => ({
      title: article.title,
      url: article.url
    }));
  } catch (error) {
    console.error(`Could not fetch news for ${companyName}`, error);
    return []; // Return empty array on failure
  }
};

// Main search route
router.get('/search', async (req, res) => {
  const { industry, location } = req.query;

  if (!industry) {
    return res.status(400).json({ error: 'Industry is a required field.' });
  }

  // --- MOCK API RESPONSE ---
  // In a real application, this would be a call to a live company data API.
  // This simulation provides realistic data for our target industries.
  const findCompetitors = async (industry, location) => {
    console.log(`Searching for ${industry} companies in ${location}...`);
    const mockDatabase = {
      "fintech mumbai": [
        { name: "Paytm", domain: "paytm.com", strengths: ["Market Leader in Payments", "Large User Base", "Diverse Financial Services"] },
        { name: "PhonePe", domain: "phonepe.com", strengths: ["Backed by Walmart", "Rapid Growth in UPI", "Strong Merchant Network"] },
      ],
      "healthtech bengaluru": [
        { name: "Practo", domain: "practo.com", strengths: ["Comprehensive Doctor Network", "Telemedicine Pioneer", "Strong Brand Recognition"] },
        { name: "Cure.fit", domain: "cure.fit", strengths: ["Integrated Health Ecosystem", "Strong Offline Presence", "Cult-like Brand Following"] },
      ]
    };
    const queryKey = `${industry.toLowerCase()} ${location.toLowerCase()}`;
    return mockDatabase[queryKey] || [];
  };
  // -------------------------

  try {
    const competitors = await findCompetitors(industry, location);

    // Use Promise.all to fetch news for all competitors concurrently
    const competitorsWithNews = await Promise.all(
      competitors.map(async (competitor) => {
        const news = await getCompanyNews(competitor.name);
        return { ...competitor, news };
      })
    );

    res.json(competitorsWithNews);

  } catch (error) {
    console.error('Error in competitor search route:', error);
    res.status(500).send('An error occurred while searching for competitors.');
  }
});

module.exports = router;