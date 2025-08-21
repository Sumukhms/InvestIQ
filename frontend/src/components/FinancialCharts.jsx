// frontend/src/components/FinancialCharts.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialCharts = ({ chartData }) => {
    // chartData would be an array of objects like:
    // [{ month: 'Jan', cashBalance: 100000, revenue: 5000, expenses: 10000 }]

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cashBalance" stroke="#8884d8" name="Projected Cash" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default FinancialCharts;