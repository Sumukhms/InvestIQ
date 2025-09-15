// frontend/src/components/MarketHealth.jsx

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { IconTrendingUp, IconTrendingDown, IconLoader } from './Icons';

const MarketHealth = () => {
    const [marketData, setMarketData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getMarketData = async () => {
            try {
                const res = await api.get('/analysis/market-health');
                setMarketData(res.data);
            } catch (error) {
                console.error("Failed to fetch market health", error);
            } finally {
                setIsLoading(false);
            }
        };
        getMarketData();
    }, []);

    if (isLoading) {
        return <div className="bg-white p-6 rounded-2xl border flex items-center justify-center h-full"><IconLoader className="animate-spin w-6 h-6 text-gray-400" /></div>;
    }

    const isPositive = marketData && marketData.change > 0;
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
    const Icon = isPositive ? IconTrendingUp : IconTrendingDown;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 h-full">
            <h3 className="text-sm font-semibold text-gray-500">Market Health (NASDAQ 100)</h3>
            <div className="flex items-center mt-2">
                <p className="text-3xl font-bold text-gray-900">{marketData.currentPrice.toFixed(2)}</p>
                <div className={`flex items-center text-lg font-bold ml-4 ${colorClass}`}>
                    <Icon className="w-5 h-5 mr-1" />
                    <span>{marketData.percentChange.toFixed(2)}%</span>
                </div>
            </div>
        </div>
    );
};

export default MarketHealth;