import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell 
} from 'recharts';

// Helper function to format large numbers
const formatYAxis = (tickItem) => {
  if (tickItem >= 1000000) return `$${(tickItem / 1000000).toFixed(1)}M`;
  if (tickItem >= 1000) return `$${(tickItem / 1000).toFixed(0)}k`;
  return `$${tickItem}`;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Tooltips
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-xl">
        <p className="label text-blue-300 font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CashFlowTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const cashFlow = payload[0].value;
    const isPositive = cashFlow >= 0;
    return (
      <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-xl">
        <p className="label text-blue-300 font-semibold mb-2">{label}</p>
        <p className={isPositive ? 'text-green-400' : 'text-red-400'}>
          {`Cash Flow: ${formatCurrency(cashFlow)}`}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {isPositive ? '📈 Positive cash flow' : '📉 Burning cash'}
        </p>
      </div>
    );
  }
  return null;
};

const FinancialsPage = () => {
  // State for user inputs
  const [initialCash, setInitialCash] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [targetRevenue, setTargetRevenue] = useState('');

  // State for calculated metrics
  const [metrics, setMetrics] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  // State for chart data
  const [chartData, setChartData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [runwayData, setRunwayData] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load saved reports on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('financialReports');
    if (saved) {
      setSavedReports(JSON.parse(saved));
    }
  }, []);

  // Advanced inputs
  const [expenseCategories, setExpenseCategories] = useState({
    salaries: '',
    marketing: '',
    infrastructure: '',
    operations: '',
  });

  const handleCalculate = (e) => {
    e.preventDefault();

    // Validation
    const isNumericArray = (str) => str.split(',').every(val => !isNaN(parseFloat(val)) && isFinite(val.trim()));
    if (!isNumericArray(monthlyRevenue) || !isNumericArray(monthlyExpenses)) {
      alert("Please ensure Revenue and Expenses contain only comma-separated numbers.");
      return;
    }

    const revenueArray = monthlyRevenue.split(',').map(val => Number(val.trim()));
    const expensesArray = monthlyExpenses.split(',').map(val => Number(val.trim()));
    const startingCash = parseFloat(initialCash);

    // Calculate metrics
    const totalRevenue = revenueArray.reduce((acc, val) => acc + val, 0);
    const totalExpenses = expensesArray.reduce((acc, val) => acc + val, 0);
    const avgRevenue = totalRevenue / revenueArray.length;
    const avgExpenses = totalExpenses / expensesArray.length;
    const avgMonthlyBurn = avgExpenses - avgRevenue;

    // Calculate revenue growth rate
    const firstRevenue = revenueArray[0];
    const lastRevenue = revenueArray[revenueArray.length - 1];
    const growthRate = firstRevenue > 0 ? ((lastRevenue - firstRevenue) / firstRevenue) * 100 : 0;

    // Build chart data with cumulative cash
    let cumulativeCash = startingCash;
    const newChartData = [];
    const newCashFlowData = [];
    const newRunwayData = [];
    let profitableMonth = null;
    let cashoutMonth = null;

    for (let i = 0; i < revenueArray.length; i++) {
      const revenue = revenueArray[i];
      const expenses = expensesArray[i] || 0;
      const cashFlow = revenue - expenses;
      cumulativeCash += cashFlow;

      newChartData.push({
        name: `Month ${i + 1}`,
        revenue: revenue,
        expenses: expenses,
        cumulativeCash: cumulativeCash,
      });

      newCashFlowData.push({
        name: `Month ${i + 1}`,
        cashFlow: cashFlow,
      });

      // Calculate projected runway from this point
      const remainingCash = cumulativeCash;
      const currentBurn = expenses - revenue;
      const projectedRunway = currentBurn > 0 ? remainingCash / currentBurn : 999;

      newRunwayData.push({
        name: `Month ${i + 1}`,
        runway: Math.max(0, projectedRunway),
        cash: cumulativeCash,
      });

      // Track when profitable
      if (!profitableMonth && revenue > expenses) {
        profitableMonth = i + 1;
      }

      // Track when cash runs out
      if (!cashoutMonth && cumulativeCash <= 0) {
        cashoutMonth = i + 1;
      }
    }

    setChartData(newChartData);
    setCashFlowData(newCashFlowData);
    setRunwayData(newRunwayData);

    // Calculate final runway
    const finalRunway = avgMonthlyBurn > 0 ? cumulativeCash / avgMonthlyBurn : Infinity;

    // Expense breakdown (if provided)
    if (Object.values(expenseCategories).some(val => val !== '')) {
      const categories = [
        { name: 'Salaries', value: parseFloat(expenseCategories.salaries) || 0, color: '#3B82F6' },
        { name: 'Marketing', value: parseFloat(expenseCategories.marketing) || 0, color: '#10B981' },
        { name: 'Infrastructure', value: parseFloat(expenseCategories.infrastructure) || 0, color: '#F59E0B' },
        { name: 'Operations', value: parseFloat(expenseCategories.operations) || 0, color: '#EF4444' },
      ].filter(cat => cat.value > 0);
      setExpenseBreakdown(categories);
    }

    setMetrics({
      netBurn: avgMonthlyBurn,
      runway: finalRunway,
      cashBalance: cumulativeCash,
      avgRevenue,
      avgExpenses,
      totalRevenue,
      totalExpenses,
      growthRate,
      profitableMonth,
      cashoutMonth,
    });

    setHasCalculated(true);
  };

  const handleSaveReport = () => {
    if (!hasCalculated) {
      alert('Please calculate metrics first before saving.');
      return;
    }

    const reportName = prompt('Enter a name for this financial report:', `Report ${new Date().toLocaleDateString()}`);
    if (!reportName) return;

    const newReport = {
      id: Date.now(),
      name: reportName,
      date: new Date().toISOString(),
      data: {
        initialCash,
        monthlyRevenue,
        monthlyExpenses,
        expenseCategories,
        metrics,
        chartData,
        cashFlowData,
        runwayData,
        expenseBreakdown,
      }
    };

    const updatedReports = [newReport, ...savedReports];
    setSavedReports(updatedReports);
    localStorage.setItem('financialReports', JSON.stringify(updatedReports));
    alert('Report saved successfully!');
  };

  const handleLoadReport = (report) => {
    setInitialCash(report.data.initialCash);
    setMonthlyRevenue(report.data.monthlyRevenue);
    setMonthlyExpenses(report.data.monthlyExpenses);
    setExpenseCategories(report.data.expenseCategories);
    setMetrics(report.data.metrics);
    setChartData(report.data.chartData);
    setCashFlowData(report.data.cashFlowData);
    setRunwayData(report.data.runwayData);
    setExpenseBreakdown(report.data.expenseBreakdown);
    setHasCalculated(true);
    setShowSaved(false);
    alert(`Loaded: ${report.name}`);
  };

  const handleDeleteReport = (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    const updatedReports = savedReports.filter(r => r.id !== id);
    setSavedReports(updatedReports);
    localStorage.setItem('financialReports', JSON.stringify(updatedReports));
  };

  // Helper to get status color
  const getRunwayColor = (runway) => {
    if (runway === Infinity) return 'text-green-400';
    if (runway > 12) return 'text-green-400';
    if (runway > 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCashBalanceColor = (balance) => {
    if (balance > initialCash * 0.5) return 'text-green-400';
    if (balance > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white px-6 md:px-10 py-6">
      <div className="max-w-[95rem] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              Financial Health Dashboard
            </h1>
            <p className="text-gray-400">Comprehensive burn rate, runway, and cash flow analysis</p>
          </div>
          <div className="flex gap-2">
            {hasCalculated && (
              <button
                onClick={handleSaveReport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
              >
                💾 Save Report
              </button>
            )}
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              📁 Saved Reports ({savedReports.length})
            </button>
          </div>
        </div>

        {/* Saved Reports Modal */}
        {showSaved && (
          <div className="mb-4 bg-gray-800 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Saved Financial Reports</h3>
            {savedReports.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved reports yet. Calculate and save your first report!</p>
            ) : (
              <div className="space-y-2">
                {savedReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{report.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(report.date).toLocaleDateString()} at {new Date(report.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadReport(report)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Key Metric Cards */}
      {hasCalculated && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-xs font-medium uppercase mb-2">Net Burn Rate</h3>
          <p className={`text-3xl font-bold ${metrics.netBurn < 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(Math.abs(metrics.netBurn))}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.netBurn < 0 ? '📈 Generating profit' : '📉 Monthly burn'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-xs font-medium uppercase mb-2">Runway</h3>
          <p className={`text-3xl font-bold ${getRunwayColor(metrics.runway)}`}>
            {metrics.runway === Infinity ? '∞' : `${metrics.runway.toFixed(1)}`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.runway === Infinity ? 'Profitable!' : 'Months remaining'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-xs font-medium uppercase mb-2">Cash Balance</h3>
          <p className={`text-3xl font-bold ${getCashBalanceColor(metrics.cashBalance)}`}>
            {formatCurrency(metrics.cashBalance)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Current position</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-xs font-medium uppercase mb-2">Revenue Growth</h3>
          <p className={`text-3xl font-bold ${metrics.growthRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.growthRate > 0 ? '+' : ''}{metrics.growthRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Period over period</p>
        </div>
      </div>
      )}

      {/* Alerts Section */}
      {hasCalculated && metrics && (
        <>
        {(metrics.cashoutMonth || metrics.runway < 6) && metrics.runway !== Infinity && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-600 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-2xl">⚠️</span>
            <div>
              <h3 className="text-red-400 font-bold mb-1">Critical Alert</h3>
              {metrics.cashoutMonth && (
                <p className="text-red-300 text-sm">
                  Cash will run out in Month {metrics.cashoutMonth}. Immediate action required!
                </p>
              )}
              {metrics.runway < 6 && metrics.runway !== Infinity && (
                <p className="text-red-300 text-sm">
                  Less than 6 months runway remaining. Consider fundraising or cost reduction.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {hasCalculated && metrics && metrics.profitableMonth && (
        <div className="mb-8 p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-green-400 text-2xl">✓</span>
            <div>
              <h3 className="text-green-400 font-bold mb-1">Profitability Achieved</h3>
              <p className="text-green-300 text-sm">
                Your startup became profitable in Month {metrics.profitableMonth}!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input Form */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">📊 Input Your Financials</h2>
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Initial Cash Balance ($)
              </label>
              <input
                type="number"
                value={initialCash}
                onChange={(e) => setInitialCash(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 100000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Monthly Revenue (comma-separated)
              </label>
              <input
                type="text"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 5000, 5500, 6000, 7000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter monthly revenue for each period</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Monthly Expenses (comma-separated)
              </label>
              <input
                type="text"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10000, 10500, 11000, 11500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter monthly expenses for each period</p>
            </div>

            {/* Advanced Options */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
              >
                <span>{showAdvanced ? '▼' : '▶'}</span>
                <span>Advanced: Expense Breakdown (Optional)</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-700/30 rounded-lg space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Salaries ($)</label>
                    <input
                      type="number"
                      value={expenseCategories.salaries}
                      onChange={(e) => setExpenseCategories({...expenseCategories, salaries: e.target.value})}
                      className="w-full p-2 bg-gray-700 rounded text-white text-sm border border-gray-600"
                      placeholder="Monthly salaries"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Marketing ($)</label>
                    <input
                      type="number"
                      value={expenseCategories.marketing}
                      onChange={(e) => setExpenseCategories({...expenseCategories, marketing: e.target.value})}
                      className="w-full p-2 bg-gray-700 rounded text-white text-sm border border-gray-600"
                      placeholder="Monthly marketing spend"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Infrastructure ($)</label>
                    <input
                      type="number"
                      value={expenseCategories.infrastructure}
                      onChange={(e) => setExpenseCategories({...expenseCategories, infrastructure: e.target.value})}
                      className="w-full p-2 bg-gray-700 rounded text-white text-sm border border-gray-600"
                      placeholder="Hosting, tools, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Operations ($)</label>
                    <input
                      type="number"
                      value={expenseCategories.operations}
                      onChange={(e) => setExpenseCategories({...expenseCategories, operations: e.target.value})}
                      className="w-full p-2 bg-gray-700 rounded text-white text-sm border border-gray-600"
                      placeholder="Office, legal, etc."
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-[1.02]"
            >
              Calculate & Visualize
            </button>
          </form>
        </div>

        {/* Revenue vs Expenses Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">💰 Revenue vs. Expenses</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                <ReferenceLine y={0} stroke="#A0AEC0" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center min-h-[300px]">
              <p className="text-gray-500">Enter data to generate visualizations</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Charts */}
      {hasCalculated && chartData.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Cash Flow Chart */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">📊 Monthly Cash Flow</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" tickFormatter={formatYAxis} />
                  <Tooltip content={<CashFlowTooltip />} />
                  <ReferenceLine y={0} stroke="#A0AEC0" strokeWidth={2} />
                  <Bar dataKey="cashFlow" name="Cash Flow">
                    {cashFlowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cashFlow >= 0 ? '#10B981' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cumulative Cash Chart */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">💵 Cash Balance Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" tickFormatter={formatYAxis} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="cumulativeCash"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Cash Balance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown Pie Chart */}
          {expenseBreakdown.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">🥧 Expense Breakdown</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {expenseBreakdown.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-gray-300">{cat.name}: {formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Insights and Recommendations */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">💡 Insights & Recommendations</h2>
            <div className="space-y-4">
              {metrics && metrics.runway < 6 && metrics.runway !== Infinity && (
                <div className="p-4 bg-red-900/20 border border-red-600 rounded-lg">
                  <h3 className="font-semibold text-red-400 mb-2">⚠️ Critical Runway Alert</h3>
                  <p className="text-sm text-gray-300">
                    With less than 6 months runway, consider: (1) Immediate fundraising, (2) Revenue acceleration plans, or (3) Cost reduction strategies.
                  </p>
                </div>
              )}

              {metrics && metrics.growthRate < 0 && (
                <div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">📉 Revenue Declining</h3>
                  <p className="text-sm text-gray-300">
                    Revenue is trending downward ({metrics.growthRate.toFixed(1)}%). Review your product-market fit, pricing strategy, and customer retention.
                  </p>
                </div>
              )}

              {metrics && metrics.growthRate > 20 && (
                <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
                  <h3 className="font-semibold text-green-400 mb-2">🚀 Strong Growth</h3>
                  <p className="text-sm text-gray-300">
                    {metrics.growthRate.toFixed(1)}% revenue growth is excellent! Consider reinvesting in growth while managing burn rate carefully.
                  </p>
                </div>
              )}

              {metrics && metrics.netBurn < 0 && (
                <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
                  <h3 className="font-semibold text-green-400 mb-2">✅ Profitable Operations</h3>
                  <p className="text-sm text-gray-300">
                    You're generating {formatCurrency(Math.abs(metrics.netBurn))}/month in profit! Consider strategic reinvestment for growth.
                  </p>
                </div>
              )}

              {metrics && metrics.avgExpenses / metrics.avgRevenue > 2 && metrics.avgRevenue > 0 && (
                <div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">💸 High Cost Structure</h3>
                  <p className="text-sm text-gray-300">
                    Expenses are {((metrics.avgExpenses / metrics.avgRevenue) * 100).toFixed(0)}% of revenue. Look for operational efficiencies and cost optimization opportunities.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialsPage;