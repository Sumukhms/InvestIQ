import React from 'react';
import { IconCurrencyDollar, IconChevronRight } from './Icons';

const alerts = [
    {
        company: 'Global Tech Inc.',
        amount: '$50M',
        round: 'Series C',
        date: '2025-08-28',
    },
    {
        company: 'Innovate Solutions',
        amount: '$20M',
        round: 'Series B',
        date: '2025-08-25',
    },
    {
        company: 'NextGen AI',
        amount: '$5M',
        round: 'Seed',
        date: '2025-08-22',
    },
    {
        company: 'Data Insights LLC',
        amount: '$15M',
        round: 'Series A',
        date: '2025-08-20',
    },
];

const FundingAlerts = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Competitor Funding Alerts</h3>
            <div className="space-y-4">
                {alerts.map((alert, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 p-3 rounded-xl mr-4">
                            <IconCurrencyDollar className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-bold text-gray-800">{alert.company}</p>
                            <p className="text-sm text-gray-600">
                                Raised <span className="font-semibold">{alert.amount}</span> in {alert.round} round.
                            </p>
                            <p className="text-xs text-gray-400">{alert.date}</p>
                        </div>
                        <IconChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FundingAlerts;