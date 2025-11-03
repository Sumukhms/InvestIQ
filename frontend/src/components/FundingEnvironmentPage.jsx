// frontend/src/components/FundingEnvironmentPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Users, Building, Calendar, Award } from 'lucide-react';

const FundingEnvironmentPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('fintech');
  const [fundingData, setFundingData] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (selectedIndustry) {
      fetchFundingData();
    }
  }, [selectedIndustry]);

  const fetchIndustries = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('/api/funding-environment/industries', config);
      setIndustries(res.data);
    } catch (err) {
      console.error('Failed to fetch industries:', err);
    }
  };

  const fetchFundingData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get(`/api/funding-environment?industry=${selectedIndustry}`, config);
      setFundingData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch funding data:', err);
      setError('Failed to load funding environment data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-xl">
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Funding Environment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={fetchFundingData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!fundingData) return null;

  const { recentRounds, activeInvestors, valuationTrends, fundingTrends, insights } = fundingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Funding Environment
          </h1>
          <p className="text-gray-400">Comprehensive funding insights and investment climate analysis</p>
        </div>

        {/* Industry Selector */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Select Industry</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {industries.map(industry => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedIndustry === industry.id
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                }`}
              >
                <div className="text-3xl mb-2">{industry.icon}</div>
                <div className="text-sm font-medium text-white">{industry.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">6M Total</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(insights.totalFunding)}
            </div>
            <div className="text-sm text-gray-400">Total Funding Raised</div>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">+{insights.growthRate}%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <Building className="w-8 h-8 text-purple-400" />
              <span className="text-purple-400 text-xs font-medium">Active</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {insights.totalDeals}
            </div>
            <div className="text-sm text-gray-400">Total Deals Closed</div>
            <div className="mt-2 text-purple-400 text-sm font-medium">
              Avg: {formatCurrency(insights.avgDealSize)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl border border-green-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Popular</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {insights.topRound}
            </div>
            <div className="text-sm text-gray-400">Most Active Round</div>
            <div className="mt-2 text-green-400 text-sm font-medium">
              Leading stage
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl border border-yellow-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-medium">Tracking</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {activeInvestors.length}
            </div>
            <div className="text-sm text-gray-400">Active Investors</div>
            <div className="mt-2 text-yellow-400 text-sm font-medium">
              Top tier VCs
            </div>
          </div>
        </div>

        {/* Hot Trends Banner */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-blue-400">🔥 Hot Trends in {selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {insights.hotTrends.map((trend, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700"
              >
                {trend}
              </span>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6">
          <div className="flex border-b border-gray-700 overflow-x-auto">
            {[
              { id: 'overview', label: '📊 Overview', icon: null },
              { id: 'rounds', label: '💰 Recent Rounds', icon: null },
              { id: 'investors', label: '👥 Active Investors', icon: null },
              { id: 'valuations', label: '📈 Valuation Trends', icon: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Funding Trends Chart */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">6-Month Funding Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fundingTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="month" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                  <Line
                    type="monotone"
                    dataKey="totalAmount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    name="Total Funding"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Deal Count by Month */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Deal Count by Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fundingTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="month" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  />
                  <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                  <Bar dataKey="dealCount" fill="#8b5cf6" name="Number of Deals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedTab === 'rounds' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Funding Rounds</h3>
              <div className="space-y-4">
                {recentRounds.map(round => (
                  <div
                    key={round.id}
                    className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{round.companyName}</h4>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700">
                            {round.roundType}
                          </span>
                          <span className="text-gray-400 text-sm">📍 {round.location}</span>
                          <span className="text-gray-400 text-sm">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {new Date(round.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          {formatCurrency(round.amount)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Valuation: {formatCurrency(round.valuation)}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <div className="mb-2">
                        <span className="text-gray-400 text-sm">Lead Investor: </span>
                        <span className="text-blue-400 font-medium">{round.leadInvestor}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Investors: </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {round.investors.map((investor, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs border border-gray-600"
                            >
                              {investor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'investors' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Most Active Investors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeInvestors.map((investor, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-6 border border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{investor.name}</h4>
                        <p className="text-sm text-gray-400">📍 {investor.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">
                          {investor.investmentCount}
                        </div>
                        <div className="text-xs text-gray-400">Investments</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Total Invested</div>
                        <div className="text-lg font-bold text-green-400">
                          {formatCurrency(investor.totalInvested)}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Avg. Ticket</div>
                        <div className="text-lg font-bold text-purple-400">
                          {formatCurrency(investor.avgTicketSize)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Focus Stages:</div>
                      <div className="flex flex-wrap gap-2">
                        {investor.focus.map((stage, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs border border-blue-700"
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 mb-2">Notable Portfolio:</div>
                      <div className="text-sm text-gray-300">
                        {investor.portfolio.join(' • ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'valuations' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Average Valuations by Stage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(valuationTrends).map(([stage, data]) => (
                  <div
                    key={stage}
                    className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-6 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-white capitalize">
                        {stage.replace('series', 'Series ')}
                      </h4>
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium">
                        {data.count} deals
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Average Valuation</div>
                        <div className="text-3xl font-bold text-blue-400">
                          {formatCurrency(data.avg)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Minimum</div>
                          <div className="text-lg font-medium text-gray-300">
                            {formatCurrency(data.min)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Maximum</div>
                          <div className="text-lg font-medium text-gray-300">
                            {formatCurrency(data.max)}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Range</span>
                          <span className="text-sm font-medium text-gray-300">
                            {formatCurrency(data.min)} - {formatCurrency(data.max)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Valuation Distribution Chart */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Deal Distribution by Stage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(valuationTrends).map(([stage, data]) => ({
                      name: stage.replace('series', 'Series ').replace(/^(.)/, m => m.toUpperCase()),
                      value: data.count
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.keys(valuationTrends).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Data last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1">Information sourced from public funding databases and market research</p>
        </div>
      </div>
    </div>
  );
};

export default FundingEnvironmentPage;