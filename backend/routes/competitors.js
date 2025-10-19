const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

// Load curated dataset (place file at project-root: /data/startups.json)
const curatedPath = path.join(__dirname, '..', 'data', 'startups.json');
let curatedData = [];
try {
  curatedData = require(curatedPath);
} catch (e) {
  console.warn('Curated startups dataset not found at', curatedPath);
}

router.use(cors());

// -----------------------------
// DuckDuckGo search helper
// -----------------------------
const searchDuckDuckGo = async (query) => {
  try {
    const response = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: query },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 8000
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result').each((i, el) => {
      if (i >= 12) return; // limit results
      const title = $(el).find('.result__title').text().trim();
      const href = $(el).find('.result__a').attr('href');
      const snippet = $(el).find('.result__snippet').text().trim();

      if (!href || !title) return;
      try {
        const domain = new URL(href).hostname.replace(/^www\./, '');
        results.push({ title, domain, snippet, url: href });
      } catch {}
    });

    return results;
  } catch (err) {
    console.error('DuckDuckGo search error:', err.message);
    return [];
  }
};

// -----------------------------
// Google News RSS helper
// -----------------------------
const getCompanyNews = async (companyName) => {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(companyName)}&hl=en&gl=US&ceid=US:en`;
    const res = await axios.get(rssUrl, { timeout: 5000 });
    const $ = cheerio.load(res.data, { xmlMode: true });
    const articles = [];
    $('item').slice(0, 3).each((i, el) => {
      const title = $(el).find('title').text();
      const link = $(el).find('link').text();
      const pubDate = $(el).find('pubDate').text();
      const source = $(el).find('source').text();
      articles.push({ title, url: link, source: source || 'Google News', publishedAt: pubDate });
    });
    return articles;
  } catch (err) {
    return [];
  }
};

// -----------------------------
// Utilities: match curated dataset
// -----------------------------
const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const findCuratedMatches = (industry, location) => {
  // match by industry + city OR industry + country
  const inIndustry = curatedData.filter(c => normalize(c.industry) === normalize(industry));
  if (!inIndustry.length) return [];

  const byCity = inIndustry.filter(c => normalize(c.location?.city || '') === normalize(location));
  if (byCity.length) return byCity;

  const byCountry = inIndustry.filter(c => normalize(c.location?.country || '') === normalize(location));
  if (byCountry.length) return byCountry;

  // broader fallback: return top few in industry
  return inIndustry.slice(0, 6);
};

// Merge live result with curated if possible
const mergeWithCurated = (live, industry, location) => {
  // Try to match by domain first, then by name similarity
  const domainMatch = curatedData.find(c => c.domain && live.domain && normalize(c.domain) === normalize(live.domain));
  if (domainMatch) return { ...domainMatch, description: live.snippet || domainMatch.description };

  const titleName = live.title.split('-')[0].split('|')[0].trim();
  const nameMatch = curatedData.find(c => normalize(c.name) === normalize(titleName));
  if (nameMatch) return { ...nameMatch, description: live.snippet || nameMatch.description };

  // fuzzy partial match: name contains curated name or vice versa
  const partial = curatedData.find(c => normalize(titleName).includes(normalize(c.name)) || normalize(c.name).includes(normalize(titleName)));
  if (partial) return { ...partial, description: live.snippet || partial.description };

  // else convert live into structured placeholder
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

// -----------------------------
// extract companies from DuckDuckGo
// -----------------------------
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

// -----------------------------
// Main finder: live + curated fallback
// -----------------------------
const findCompetitors = async (industry, location) => {
  const queries = [
    `top ${industry} companies in ${location}`,
    `best ${industry} startups ${location}`,
    `${industry} companies ${location}`
  ];

  let liveCompanies = [];
  for (const q of queries) {
    const results = await searchDuckDuckGo(q);
    if (results.length) {
      const extracted = extractCompaniesFromResults(results, industry, location);
      extracted.forEach(c => {
        if (!liveCompanies.find(x => normalize(x.domain) === normalize(c.domain) || normalize(x.name) === normalize(c.name))) {
          liveCompanies.push(c);
        }
      });
    }
    await new Promise(r => setTimeout(r, 350));
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
    const news = idx < 5 ? await getCompanyNews(c.name || c.domain) : [];
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
    // merge without duplicates
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
    res.status(500).json({ error: 'Server error', message: err.message });
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
