const axios = require('axios');

// -----------------------------
// Google Search API helper
// -----------------------------
const searchGoogleAPI = async (query) => {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;
    const url = `https://www.googleapis.com/customsearch/v1`;

    const response = await axios.get(url, {
      params: {
        key: apiKey,
        cx: cx,
        q: query,
        num: 10,
      },
      timeout: 8000
    });

    if (!response.data.items) {
      return [];
    }

    const results = response.data.items.map(item => {
      try {
        const domain = new URL(item.link).hostname.replace(/^www\./, '');
        return {
          title: item.title,
          domain: domain,
          snippet: item.snippet,
          url: item.link
        };
      } catch {
        return null;
      }
    }).filter(Boolean);

    return results;

  } catch (err) {
    console.error('Google Search API error:', err.message);
    return [];
  }
};

// -----------------------------
// News API helper
// -----------------------------
const getCompanyNewsAPI = async (companyName) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/everything`;
    
    const res = await axios.get(url, {
      params: {
        q: companyName,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5, // Get top 5 articles
        apiKey: apiKey,
      },
      timeout: 5000
    });

    if (!res.data.articles) return [];

    return res.data.articles.map(article => ({
      title: article.title,
      url: article.url,
      source: article.source.name || 'NewsAPI.org',
      publishedAt: article.publishedAt
    }));

  } catch (err) {
    console.error('News API error:', err.message);
    return [];
  }
};

module.exports = {
  searchGoogleAPI,
  getCompanyNewsAPI
};