import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
<<<<<<< HEAD

// --- Recreated Icons Component to resolve import errors ---
const IconRocket = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.75-.75-1.39-4.69-2.5-5.5a4.51 4.51 0 0 0-2 2z"/>
        <path d="M13.5 15.5c1.5 1.26 2 5 2 5s-3.74-.5-5-2c-.75-.75 1.39-4.69 2.5-5.5a4.51 4.51 0 0 1 2-2z"/>
        <line x1="12" x2="12" y1="18" y2="10"/>
        <path d="M12 18a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2z"/>
        <path d="M18.5 12.5c1.5-1.26 5-2 5-2s-0.5-3.74-2-5c-0.75 0.75-4.69-1.39-5.5-2.5a4.51 4.51 0 0 0-2 2z"/>
        <path d="M15.5 13.5c1.5-1.26 5-2 5-2s-0.5-3.74-2-5c-0.75 0.75-4.69-1.39-5.5-2.5a4.51 4.51 0 0 0-2 2z"/>
        <path d="M12 10a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2z"/>
        <path d="M12 10v4"/>
        <path d="M12 14v-4"/>
        <path d="M12 14a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2z"/>
        <path d="M12 10a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2z"/>
    </svg>
);
const IconLoader = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="6"></line>
        <line x1="12" x2="12" y1="18" y2="22"></line>
        <line x1="4.93" x2="7.76" y1="4.93" y2="7.76"></line>
        <line x1="16.24" x2="19.07" y1="16.24" y2="19.07"></line>
        <line x1="2" x2="6" y1="12" y2="12"></line>
        <line x1="18" x2="22" y1="12" y2="12"></line>
        <line x1="4.93" x2="7.76" y1="19.07" y2="16.24"></line>
        <line x1="16.24" x2="19.07" y1="7.76" y2="4.93"></line>
    </svg>
);
=======
import { IconRocket, IconLoader } from '../components/icons'; // Corrected import path
>>>>>>> 12d5f4b04109dbbd632764450b03beb5147a0c38

// --- Simplified mock API call to remove external dependency ---
const mockApi = {
    post: async (url, data) => {
        // Simulates a network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulates the backend calculation
        const netBurnRate = data.monthlyExpenses - data.monthlyRevenue;
        const runway = netBurnRate > 0 ? data.startingCash / netBurnRate : Infinity;
        
        // New metrics calculation
        const grossMargin = data.monthlyRevenue > 0 ? (data.monthlyRevenue - (data.costOfGoodsSold || 0)) / data.monthlyRevenue : 0;
        const netProfitMargin = data.monthlyRevenue > 0 ? (data.monthlyRevenue - data.monthlyExpenses) / data.monthlyRevenue : 0;
        const cac = data.newCustomers > 0 ? (data.salesAndMarketingCost || 0) / data.newCustomers : 0;
        const ltv = data.averageCustomerValue * (data.averageCustomerLifespan || 0);
        const ltvToCac = cac > 0 ? ltv / cac : Infinity;

        let projectedData = [];
        let currentCash = data.startingCash;
        for (let i = 1; i <= data.projectionMonths; i++) {
            currentCash -= netBurnRate;
            projectedData.push({
                month: `Month ${i}`,
                cashBalance: currentCash
            });
        }
        
        return {
            data: {
                netBurnRate,
                runway,
                projections: projectedData,
                grossMargin,
                netProfitMargin,
                cac,
                ltv,
                ltvToCac
            }
        };
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const App = () => {
    const [formData, setFormData] = useState({
        startingCash: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        projectionMonths: 24,
        costOfGoodsSold: 0,
        salesAndMarketingCost: 0,
        newCustomers: 0,
        averageCustomerValue: 0,
        averageCustomerLifespan: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value) || 0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setResults(null);

        if (formData.startingCash <= 0) {
            setError("Starting Cash must be greater than zero.");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await mockApi.post('/analysis/financials/analyze', formData);
            setResults(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleReset = () => {
        setResults(null);
        setFormData({
            startingCash: 0,
            monthlyRevenue: 0,
            monthlyExpenses: 0,
            projectionMonths: 24,
            costOfGoodsSold: 0,
            salesAndMarketingCost: 0,
            newCustomers: 0,
            averageCustomerValue: 0,
            averageCustomerLifespan: 0
        });
    };

    return (
        <main className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Financial Health Snapshot</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Visualize your startup's burn rate and runway.
                    </p>
                </div>
                
                {results ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-8">
                        <h2 className="text-2xl font-bold text-center text-gray-900">Analysis Results</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                                <p className="text-sm text-gray-600 font-medium">Net Burn Rate</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">
                                    {formatCurrency(results.netBurnRate)} / month
                                </p>
                            </div>
                            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                <p className="text-sm text-gray-600 font-medium">Projected Runway</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {results.runway !== Infinity ? `${Math.round(results.runway)} months` : 'Infinite'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Cash Balance Projection</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={results.projections} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={formatCurrency} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Area type="monotone" dataKey="cashBalance" stroke="#8884d8" fillOpacity={1} fill="url(#colorCash)" name="Cash Balance" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* NEW: Display of additional metrics */}
                        <div className="mt-8 space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">Additional Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Gross Margin</p>
                                    <p className="text-2xl font-bold text-gray-900">{Math.round(results.grossMargin * 100)}%</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Net Profit Margin</p>
                                    <p className="text-2xl font-bold text-gray-900">{Math.round(results.netProfitMargin * 100)}%</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">LTV : CAC Ratio</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {results.ltvToCac !== Infinity ? `${results.ltvToCac.toFixed(1)} : 1` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-6">
                            <button
                                onClick={handleReset}
                                className="w-full md:w-auto flex items-center justify-center gap-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-10 rounded-full transition-transform transform hover:scale-105"
                            >
                                Re-run Analysis
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <fieldset className="space-y-6">
                                <legend className="text-xl font-semibold text-orange-600 border-b border-gray-300 pb-2 mb-4">Financial Inputs</legend>
                                
                                <div>
                                    <label htmlFor="startingCash" className="block text-sm font-medium text-gray-700 mb-1">Starting Cash Balance ($)*</label>
                                    <input type="text" id="startingCash" name="startingCash" value={formData.startingCash} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 100000" required pattern="[0-9]*" />
                                </div>
                                
                                <div>
                                    <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-700 mb-1">Monthly Recurring Revenue ($)*</label>
                                    <input type="text" id="monthlyRevenue" name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 10000" required pattern="[0-9]*" />
                                </div>
                                
                                <div>
                                    <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700 mb-1">Monthly Expenses ($)*</label>
                                    <input type="text" id="monthlyExpenses" name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 15000" required pattern="[0-9]*" />
                                </div>

                                <div>
                                    <label htmlFor="costOfGoodsSold" className="block text-sm font-medium text-gray-700 mb-1">Cost of Goods Sold ($)*</label>
                                    <input type="text" id="costOfGoodsSold" name="costOfGoodsSold" value={formData.costOfGoodsSold} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 5000" required pattern="[0-9]*" />
                                </div>

                                <div>
                                    <label htmlFor="salesAndMarketingCost" className="block text-sm font-medium text-gray-700 mb-1">Total Sales & Marketing Cost ($)*</label>
                                    <input type="text" id="salesAndMarketingCost" name="salesAndMarketingCost" value={formData.salesAndMarketingCost} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 2000" required pattern="[0-9]*" />
                                </div>

                                <div>
                                    <label htmlFor="newCustomers" className="block text-sm font-medium text-gray-700 mb-1">Number of New Customers*</label>
                                    <input type="text" id="newCustomers" name="newCustomers" value={formData.newCustomers} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 50" required pattern="[0-9]*" />
                                </div>
                                
                                <div>
                                    <label htmlFor="averageCustomerValue" className="block text-sm font-medium text-gray-700 mb-1">Average Customer Value ($)*</label>
                                    <input type="text" id="averageCustomerValue" name="averageCustomerValue" value={formData.averageCustomerValue} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 200" required pattern="[0-9]*" />
                                </div>

                                <div>
                                    <label htmlFor="averageCustomerLifespan" className="block text-sm font-medium text-gray-700 mb-1">Average Customer Lifespan (months)*</label>
                                    <input type="text" id="averageCustomerLifespan" name="averageCustomerLifespan" value={formData.averageCustomerLifespan} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 12" required pattern="[0-9]*" />
                                </div>

                                <div>
                                    <label htmlFor="projectionMonths" className="block text-sm font-medium text-gray-700 mb-1">Projection Period (Months)*</label>
                                    <input type="text" id="projectionMonths" name="projectionMonths" value={formData.projectionMonths} onChange={handleChange}
                                        min="1" max="60"
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 24" required pattern="[0-9]*" />
                                </div>
                                
                            </fieldset>
                            
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            
                            <div className="pt-6 text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-wait text-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <IconLoader className="animate-spin w-6 h-6" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <IconRocket className="w-6 h-6" />
                                            Generate Snapshot
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
};

export default App;
