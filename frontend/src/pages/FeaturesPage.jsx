import React from 'react';
import { IconChartBar, IconTrendingUp, IconAward, IconUser, IconSettings, IconLightbulb } from '../components/icons';

const FeaturesPage = () => {
    const features = [
        { title: "Market Intelligence", description: "Gain deep insights into market trends, consumer behavior, and emerging opportunities.", icon: <IconChartBar /> },
        { title: "Growth Prediction", description: "Forecast future trends and potential growth trajectories to make proactive business decisions.", icon: <IconTrendingUp /> },
        { title: "Risk Mitigation", description: "Identify potential business risks early and receive recommendations to mitigate them effectively.", icon: <IconAward /> },
        { title: "Competitor Analysis", description: "Understand your rivals' strengths and weaknesses to formulate superior strategies.", icon: <IconUser /> },
        { title: "Financial Forecasting", description: "Project financial performance and optimize resource allocation for sustained growth.", icon: <IconSettings /> },
        { title: "Idea Generation", description: "Leverage generative AI to spark new, innovative business ideas in any industry.", icon: <IconLightbulb /> },
    ];

    return (
        <main className="container mx-auto px-6 py-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white">The Power Behind Your Decisions</h2>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">InvestIQ combines powerful AI models to give you a 360-degree view of any startup venture.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-gray-800 p-8 rounded-xl border border-gray-700 transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="flex items-center text-blue-400 space-x-4 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                        </div>
                        <p className="text-gray-400">{feature.description}</p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default FeaturesPage;