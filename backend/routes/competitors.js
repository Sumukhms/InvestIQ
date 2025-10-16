const express = require('express');
const router = express.Router();
// We are no longer using Axios for unreliable third-party APIs in this file.

// This mock function simulates a targeted Google Search for companies.
// In a real-world scenario, you would replace this with a call to an official
// Google Search API library to get live results.
const searchForCompetitors = async (query) => {
    console.log(`Simulating a targeted search for competitors related to: "${query}"`);

    // --- MOCK SEARCH RESULTS ---
    // This simulates what a real search API would return based on the query.
    // These results are more realistic and varied.
    const mockDatabase = {
        "fintech New York": [
            { name: "Stripe", domain: "stripe.com" },
            { name: "Adyen", domain: "adyen.com" },
            { name: "Brex", domain: "brex.com" },
        ],
        "HealthTech Bengaluru": [
            { name: "Practo", domain: "practo.com" },
            { name: "Cure.fit", domain: "cure.fit" },
            { name: "Portea Medical", domain: "portea.com" },
        ],
        "default": [
            { name: `Leading ${query} Solutions`, domain: `leading${query.toLowerCase().split(' ')[0]}.com` },
            { name: `Global ${query} Innovations`, domain: `global${query.toLowerCase().split(' ')[0]}.io` },
        ]
    };
    // -------------------------

    const key = query.includes("fintech") ? "fintech New York" : query.includes("HealthTech") ? "HealthTech Bengaluru" : "default";
    const results = mockDatabase[key] || mockDatabase["default"];
    
    return results.map(company => ({
        name: company.name,
        domain: company.domain
    }));
};

router.get('/search', async (req, res) => {
  const { industry, location, name } = req.query; 

  if (!industry && !name) {
    return res.status(400).json({ error: 'An industry or company name is required to search.' });
  }

  // Create a more effective search query
  const searchQuery = `${name || ''} ${industry || ''} competitors in ${location || ''}`.trim();

  try {
    // Use the reliable search function
    const results = await searchForCompetitors(searchQuery);
    
    if (!results || results.length === 0) {
        return res.json([]); // Return an empty array if no results are found
    }

    res.json(results);

  } catch (error) {
    console.error('Error fetching competitor data:', error.message);
    res.status(500).send('Failed to fetch data via search.');
  }
});

module.exports = router;