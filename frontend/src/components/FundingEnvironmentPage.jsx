// frontend/src/components/FundingEnvironmentPage.jsx
// Investor Intel 2.0 — Fixed to match backend data structure

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Rocket, TrendingUp, Newspaper, ExternalLink, Loader2, Activity, RefreshCw
} from "lucide-react";

const FundingEnvironmentPage = () => {
  const [activeTab, setActiveTab] = useState("ipos");
  const [intel, setIntel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchMarketIntel();
    const id = setInterval(fetchMarketIntel, 15 * 60 * 1000); // auto-refresh 15m
    return () => clearInterval(id);
  }, []);

  async function fetchMarketIntel() {
    setIsLoading(true);
    setErr(null);
    try {
      const res = await axios.get("/api/funding-environment/market-intelligence");
      if (res.data?.success) {
        setIntel(res.data.data);
        console.log("✅ Market data loaded:", res.data.cached ? "(cached)" : "(fresh)");
      } else {
        setErr("Invalid response from server");
      }
    } catch (e) {
      console.error("Error fetching investor intel:", e);
      setErr(e.response?.data?.hint || "Failed to load market data. Check API keys or network connection.");
    } finally {
      setIsLoading(false);
    }
  }

  const lastUpdated = intel?.updatedAt
    ? new Date(intel.updatedAt).toLocaleString()
    : "—";

  // Convenience getters with safe defaults
  const ipoSeries = intel?.analytics?.ipoSeries || [];
  const trending = intel?.analytics?.trending || [];
  const sectorHeat = intel?.analytics?.sectorHeat || [];
  const sentiment = intel?.analytics?.sentiment || { positive: 0, negative: 0, neutral: 0 };
  const totalIpos = ipoSeries.reduce((sum, item) => sum + (item?.count || 0), 0);

  if (isLoading && !intel) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p>Fetching real-time investor insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Funding Environment
            </h1>
            <p className="text-gray-400 mt-1">Live IPOs • Market Movers • Investor News</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchMarketIntel}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="text-right">
              <div className="text-xs text-gray-500">Last updated</div>
              <div className="text-sm text-gray-300">{lastUpdated}</div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="text-blue-300 text-sm mb-1 flex items-center gap-2">
              <Rocket className="w-4 h-4" /> IPOs (8-month window)
            </div>
            <div className="text-3xl font-bold text-blue-400">{totalIpos}</div>
          </div>
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <div className="text-green-300 text-sm mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Trending Tickers
            </div>
            <div className="text-3xl font-bold text-green-400">{trending.length}</div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <div className="text-yellow-300 text-sm mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Sentiment
            </div>
            <div className="text-xl font-bold text-yellow-400">
              {sentiment.positive}% Pos / {sentiment.negative}% Neg
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {err && (
          <div className="bg-red-900/20 border border-red-700 text-red-200 rounded-lg p-3 mb-4">
            <strong>Error:</strong> {err}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6">
          <div className="flex border-b border-gray-700 overflow-x-auto">
            {[
              { id: "ipos", label: "🚀 IPO Watch" },
              { id: "stocks", label: "📈 Market Movers" },
              { id: "news", label: "📰 Investor News" },
              { id: "insights", label: "📊 Insights" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-400 border-b-2 border-blue-400 bg-gray-750"
                    : "text-gray-400 hover:text-white hover:bg-gray-750"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* IPO Tab */}
        {activeTab === "ipos" && (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">📅 Upcoming & Recent IPOs</h3>
              <p className="text-gray-300 text-sm">
                Real-time IPO calendar powered by Financial Modeling Prep API
              </p>
            </div>

            {/* IPO Trend Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-300 font-semibold mb-3">IPO Volume Trend (Last 8 Months)</div>
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <LineChart data={ipoSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis allowDecimals={false} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#E5E7EB' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* IPO Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {intel?.ipos?.length ? (
                intel.ipos.map((ipo, i) => (
                  <div 
                    key={i} 
                    className="bg-gray-800 border border-gray-700 p-4 rounded-lg hover:border-blue-500 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{ipo.company || ipo.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">
                        <span className="text-blue-400 font-semibold">{ipo.symbol}</span>
                        {ipo.exchange && <span className="ml-2 text-gray-500">• {ipo.exchange}</span>}
                      </p>
                      {ipo.date && (
                        <p className="text-gray-300">
                          📅 {new Date(ipo.date).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </p>
                      )}
                      {ipo.priceRange && (
                        <p className="text-green-400 font-semibold mt-2">{ipo.priceRange}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-400 text-center py-8">
                  No IPO data available at this time.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Market Movers Tab */}
        {activeTab === "stocks" && (
          <div className="space-y-6">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">📊 Market Highlights & Trending Stocks</h3>
              <p className="text-gray-300 text-sm">
                Live market news and trending tickers powered by Finnhub API
              </p>
            </div>

            {/* Trending Tickers */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-300 font-semibold mb-3">🔥 Most Mentioned Tickers</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {trending.length ? (
                  trending.slice(0, 10).map((t, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-3 text-center">
                      <div className="text-blue-400 font-bold text-lg">{t.ticker}</div>
                      <div className="text-gray-400 text-xs">{t.hits} mentions</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-gray-400">No trending tickers detected.</div>
                )}
              </div>
            </div>

            {/* Market Headlines */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-gray-300 font-semibold">📰 Latest Market Headlines</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-700 text-gray-200 uppercase text-xs">
                    <tr>
                      <th className="p-3">Related</th>
                      <th className="p-3">Headline</th>
                      <th className="p-3">Source</th>
                      <th className="p-3 w-20">Link</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {intel?.stocks?.length ? (
                      intel.stocks.slice(0, 15).map((s, i) => (
                        <tr key={i} className="border-b border-gray-700 hover:bg-gray-750">
                          <td className="p-3">
                            <span className="text-blue-400 font-semibold">
                              {s.related?.split(',')[0] || '—'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-300">{s.headline}</td>
                          <td className="p-3 text-gray-500 text-xs">{s.source}</td>
                          <td className="p-3">
                            <a 
                              href={s.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3 text-center text-gray-400" colSpan={4}>
                          No market headlines available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <div className="space-y-6">
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">📰 Investor & Funding News</h3>
              <p className="text-gray-300 text-sm">
                Latest venture capital, IPO, and funding news aggregated from NewsAPI
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {intel?.news?.length ? (
                intel.news.slice(0, 12).map((n, i) => (
                  <a 
                    key={i} 
                    href={n.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 border border-gray-700 p-4 rounded-lg hover:border-yellow-400 hover:shadow-lg transition-all group"
                  >
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {n.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2">
                      {n.source?.name} • {new Date(n.publishedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-300 text-sm line-clamp-3">{n.description}</p>
                  </a>
                ))
              ) : (
                <div className="col-span-full text-gray-400 text-center py-8">
                  No investor news available at this time.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">🧠 AI-Powered Market Insights</h3>
              <p className="text-gray-300 text-sm">
                Automated analytics: sentiment analysis, sector trends, and market signals
              </p>
            </div>

            {/* Sentiment Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-300 font-semibold mb-3">📊 News Sentiment Analysis</div>
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <BarChart data={[
                    { type: "Positive", value: sentiment.positive, fill: "#10B981" },
                    { type: "Neutral", value: sentiment.neutral, fill: "#6B7280" },
                    { type: "Negative", value: sentiment.negative, fill: "#EF4444" },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9CA3AF" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="#9CA3AF" />
                    <Tooltip 
                      formatter={(v) => `${v}%`}
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    />
                    <Bar dataKey="value">
                      {[
                        { type: "Positive", value: sentiment.positive, fill: "#10B981" },
                        { type: "Neutral", value: sentiment.neutral, fill: "#6B7280" },
                        { type: "Negative", value: sentiment.negative, fill: "#EF4444" },
                      ].map((entry, index) => (
                        <Bar key={`bar-${index}`} dataKey="value" fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sector Heat Map */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-300 font-semibold mb-3">🔥 Hot Sectors (by mentions)</div>
              <div className="flex flex-wrap gap-3">
                {sectorHeat.length ? (
                  sectorHeat.map((s, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-2 rounded-full border border-purple-700 bg-purple-900/30 text-purple-200"
                    >
                      <span className="font-semibold">{s.sector}</span>
                      <span className="ml-2 text-purple-400">• {s.count}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400">No sector signals detected yet.</span>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-300">⚠️ Disclaimer:</strong> This information is for educational 
                and informational purposes only. It is not financial advice. Data provided by Financial Modeling Prep, 
                Finnhub, and NewsAPI. Always conduct your own research and consult with a qualified financial advisor 
                before making investment decisions.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingEnvironmentPage;