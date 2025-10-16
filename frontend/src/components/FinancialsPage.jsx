import React, { useState } from 'react';
// Import additional components from the charting library
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Helper function to format large numbers on the Y-axis (e.g., 10000 -> 10k)
const formatYAxis = (tickItem) => {
  return tickItem > 999 ? `${(tickItem / 1000).toFixed(0)}k` : tickItem;
};

// Custom Tooltip for a better look and feel
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-xl">
        <p className="label text-blue-300 font-semibold">{`${label}`}</p>
        <p className="text-teal-400">{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
        <p className="text-red-400">{`Expenses: $${payload[1].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};


const FinancialsPage = () => {
  // State to hold user inputs
  const [initialCash, setInitialCash] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');

  // State for calculated metrics
  const [netBurn, setNetBurn] = useState(0);
  const [runway, setRunway] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  // State to hold the data formatted for the chart
  const [chartData, setChartData] = useState([]);

  const handleCalculate = (e) => {
    e.preventDefault();

    // --- Input Validation ---
    const isNumericArray = (str) => str.split(',').every(val => !isNaN(parseFloat(val)) && isFinite(val.trim()));
    if (!isNumericArray(monthlyRevenue) || !isNumericArray(monthlyExpenses)) {
        alert("Please ensure Revenue and Expenses contain only comma-separated numbers.");
        return;
    }
    
    // Convert comma-separated strings to arrays of numbers
    const revenueArray = monthlyRevenue.split(',').map(val => Number(val.trim()));
    const expensesArray = monthlyExpenses.split(',').map(val => Number(val.trim()));

    // --- Chart Data Formatting ---
    const newChartData = revenueArray.map((rev, index) => ({
      name: `Month ${index + 1}`,
      revenue: rev,
      expenses: expensesArray[index] || 0,
    }));
    setChartData(newChartData);
    
    // --- Metric Calculations ---
    const totalRevenue = revenueArray.reduce((acc, val) => acc + val, 0);
    const totalExpenses = expensesArray.reduce((acc, val) => acc + val, 0);
    const avgMonthlyBurn = (totalExpenses - totalRevenue) / revenueArray.length;

    setNetBurn(avgMonthlyBurn);
    setCashBalance(parseFloat(initialCash) - totalExpenses + totalRevenue);

    if (avgMonthlyBurn > 0) {
      const calculatedRunway = parseFloat(initialCash) / avgMonthlyBurn;
      setRunway(calculatedRunway);
    } else {
      setRunway(Infinity);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Financial Health Snapshot</h1>
      
      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Net Burn Rate (Avg Monthly)</h3>
          <p className="text-3xl font-semibold">${netBurn.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Runway</h3>
          <p className="text-3xl font-semibold">{runway === Infinity ? 'Infinite' : `${runway.toFixed(1)} months`}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Ending Cash Balance</h3>
          <p className="text-3xl font-semibold">${cashBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Input Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Input Your Financials</h2>
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Initial Cash Balance ($)</label>
              <input 
                type="number" // Input type is number
                value={initialCash}
                onChange={(e) => setInitialCash(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded mt-1 text-white"
                placeholder="e.g., 100000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter a single number.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Monthly Revenue</label>
              <input 
                type="text" // Input type is text for comma-separated values
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded mt-1 text-white"
                placeholder="e.g., 5000, 5500, 6000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter comma-separated numbers only.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Monthly Expenses</label>
              <input 
                type="text" // Input type is text for comma-separated values
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded mt-1 text-white"
                placeholder="e.g., 10000, 10500, 11000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter comma-separated numbers only.</p>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Calculate & Generate Graph</button>
          </form>
        </div>
        
        {/* --- ENHANCED GRAPH SECTION --- */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Revenue vs. Expenses</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                 <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38B2AC" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38B2AC" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#E53E3E" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                <ReferenceLine y={0} stroke="#A0AEC0" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="revenue" stroke="#38B2AC" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#E53E3E" fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Enter data to generate the chart.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialsPage;