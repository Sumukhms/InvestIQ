const express = require('express');
const router = express.Router();
const cors = require('cors');
const path = require('path');
const CompetitorReport = require('../models/CompetitorReport');
const authMiddleware = require('../middleware/auth');
// ✅ IMPORT the new API helpers
const { searchGoogleAPI, getCompanyNewsAPI } = require('../utils/apiHelpers');

// Load curated dataset
const curatedPath = path.join(__dirname, '..', 'data', 'startups.json');
let curatedData = [];
try {
  curatedData = require(curatedPath);
} catch (e) {
  console.warn('Curated startups dataset not found at', curatedPath);
}

router.use(cors());

// --- (Keep all the helper functions: normalize, findCuratedMatches, mergeWithCurated, extractCompaniesFromResults) ---
const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const findCuratedMatches = (industry, location) => {
  const inIndustry = curatedData.filter(c => normalize(c.industry) === normalize(industry));
  if (!inIndustry.length) return [];
  const byCity = inIndustry.filter(c => normalize(c.location?.city || '') === normalize(location));
  if (byCity.length) return byCity;
  const byCountry = inIndustry.filter(c => normalize(c.location?.country || '') === normalize(location));
  if (byCountry.length) return byCountry;
  return inIndustry.slice(0, 6);
};

const mergeWithCurated = (live, industry, location) => {
  const domainMatch = curatedData.find(c => c.domain && live.domain && normalize(c.domain) === normalize(live.domain));
  if (domainMatch) return { ...domainMatch, description: live.snippet || domainMatch.description };
  const titleName = live.title.split('-')[0].split('|')[0].trim();
  const nameMatch = curatedData.find(c => normalize(c.name) === normalize(titleName));
  if (nameMatch) return { ...nameMatch, description: live.snippet || nameMatch.description };
  const partial = curatedData.find(c => normalize(titleName).includes(normalize(c.name)) || normalize(c.name).includes(normalize(titleName)));
  if (partial) return { ...partial, description: live.snippet || partial.description };
  return {
    name: titleName || live.domain,
    domain: live.domain,
    industry: industry,
    location: { city: location, country: location },
    description: live.snippet || '',
    founded: null,
    employees: null,
    funding: null,
    strengths: [],
    website: live.url || `https://${live.domain}`
  };
};

const extractCompaniesFromResults = (results, industry, location) => {
  const companies = [];
  const seen = new Set();
  results.forEach(r => {
    if (!r.domain) return;
    if (seen.has(r.domain)) return;
    seen.add(r.domain);
    const merged = mergeWithCurated(r, industry, location);
    companies.push(merged);
  });
  return companies;
};
// --- (End of helper functions) ---


// -----------------------------
// ✅ UPDATED: Main finder: live + curated fallback
// -----------------------------
const findCompetitors = async (industry, location) => {
  // ✅ CHANGED: More targeted queries
  const queries = [
    `${industry} companies in ${location} site:linkedin.com/company`,
    `${industry} startups in ${location} site:crunchbase.com/organization`,
    `${industry} companies ${location} site:tracxn.com`,
    `${industry} startups ${location} site:yourstory.com/companies`
  ];

  let liveCompanies = [];
  for (const q of queries) {
    // ✅ CHANGED: Use new searchGoogleAPI function
    const results = await searchGoogleAPI(q); 
    if (results.length) {
      const extracted = extractCompaniesFromResults(results, industry, location);
      extracted.forEach(c => {
        if (!liveCompanies.find(x => normalize(x.domain) === normalize(c.domain) || normalize(x.name) === normalize(c.name))) {
          liveCompanies.push(c);
        }
      });
    }
    if (liveCompanies.length >= 8) break;
  }

  // If live finds nothing, fallback to curated dataset
  if (liveCompanies.length === 0) {
    const cur = findCuratedMatches(industry, location);
    return cur.map(c => ({ ...c, news: [], lastUpdated: new Date().toISOString() })).slice(0, 10);
  }

  // Enrich with curated fields where possible and add news for top results
  const enriched = await Promise.all(liveCompanies.slice(0, 10).map(async (c, idx) => {
    // add news (only for top 5 to speed up)
    // ✅ CHANGED: Use new getCompanyNewsAPI function
    const news = idx < 5 ? await getCompanyNewsAPI(c.name || c.domain) : [];
    return {
      name: c.name,
      domain: c.domain,
      industry: c.industry || industry,
      location: c.location || { city: location, country: location },
      description: c.description || '',
      founded: c.founded || null,
      employees: c.employees || null,
      funding: c.funding || null,
      strengths: c.strengths || [],
      website: c.website || (c.domain ? `https://${c.domain}` : null),
      news,
      lastUpdated: new Date().toISOString()
    };
  }));

  // If results less than 4, append curated matches to ensure enough data
  if (enriched.length < 4) {
    const extra = findCuratedMatches(industry, location).map(c => ({
      name: c.name,
      domain: c.domain,
      industry: c.industry,
      location: c.location,
      description: c.description,
      founded: c.founded || null,
      employees: c.employees || null,
      funding: c.funding || null,
      strengths: c.strengths || [],
      website: c.website || `https://${c.domain}`,
      news: [],
      lastUpdated: new Date().toISOString()
    }));
    extra.forEach(e => {
      if (!enriched.find(x => normalize(x.domain) === normalize(e.domain) || normalize(x.name) === normalize(e.name))) {
        enriched.push(e);
      }
    });
  }
  return enriched.slice(0, 10);
};

// -----------------------------
// API Routes
// -----------------------------
router.get('/search', async (req, res) => {
  const { industry, location } = req.query;
  if (!industry || !location) {
    return res.status(400).json({ error: 'Both industry and location are required.' });
  }
  try {
    const results = await findCompetitors(industry, location);
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ NEW: Refresh a single watchlist item
router.post('/refresh/:reportId', authMiddleware, async (req, res) => {
  try {
    const report = await CompetitorReport.findOne({
      _id: req.params.reportId,
      userId: req.user.id
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    const companyName = report.competitorData.name;
    const freshNews = await getCompanyNewsAPI(companyName);

    report.competitorData.news = freshNews;
    report.lastUpdated = new Date();
    await report.save();

    res.json(report);
  } catch (err) {
    console.error('Error refreshing competitor:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get user's watchlist
router.get('/watchlist', authMiddleware, async (req, res) => {
  try {
    const watchlist = await CompetitorReport.find({ userId: req.user.id })
                                            .sort({ createdAt: -1 });
    res.json(watchlist);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Add a competitor to the watchlist
router.post('/watch', authMiddleware, async (req, res) => {
  const { competitor } = req.body;
  if (!competitor || !competitor.name) {
    return res.status(400).json({ error: 'Competitor data is required.' });
  }
  try {
    const existing = await CompetitorReport.findOne({ 
      userId: req.user.id,
      'competitorData.name': competitor.name 
    });
    if (existing) {
      return res.status(409).json({ error: 'Competitor already in watchlist.' });
    }
    const newReport = new CompetitorReport({
      userId: req.user.id,
      competitorName: competitor.name,
      competitorData: competitor
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    console.error('Error saving to watchlist:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Remove from watchlist
router.delete('/watch/:reportId', authMiddleware, async (req, res) => {
  try {
    const report = await CompetitorReport.findOne({
      _id: req.params.reportId,
      userId: req.user.id
    });
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }
    await CompetitorReport.deleteOne({ _id: req.params.reportId, userId: req.user.id });
    res.json({ msg: 'Competitor removed' });
  } catch (err) {
    console.error('Error removing from watchlist:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    curatedLoaded: curatedData.length > 0,
    curatedCount: curatedData.length
  });
});

module.exports = router;