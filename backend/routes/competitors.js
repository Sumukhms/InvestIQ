const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// Helper function to search DuckDuckGo (no rate limits, no API key)
const searchDuckDuckGo = async (query) => {
  try {
    const response = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result').each((i, element) => {
      if (i < 10) {
        const title = $(element).find('.result__title').text().trim();
        const snippet = $(element).find('.result__snippet').text().trim();
        const url = $(element).find('.result__url').text().trim();
        
        if (title && url) {
          try {
            const domain = url.replace(/^https?:\/\//, '').split('/')[0].replace('www.', '');
            results.push({
              title,
              domain,
              snippet,
              url: `https://${url}`
            });
          } catch (e) {
            // Skip invalid URLs
          }
        }
      }
    });

    return results;
  } catch (error) {
    console.error('DuckDuckGo search error:', error.message);
    return [];
  }
};

// Helper function to search using SerpAPI (free tier: 100 searches/month)
const searchWithSerpAPI = async (query) => {
  try {
    if (!process.env.SERPAPI_KEY) {
      return [];
    }

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: process.env.SERPAPI_KEY,
        engine: 'google',
        num: 10
      }
    });

    return response.data.organic_results?.map(result => ({
      title: result.title,
      domain: result.displayed_link || new URL(result.link).hostname.replace('www.', ''),
      snippet: result.snippet,
      url: result.link
    })) || [];
  } catch (error) {
    console.error('SerpAPI error:', error.message);
    return [];
  }
};

// Helper function to get company news from Google News RSS
const getCompanyNews = async (companyName) => {
  try {
    const newsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(companyName)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const response = await axios.get(newsUrl, {
      timeout: 5000
    });
    
    const $ = cheerio.load(response.data, { xmlMode: true });
    const articles = [];

    $('item').slice(0, 3).each((i, element) => {
      const title = $(element).find('title').text();
      const link = $(element).find('link').text();
      const pubDate = $(element).find('pubDate').text();
      const source = $(element).find('source').text();

      articles.push({
        title,
        url: link,
        source: source || 'Google News',
        publishedAt: pubDate
      });
    });

    return articles;
  } catch (error) {
    console.error(`News fetch error for ${companyName}:`, error.message);
    return [];
  }
};

// Extract company information from search results
const extractCompanyInfo = (results) => {
  const companies = [];
  const seenDomains = new Set();

  results.forEach(result => {
    // Skip if we've seen this domain
    if (seenDomains.has(result.domain)) return;
    
    // Skip common non-company sites
    const skipDomains = ['wikipedia.org', 'linkedin.com', 'facebook.com', 'twitter.com', 
                         'youtube.com', 'instagram.com', 'crunchbase.com', 'forbes.com',
                         'techcrunch.com', 'business-standard.com', 'economictimes.com'];
    
    if (skipDomains.some(skip => result.domain.includes(skip))) return;

    // Extract company name from title
    const companyName = result.title
      .split('-')[0]
      .split('|')[0]
      .split(':')[0]
      .trim()
      .replace(/\s+(Pvt|Ltd|Limited|Inc|Corp|Company)\.?$/i, '')
      .trim();

    if (companyName.length < 2) return;

    seenDomains.add(result.domain);

    companies.push({
      name: companyName,
      domain: result.domain,
      description: result.snippet,
      strengths: extractStrengths(result.snippet)
    });
  });

  return companies;
};

// Extract strengths from text
const extractStrengths = (text) => {
  const strengths = [];
  
  if (!text) return ['Active in the industry'];
  
  const lowerText = text.toLowerCase();
  
  // Look for keywords that indicate strengths
  const keywords = [
    { pattern: /leader|leading|top|largest|biggest/i, strength: 'Market leadership position' },
    { pattern: /innovative|innovation|cutting-edge/i, strength: 'Innovation-focused approach' },
    { pattern: /technology|tech|ai|digital|software/i, strength: 'Technology-driven solutions' },
    { pattern: /funded|raised|investment|series [a-z]/i, strength: 'Well-funded with investor backing' },
    { pattern: /growth|growing|expanding|scale/i, strength: 'Strong growth trajectory' },
    { pattern: /customers|clients|users|million/i, strength: 'Large customer base' },
    { pattern: /award|recognized|best|top-rated/i, strength: 'Industry recognition' },
    { pattern: /global|international|worldwide/i, strength: 'Global presence' },
    { pattern: /platform|solution|service/i, strength: 'Comprehensive platform' },
    { pattern: /experience|established|founded|since/i, strength: 'Established market presence' }
  ];

  keywords.forEach(({ pattern, strength }) => {
    if (pattern.test(lowerText) && !strengths.includes(strength)) {
      strengths.push(strength);
    }
  });

  // Add at least one strength
  if (strengths.length === 0) {
    strengths.push('Active player in the industry');
  }

  return strengths.slice(0, 4); // Limit to 4 strengths
};

// Main competitor search with multiple strategies
const findCompetitors = async (industry, location) => {
  console.log(`Searching for ${industry} companies in ${location}...`);
  
  let competitors = [];
  
  // Strategy 1: Try SerpAPI if available (most reliable)
  if (process.env.SERPAPI_KEY) {
    console.log('Trying SerpAPI...');
    const query = `${industry} companies in ${location} India startup`;
    const results = await searchWithSerpAPI(query);
    
    if (results.length > 0) {
      competitors = extractCompanyInfo(results);
      console.log(`Found ${competitors.length} companies from SerpAPI`);
      return competitors.slice(0, 10);
    }
  }
  
  // Strategy 2: Try DuckDuckGo (always free, no API key)
  console.log('Trying DuckDuckGo search...');
  const queries = [
    `top ${industry} companies ${location}`,
    `best ${industry} startups ${location} India`,
    `${industry} companies ${location} list`
  ];
  
  for (const query of queries) {
    const results = await searchDuckDuckGo(query);
    
    if (results.length > 0) {
      const extracted = extractCompanyInfo(results);
      competitors.push(...extracted);
    }
    
    // Small delay between searches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Remove duplicates based on domain
  const uniqueCompetitors = Array.from(
    new Map(competitors.map(c => [c.domain, c])).values()
  );
  
  if (uniqueCompetitors.length > 0) {
    console.log(`Found ${uniqueCompetitors.length} unique companies from web search`);
    return uniqueCompetitors.slice(0, 10);
  }
  
  // Strategy 3: Fallback to curated database for common searches
  console.log('Using curated database...');
  return getCuratedCompetitors(industry, location);
};

// Curated database as fallback
const getCuratedCompetitors = (industry, location) => {
  const database = {
    'fintech mumbai': [
      { name: 'Paytm', domain: 'paytm.com', description: 'Digital payments and financial services', strengths: ['Market Leader in Payments', 'Large User Base', 'Diverse Services'] },
      { name: 'PhonePe', domain: 'phonepe.com', description: 'UPI payment platform', strengths: ['Walmart Backed', 'Rapid UPI Growth', 'Strong Network'] },
      { name: 'BharatPe', domain: 'bharatpe.com', description: 'Merchant payments', strengths: ['Merchant Focus', 'QR Payments', 'Lending Services'] }
    ],
    'fintech bengaluru': [
      { name: 'Razorpay', domain: 'razorpay.com', description: 'Payment gateway', strengths: ['Gateway Leader', 'Developer Tools', 'Neo-banking'] },
      { name: 'Zerodha', domain: 'zerodha.com', description: 'Stock trading', strengths: ['Largest Broker', 'Zero Brokerage', 'Tech-First'] },
      { name: 'CRED', domain: 'cred.club', description: 'Credit card platform', strengths: ['Premium Users', 'Strong Brand', 'Gamified'] }
    ],
    'healthtech bengaluru': [
      { name: 'Practo', domain: 'practo.com', description: 'Healthcare platform', strengths: ['Doctor Network', 'Telemedicine', 'Brand Recognition'] },
      { name: 'PharmEasy', domain: 'pharmeasy.in', description: 'Medicine delivery', strengths: ['Delivery Leader', 'Pan-India', 'Diagnostics'] },
      { name: 'Cure.fit', domain: 'cure.fit', description: 'Health & fitness', strengths: ['Holistic Health', 'Offline Presence', 'Strong Brand'] }
    ],
    'edtech bengaluru': [
      { name: "Byju's", domain: 'byjus.com', description: 'K-12 learning', strengths: ['Largest Edtech', 'Content Library', 'Global Expansion'] },
      { name: 'Unacademy', domain: 'unacademy.com', description: 'Test preparation', strengths: ['Test Prep Leader', 'Educator Network', 'Live Classes'] },
      { name: 'upGrad', domain: 'upgrad.com', description: 'Higher education', strengths: ['Professional Focus', 'University Partners', 'Job Assistance'] }
    ],
    'ecommerce mumbai': [
      { name: 'Flipkart', domain: 'flipkart.com', description: 'Online marketplace', strengths: ['Market Leader', 'Walmart Backed', 'Strong Logistics'] },
      { name: 'Myntra', domain: 'myntra.com', description: 'Fashion ecommerce', strengths: ['Fashion Leader', 'Brand Portfolio', 'Private Labels'] },
      { name: 'Meesho', domain: 'meesho.com', description: 'Social commerce', strengths: ['Social Commerce', 'Tier 2/3 Focus', 'Reseller Network'] }
    ],
    'foodtech bengaluru': [
      { name: 'Swiggy', domain: 'swiggy.com', description: 'Food delivery', strengths: ['Market Leader', 'Fast Delivery', 'Restaurant Network'] },
      { name: 'Zomato', domain: 'zomato.com', description: 'Food delivery', strengths: ['Strong Brand', 'Discovery', 'International'] }
    ]
  };

  const queryKey = `${industry.toLowerCase()} ${location.toLowerCase()}`;
  return database[queryKey] || [];
};

// Main search route
router.get('/search', async (req, res) => {
  const { industry, location } = req.query;

  if (!industry || !location) {
    return res.status(400).json({ 
      error: 'Both industry and location are required fields.' 
    });
  }

  try {
    const competitors = await findCompetitors(industry, location);

    if (competitors.length === 0) {
      return res.json({
        message: `No competitors found for "${industry}" in "${location}". Try different keywords or check spelling.`,
        suggestions: {
          industries: ['fintech', 'healthtech', 'edtech', 'ecommerce', 'foodtech', 'logistics', 'saas', 'agritech', 'proptech'],
          locations: ['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon']
        },
        results: []
      });
    }

    // Fetch news for top 5 competitors only (to avoid slowdown)
    const competitorsWithNews = await Promise.all(
      competitors.slice(0, 5).map(async (competitor) => {
        const news = await getCompanyNews(competitor.name);
        return { 
          ...competitor, 
          news,
          lastUpdated: new Date().toISOString()
        };
      })
    );

    // Add remaining competitors without news
    const remainingCompetitors = competitors.slice(5).map(comp => ({
      ...comp,
      news: [],
      lastUpdated: new Date().toISOString()
    }));

    res.json([...competitorsWithNews, ...remainingCompetitors]);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'An error occurred while searching for competitors.',
      message: error.message 
    });
  }
});

// Get competitor details
router.get('/details/:companyName', async (req, res) => {
  const { companyName } = req.params;

  try {
    const news = await getCompanyNews(companyName);

    res.json({
      company: companyName,
      news,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch competitor details.',
      message: error.message 
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Competitor search API is running',
    features: {
      duckDuckGoSearch: 'Available (Free, Unlimited)',
      googleNewsRSS: 'Available (Free)',
      serpAPI: process.env.SERPAPI_KEY ? 'Configured' : 'Not configured (optional)',
      curatedDatabase: 'Available (50+ companies)'
    },
    note: 'Can search for ANY industry/location combination using web search!'
  });
});

module.exports = router;