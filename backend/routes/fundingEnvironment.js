// backend/routes/fundingEnvironment.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Sample funding data - In production, this would come from a database or external API
const getFundingData = (industry, timeframe = '6months') => {
  // Mock data structure - replace with actual API calls or database queries
  const fundingDatabase = {
    fintech: {
      recentRounds: [
        {
          id: 1,
          companyName: 'PayTech Solutions',
          roundType: 'Series B',
          amount: 45000000,
          date: '2025-10-15',
          leadInvestor: 'Sequoia Capital',
          investors: ['Sequoia Capital', 'Accel', 'Y Combinator'],
          valuation: 180000000,
          location: 'San Francisco, USA'
        },
        {
          id: 2,
          companyName: 'CryptoBank',
          roundType: 'Series A',
          amount: 15000000,
          date: '2025-09-20',
          leadInvestor: 'Andreessen Horowitz',
          investors: ['Andreessen Horowitz', 'Tiger Global'],
          valuation: 75000000,
          location: 'London, UK'
        },
        {
          id: 3,
          companyName: 'NeoBanking Pro',
          roundType: 'Seed',
          amount: 5000000,
          date: '2025-08-10',
          leadInvestor: 'Y Combinator',
          investors: ['Y Combinator', 'SV Angel', 'Individual Angels'],
          valuation: 20000000,
          location: 'Bengaluru, India'
        },
        {
          id: 4,
          companyName: 'InsurTech AI',
          roundType: 'Series C',
          amount: 80000000,
          date: '2025-07-25',
          leadInvestor: 'SoftBank Vision Fund',
          investors: ['SoftBank Vision Fund', 'Goldman Sachs', 'JPMorgan'],
          valuation: 500000000,
          location: 'New York, USA'
        }
      ],
      activeInvestors: [
        {
          name: 'Sequoia Capital',
          investmentCount: 12,
          totalInvested: 450000000,
          avgTicketSize: 37500000,
          focus: ['Series A', 'Series B', 'Series C'],
          location: 'Menlo Park, USA',
          portfolio: ['Stripe', 'Square', 'Robinhood']
        },
        {
          name: 'Andreessen Horowitz',
          investmentCount: 8,
          totalInvested: 320000000,
          avgTicketSize: 40000000,
          focus: ['Seed', 'Series A', 'Series B'],
          location: 'San Francisco, USA',
          portfolio: ['Coinbase', 'Plaid', 'Affirm']
        },
        {
          name: 'Tiger Global',
          investmentCount: 15,
          totalInvested: 680000000,
          avgTicketSize: 45333333,
          focus: ['Series B', 'Series C', 'Series D'],
          location: 'New York, USA',
          portfolio: ['Razorpay', 'Chime', 'Brex']
        },
        {
          name: 'Y Combinator',
          investmentCount: 25,
          totalInvested: 125000000,
          avgTicketSize: 5000000,
          focus: ['Pre-seed', 'Seed'],
          location: 'Mountain View, USA',
          portfolio: ['Stripe', 'Coinbase', 'Instacart']
        }
      ],
      valuationTrends: {
        seed: { avg: 8000000, min: 3000000, max: 15000000, count: 45 },
        seriesA: { avg: 35000000, min: 15000000, max: 60000000, count: 28 },
        seriesB: { avg: 120000000, min: 60000000, max: 250000000, count: 15 },
        seriesC: { avg: 400000000, min: 200000000, max: 800000000, count: 8 }
      },
      fundingTrends: [
        { month: 'May 2025', totalAmount: 185000000, dealCount: 12 },
        { month: 'Jun 2025', totalAmount: 220000000, dealCount: 15 },
        { month: 'Jul 2025', totalAmount: 195000000, dealCount: 11 },
        { month: 'Aug 2025', totalAmount: 240000000, dealCount: 18 },
        { month: 'Sep 2025', totalAmount: 280000000, dealCount: 20 },
        { month: 'Oct 2025', totalAmount: 310000000, dealCount: 22 }
      ],
      insights: {
        totalFunding: 1430000000,
        totalDeals: 98,
        avgDealSize: 14591837,
        topRound: 'Series B',
        growthRate: 15.5,
        hotTrends: ['Embedded Finance', 'Crypto Banking', 'AI-Powered Risk Assessment']
      }
    },
    edtech: {
      recentRounds: [
        {
          id: 1,
          companyName: 'LearnAI',
          roundType: 'Series B',
          amount: 35000000,
          date: '2025-10-10',
          leadInvestor: 'Tiger Global',
          investors: ['Tiger Global', 'Accel', 'Owl Ventures'],
          valuation: 150000000,
          location: 'Bengaluru, India'
        },
        {
          id: 2,
          companyName: 'SkillHub Pro',
          roundType: 'Series A',
          amount: 18000000,
          date: '2025-09-15',
          leadInvestor: 'GSV Ventures',
          investors: ['GSV Ventures', 'Reach Capital'],
          valuation: 80000000,
          location: 'San Francisco, USA'
        }
      ],
      activeInvestors: [
        {
          name: 'Tiger Global',
          investmentCount: 10,
          totalInvested: 380000000,
          avgTicketSize: 38000000,
          focus: ['Series A', 'Series B'],
          location: 'New York, USA',
          portfolio: ["Byju's", 'Coursera', 'Unacademy']
        },
        {
          name: 'Owl Ventures',
          investmentCount: 18,
          totalInvested: 420000000,
          avgTicketSize: 23333333,
          focus: ['Seed', 'Series A', 'Series B'],
          location: 'San Francisco, USA',
          portfolio: ['Coursera', 'MasterClass', 'Guild Education']
        }
      ],
      valuationTrends: {
        seed: { avg: 7000000, min: 2000000, max: 12000000, count: 38 },
        seriesA: { avg: 32000000, min: 12000000, max: 55000000, count: 22 },
        seriesB: { avg: 110000000, min: 50000000, max: 200000000, count: 12 },
        seriesC: { avg: 350000000, min: 150000000, max: 600000000, count: 5 }
      },
      fundingTrends: [
        { month: 'May 2025', totalAmount: 145000000, dealCount: 10 },
        { month: 'Jun 2025', totalAmount: 160000000, dealCount: 12 },
        { month: 'Jul 2025', totalAmount: 175000000, dealCount: 13 },
        { month: 'Aug 2025', totalAmount: 190000000, dealCount: 15 },
        { month: 'Sep 2025', totalAmount: 210000000, dealCount: 16 },
        { month: 'Oct 2025', totalAmount: 230000000, dealCount: 18 }
      ],
      insights: {
        totalFunding: 1110000000,
        totalDeals: 84,
        avgDealSize: 13214286,
        topRound: 'Series A',
        growthRate: 12.8,
        hotTrends: ['AI Tutoring', 'Skill-based Learning', 'Corporate Training']
      }
    },
    healthtech: {
      recentRounds: [
        {
          id: 1,
          companyName: 'MediAI Diagnostics',
          roundType: 'Series B',
          amount: 55000000,
          date: '2025-10-08',
          leadInvestor: 'Softbank Vision Fund',
          investors: ['Softbank Vision Fund', 'Google Ventures', 'ARCH Venture'],
          valuation: 250000000,
          location: 'Boston, USA'
        },
        {
          id: 2,
          companyName: 'TeleHealth Connect',
          roundType: 'Series A',
          amount: 22000000,
          date: '2025-09-12',
          leadInvestor: 'Khosla Ventures',
          investors: ['Khosla Ventures', 'Rock Health'],
          valuation: 95000000,
          location: 'London, UK'
        }
      ],
      activeInvestors: [
        {
          name: 'Rock Health',
          investmentCount: 22,
          totalInvested: 480000000,
          avgTicketSize: 21818182,
          focus: ['Seed', 'Series A', 'Series B'],
          location: 'San Francisco, USA',
          portfolio: ['Omada Health', 'Oscar Health', 'Livongo']
        },
        {
          name: 'Khosla Ventures',
          investmentCount: 14,
          totalInvested: 520000000,
          avgTicketSize: 37142857,
          focus: ['Series A', 'Series B', 'Series C'],
          location: 'Menlo Park, USA',
          portfolio: ['23andMe', 'Tempus', 'Guardant Health']
        }
      ],
      valuationTrends: {
        seed: { avg: 9000000, min: 3000000, max: 15000000, count: 35 },
        seriesA: { avg: 40000000, min: 18000000, max: 70000000, count: 25 },
        seriesB: { avg: 140000000, min: 70000000, max: 280000000, count: 18 },
        seriesC: { avg: 450000000, min: 250000000, max: 900000000, count: 10 }
      },
      fundingTrends: [
        { month: 'May 2025', totalAmount: 195000000, dealCount: 11 },
        { month: 'Jun 2025', totalAmount: 220000000, dealCount: 13 },
        { month: 'Jul 2025', totalAmount: 240000000, dealCount: 14 },
        { month: 'Aug 2025', totalAmount: 265000000, dealCount: 16 },
        { month: 'Sep 2025', totalAmount: 290000000, dealCount: 18 },
        { month: 'Oct 2025', totalAmount: 320000000, dealCount: 20 }
      ],
      insights: {
        totalFunding: 1530000000,
        totalDeals: 92,
        avgDealSize: 16630435,
        topRound: 'Series B',
        growthRate: 18.2,
        hotTrends: ['AI Diagnostics', 'Remote Patient Monitoring', 'Mental Health Tech']
      }
    },
    saas: {
      recentRounds: [
        {
          id: 1,
          companyName: 'CloudOps Pro',
          roundType: 'Series C',
          amount: 75000000,
          date: '2025-10-20',
          leadInvestor: 'Bessemer Venture Partners',
          investors: ['Bessemer Venture Partners', 'Battery Ventures', 'Insight Partners'],
          valuation: 420000000,
          location: 'Austin, USA'
        },
        {
          id: 2,
          companyName: 'DataSync AI',
          roundType: 'Series B',
          amount: 40000000,
          date: '2025-09-25',
          leadInvestor: 'Index Ventures',
          investors: ['Index Ventures', 'Accel', 'Salesforce Ventures'],
          valuation: 180000000,
          location: 'San Francisco, USA'
        }
      ],
      activeInvestors: [
        {
          name: 'Bessemer Venture Partners',
          investmentCount: 28,
          totalInvested: 920000000,
          avgTicketSize: 32857143,
          focus: ['Series A', 'Series B', 'Series C'],
          location: 'Menlo Park, USA',
          portfolio: ['Shopify', 'Twilio', 'SendGrid']
        },
        {
          name: 'Battery Ventures',
          investmentCount: 20,
          totalInvested: 640000000,
          avgTicketSize: 32000000,
          focus: ['Series B', 'Series C', 'Growth'],
          location: 'Boston, USA',
          portfolio: ['Gainsight', 'Atlassian', 'Zendesk']
        }
      ],
      valuationTrends: {
        seed: { avg: 10000000, min: 4000000, max: 18000000, count: 52 },
        seriesA: { avg: 45000000, min: 20000000, max: 80000000, count: 35 },
        seriesB: { avg: 150000000, min: 80000000, max: 300000000, count: 22 },
        seriesC: { avg: 480000000, min: 300000000, max: 1000000000, count: 12 }
      },
      fundingTrends: [
        { month: 'May 2025', totalAmount: 285000000, dealCount: 18 },
        { month: 'Jun 2025', totalAmount: 310000000, dealCount: 20 },
        { month: 'Jul 2025', totalAmount: 340000000, dealCount: 22 },
        { month: 'Aug 2025', totalAmount: 375000000, dealCount: 24 },
        { month: 'Sep 2025', totalAmount: 410000000, dealCount: 26 },
        { month: 'Oct 2025', totalAmount: 450000000, dealCount: 28 }
      ],
      insights: {
        totalFunding: 2170000000,
        totalDeals: 138,
        avgDealSize: 15724638,
        topRound: 'Series B',
        growthRate: 14.3,
        hotTrends: ['AI-Powered Analytics', 'No-Code Platforms', 'API-First Tools']
      }
    }
  };

  const normalizedIndustry = industry.toLowerCase();
  return fundingDatabase[normalizedIndustry] || fundingDatabase.fintech;
};

// @route   GET api/funding-environment
// @desc    Get funding environment data for a specific industry
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { industry = 'fintech', timeframe = '6months' } = req.query;
    
    const fundingData = getFundingData(industry, timeframe);
    
    res.json({
      industry,
      timeframe,
      lastUpdated: new Date().toISOString(),
      data: fundingData
    });
  } catch (err) {
    console.error('Error fetching funding environment:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/funding-environment/industries
// @desc    Get list of supported industries
// @access  Private
router.get('/industries', authMiddleware, async (req, res) => {
  try {
    const industries = [
      { id: 'fintech', name: 'FinTech', icon: '💰' },
      { id: 'edtech', name: 'EdTech', icon: '📚' },
      { id: 'healthtech', name: 'HealthTech', icon: '🏥' },
      { id: 'saas', name: 'SaaS', icon: '☁️' },
      { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
      { id: 'foodtech', name: 'FoodTech', icon: '🍔' }
    ];
    
    res.json(industries);
  } catch (err) {
    console.error('Error fetching industries:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;