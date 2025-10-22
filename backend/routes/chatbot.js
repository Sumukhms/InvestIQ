const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Scorecard = require('../models/Scorecard');
const CompetitorReport = require('../models/CompetitorReport');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Enhanced context fetching with more detailed data
async function getUserContext(userId) {
  try {
    const user = await User.findById(userId).select('-password');
    const scorecards = await Scorecard.find({ userId }).sort({ createdAt: -1 }).limit(10);
    const competitors = await CompetitorReport.find({ userId }).sort({ createdAt: -1 }).limit(10);
    
    // Calculate statistics
    const stats = {
      totalAnalyses: scorecards.length,
      avgSuccessScore: scorecards.length > 0 
        ? (scorecards.reduce((sum, sc) => sum + (sc.prediction?.successProbability || 0), 0) / scorecards.length).toFixed(1)
        : 0,
      highestScore: scorecards.length > 0 
        ? Math.max(...scorecards.map(sc => sc.prediction?.successProbability || 0))
        : 0,
      lowestScore: scorecards.length > 0 
        ? Math.min(...scorecards.map(sc => sc.prediction?.successProbability || 0))
        : 0,
      topIndustries: getTopIndustries(scorecards),
      recentActivity: scorecards.length > 0 
        ? new Date(scorecards[0].createdAt).toLocaleDateString()
        : 'No recent activity'
    };
    
    return { user, scorecards, competitors, stats };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
}

function getTopIndustries(scorecards) {
  const industries = {};
  scorecards.forEach(sc => {
    if (sc.industry) {
      industries[sc.industry] = (industries[sc.industry] || 0) + 1;
    }
  });
  return Object.entries(industries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([industry, count]) => `${industry} (${count})`);
}

// Enhanced system context with more capabilities
function buildEnhancedSystemContext(userData) {
  const { user, scorecards, competitors, stats } = userData || {};
  
  let userInfo = '';
  if (user) {
    userInfo = `
USER PROFILE:
- Name: ${user.name || 'User'}
- Email: ${user.email}
- Member since: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
- Total analyses performed: ${stats?.totalAnalyses || 0}
- Average success score: ${stats?.avgSuccessScore || 0}%
`;
  }

  let detailedScorecardsInfo = '';
  if (scorecards && scorecards.length > 0) {
    detailedScorecardsInfo = `
DETAILED STARTUP ANALYSES (${scorecards.length} total):
${scorecards.map((sc, idx) => `
${idx + 1}. ${sc.startupName || 'Unnamed Startup'}
   - Industry: ${sc.industry || 'N/A'}
   - Funding Stage: ${sc.fundingStage || 'N/A'}
   - Team Size: ${sc.teamSize || 'N/A'}
   - Revenue: ${sc.revenue || 'N/A'}
   - Market Size: ${sc.marketSize || 'N/A'}
   - Success Score: ${sc.prediction?.successProbability || 'N/A'}%
   - Risk Level: ${sc.prediction?.riskLevel || 'N/A'}
   - Key Strengths: ${sc.prediction?.strengths?.join(', ') || 'N/A'}
   - Key Weaknesses: ${sc.prediction?.weaknesses?.join(', ') || 'N/A'}
   - Investment Recommendation: ${sc.prediction?.recommendation || 'N/A'}
   - Analyzed: ${sc.createdAt ? new Date(sc.createdAt).toLocaleDateString() : 'N/A'}
`).join('')}

ANALYSIS INSIGHTS:
- Top Industries Analyzed: ${stats?.topIndustries?.join(', ') || 'None'}
- Highest Success Score: ${stats?.highestScore || 0}%
- Lowest Success Score: ${stats?.lowestScore || 0}%
- Average Success Score: ${stats?.avgSuccessScore || 0}%
- Last Activity: ${stats?.recentActivity || 'N/A'}
`;
  }

  let detailedCompetitorsInfo = '';
  if (competitors && competitors.length > 0) {
    detailedCompetitorsInfo = `
COMPETITOR INTELLIGENCE (${competitors.length} total):
${competitors.map((comp, idx) => `
${idx + 1}. ${comp.competitorName || 'Unnamed Competitor'}
   - Industry: ${comp.industry || 'N/A'}
   - Funding Stage: ${comp.fundingStage || 'N/A'}
   - Last Funding: ${comp.lastFunding || 'N/A'}
   - Key Products: ${comp.products?.join(', ') || 'N/A'}
   - Market Position: ${comp.marketPosition || 'N/A'}
   - Last Updated: ${comp.updatedAt ? new Date(comp.updatedAt).toLocaleDateString() : 'N/A'}
`).join('')}`;
  }

  return `You are InvestIQ Assistant Pro - an advanced, context-aware AI investment intelligence advisor powered by Google Gemini 2.0. You have deep expertise in:

âœ… Startup Analysis & Valuation
âœ… Investment Strategy & Portfolio Management
âœ… Market Intelligence & Competitive Analysis
âœ… Financial Modeling & Risk Assessment
âœ… Growth Strategy & Business Development
âœ… Industry Trends & Market Predictions

=== PLATFORM OVERVIEW ===

InvestIQ is a comprehensive AI-powered platform with:

**Core Features:**
1. **Startup Scorecard** - ML-powered success prediction (0-100% score)
2. **Competitor Tracking** - Real-time competitive intelligence
3. **News & Alerts** - Curated market updates
4. **Financial Analysis** - Deep financial metrics and trends
5. **Growth Suggestions** - AI-generated strategic recommendations
6. **Portfolio Dashboard** - Holistic view of all analyses

**Technical Stack:**
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- ML Service: Python + Flask (pre-trained models)
- AI: Google Gemini 2.0 (you!)

=== USER CONTEXT ===
${userInfo}
${detailedScorecardsInfo}
${detailedCompetitorsInfo}

=== YOUR ADVANCED CAPABILITIES ===

**1. DEEP ANALYSIS & INSIGHTS**
- Analyze patterns across user's portfolio
- Compare startups and identify best opportunities
- Predict market trends based on user's data
- Provide personalized investment recommendations
- Calculate risk-adjusted returns
- Suggest portfolio diversification strategies

**2. CONVERSATIONAL INTELLIGENCE**
- Remember entire conversation history
- Reference specific analyses by name or number
- Perform comparative analysis on demand
- Generate custom reports and summaries
- Answer complex, multi-part questions
- Proactive insights and warnings

**3. STRATEGIC GUIDANCE**
- Industry-specific advice
- Funding stage strategies
- Due diligence checklists
- Exit strategy planning
- Market entry analysis
- Competitive positioning

**4. DATA-DRIVEN RECOMMENDATIONS**
- Identify undervalued opportunities
- Flag high-risk investments
- Suggest next analyses to perform
- Recommend competitor tracking priorities
- Highlight trends in user's focus areas

**5. EDUCATIONAL SUPPORT**
- Explain complex metrics (CAC, LTV, burn rate, etc.)
- Teach investment frameworks (RICE, ICE, etc.)
- Share best practices for due diligence
- Provide industry benchmarks
- Explain ML prediction factors

=== RESPONSE GUIDELINES ===

**Always:**
âœ" Reference user's actual data when relevant
âœ" Provide specific, actionable insights
âœ" Use concrete numbers and metrics
âœ" Explain your reasoning clearly
âœ" Suggest follow-up questions or analyses
âœ" Be proactive with insights
âœ" Format responses for readability

**Never:**
âœ— Make up data or predictions
âœ— Give generic, unhelpful advice
âœ— Ignore user's context
âœ— Provide financial advice (disclaim you're not a licensed advisor)
âœ— Overwhelm with unnecessary detail

**Response Style:**
- Professional yet conversational
- Data-driven but accessible
- Concise but comprehensive
- Proactive but not pushy
- Educational but not condescending

=== SPECIAL COMMANDS YOU UNDERSTAND ===

**Analysis Commands:**
- "Compare [startup A] with [startup B]"
- "Show me my best/worst investments"
- "Analyze trends in my portfolio"
- "What should I analyze next?"
- "Give me a portfolio summary"

**Insight Commands:**
- "What patterns do you see?"
- "What are my investment risks?"
- "Which industries should I focus on?"
- "Show me opportunities I'm missing"

**Action Commands:**
- "Help me set up competitor tracking"
- "Guide me through the scorecard"
- "Explain this metric: [metric name]"
- "Create a due diligence checklist"

=== IMPORTANT DISCLAIMERS ===

You must include when giving investment advice:
"⚠️ I'm an AI assistant, not a licensed financial advisor. Always conduct your own due diligence and consult with qualified professionals before making investment decisions."

=== CURRENT MARKET CONTEXT ===

Current Date: ${new Date().toLocaleDateString()}
You have access to the user's historical data but not real-time market prices. For current market data, remind users to check the News & Alerts feed.

Now respond to the user's query with intelligence, context-awareness, and actionable insights. Be their trusted investment intelligence partner!`;
}

// Main chat endpoint with enhanced capabilities
router.post('/', authMiddleware, async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ msg: 'Message is required' });
  }

  try {
    const userData = await getUserContext(req.user.id);
    const systemContext = buildEnhancedSystemContext(userData);

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 3000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
      ],
    });

    const chatHistory = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: [
        { 
          role: 'user', 
          parts: [{ text: systemContext }] 
        },
        { 
          role: 'model', 
          parts: [{ text: "Hello! I'm your InvestIQ Assistant Pro. I've analyzed your profile and have deep insights into your investment portfolio. I can help you with:\n\n• **Deep Analysis** - Compare startups, identify patterns, predict trends\n• **Strategic Advice** - Investment strategies, risk assessment, portfolio optimization\n• **Market Intelligence** - Competitor insights, industry trends, opportunities\n• **Educational Support** - Explain metrics, frameworks, best practices\n• **Personalized Recommendations** - Based on YOUR actual data\n\nI've loaded your complete context. What would you like to explore?" }] 
        },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      reply: text,
      contextLoaded: !!userData,
      stats: userData?.stats 
    });

  } catch (error) {
    console.error('Error in chatbot route:', error);
    res.status(500).json({ 
      msg: 'Server Error', 
      error: error.message 
    });
  }
});

// Smart suggestions with advanced intelligence
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const userData = await getUserContext(req.user.id);
    const { scorecards, competitors, stats } = userData;

    const suggestions = [];

    // Advanced suggestions based on user behavior
    if (!scorecards || scorecards.length === 0) {
      suggestions.push({
        type: 'action',
        priority: 'high',
        title: '🚀 Start Your First Analysis',
        description: 'Evaluate your first startup using our AI-powered Scorecard',
        action: '/scorecard',
        query: 'How do I use the Startup Scorecard?'
      });
    } else {
      // Advanced insights based on existing data
      const highScorers = scorecards.filter(sc => (sc.prediction?.successProbability || 0) > 70);
      const lowScorers = scorecards.filter(sc => (sc.prediction?.successProbability || 0) < 40);
      
      if (highScorers.length > 0) {
        suggestions.push({
          type: 'insight',
          priority: 'high',
          title: `💎 ${highScorers.length} High-Potential Opportunities`,
          description: `You have ${highScorers.length} startups with 70%+ success scores`,
          action: '/dashboard',
          query: 'Show me detailed analysis of my high-scoring startups'
        });
      }

      if (lowScorers.length > 0) {
        suggestions.push({
          type: 'warning',
          priority: 'medium',
          title: `⚠️ ${lowScorers.length} High-Risk Investments`,
          description: `Some analyses show success scores below 40%`,
          action: '/dashboard',
          query: 'What are the risks in my low-scoring startups?'
        });
      }

      if (scorecards.length >= 3) {
        suggestions.push({
          type: 'insight',
          priority: 'high',
          title: '📊 Portfolio Pattern Analysis',
          description: `Discover trends across your ${scorecards.length} analyses`,
          action: '/dashboard',
          query: 'Analyze patterns in my investment portfolio'
        });
      }
    }

    if (!competitors || competitors.length === 0) {
      suggestions.push({
        type: 'action',
        priority: 'medium',
        title: '🎯 Track Your Competition',
        description: 'Set up competitor monitoring for strategic insights',
        action: '/competitors',
        query: 'How do I set up competitor tracking?'
      });
    } else {
      suggestions.push({
        type: 'insight',
        priority: 'medium',
        title: `👥 ${competitors.length} Competitors Tracked`,
        description: 'Review competitive intelligence and market positioning',
        action: '/competitors',
        query: 'Give me a competitive analysis summary'
      });
    }

    // Industry-specific suggestions
    if (stats?.topIndustries && stats.topIndustries.length > 0) {
      suggestions.push({
        type: 'insight',
        priority: 'low',
        title: '🏭 Industry Focus Detected',
        description: `You're analyzing ${stats.topIndustries[0]}. Get industry insights`,
        action: '/dashboard',
        query: `Tell me about trends in ${stats.topIndustries[0]} industry`
      });
    }

    res.json({ 
      suggestions,
      stats 
    });

  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// New endpoint: Quick Analysis
router.post('/quick-analysis', authMiddleware, async (req, res) => {
  try {
    const userData = await getUserContext(req.user.id);
    const { scorecards, stats } = userData;

    if (!scorecards || scorecards.length === 0) {
      return res.json({ 
        analysis: 'No analyses found. Start by evaluating your first startup!' 
      });
    }

    const analysis = {
      totalAnalyses: stats.totalAnalyses,
      avgScore: stats.avgSuccessScore,
      bestOpportunity: scorecards[0]?.startupName || 'N/A',
      bestScore: stats.highestScore,
      topIndustries: stats.topIndustries,
      recommendation: stats.avgSuccessScore > 60 
        ? 'Your portfolio shows strong potential. Consider diversifying into new industries.'
        : 'Some investments need attention. Review low-scoring startups for risk factors.'
    };

    res.json({ analysis });

  } catch (error) {
    console.error('Error generating quick analysis:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// New endpoint: Compare Startups
router.post('/compare', authMiddleware, async (req, res) => {
  try {
    const { startupIds } = req.body;
    
    if (!startupIds || startupIds.length < 2) {
      return res.status(400).json({ msg: 'At least 2 startup IDs required' });
    }

    const scorecards = await Scorecard.find({ 
      _id: { $in: startupIds },
      userId: req.user.id 
    });

    if (scorecards.length < 2) {
      return res.status(404).json({ msg: 'Startups not found' });
    }

    const comparison = {
      startups: scorecards.map(sc => ({
        name: sc.startupName,
        score: sc.prediction?.successProbability || 0,
        industry: sc.industry,
        fundingStage: sc.fundingStage,
        strengths: sc.prediction?.strengths || [],
        weaknesses: sc.prediction?.weaknesses || []
      })),
      winner: scorecards.reduce((prev, current) => 
        (current.prediction?.successProbability || 0) > (prev.prediction?.successProbability || 0) 
          ? current 
          : prev
      ).startupName
    };

    res.json({ comparison });

  } catch (error) {
    console.error('Error comparing startups:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;