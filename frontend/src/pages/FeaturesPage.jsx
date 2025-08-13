import React from 'react';
// Assuming these are your icon components. Adjust the import path as needed.
import { IconChartBar, IconTrendingUp, IconAward, IconUser, IconSettings, IconLightbulb } from '../components/icons';

// --- Reusable FeatureCard Component (defined within the same file) ---
const FeatureCard = ({ feature, index }) => {
    // This inline style is used for the staggered animation delay
    const animationStyle = {
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both', // Ensures the element stays in its final state
    };

    return (
        <div
            className={`bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up ${feature.shadow}`}
            style={animationStyle}
        >
            <div className={`mb-5 inline-block p-3 rounded-xl ${feature.color.bg}`}>
                {React.cloneElement(feature.icon, { className: `w-7 h-7 ${feature.color.text}` })}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
        </div>
    );
};


// --- Main FeaturesPage Component ---
const FeaturesPage = () => {
    const features = [
        {
            title: "Market Intelligence",
            description: "Gain deep insights into market trends, consumer behavior, and emerging opportunities.",
            icon: <IconChartBar />,
            color: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
            shadow: 'hover:shadow-xl hover:shadow-blue-500/10'
        },
        {
            title: "Growth Prediction",
            description: "Forecast future trends and potential growth trajectories to make proactive business decisions.",
            icon: <IconTrendingUp />,
            color: { bg: 'bg-green-500/10', text: 'text-green-400' },
            shadow: 'hover:shadow-xl hover:shadow-green-500/10'
        },
        {
            title: "Risk Mitigation",
            description: "Identify potential business risks early and receive recommendations to mitigate them effectively.",
            icon: <IconAward />,
            color: { bg: 'bg-red-500/10', text: 'text-red-400' },
            shadow: 'hover:shadow-xl hover:shadow-red-500/10'
        },
        {
            title: "Competitor Analysis",
            description: "Understand your rivals' strengths and weaknesses to formulate superior strategies.",
            icon: <IconUser />,
            color: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
            shadow: 'hover:shadow-xl hover:shadow-purple-500/10'
        },
        {
            title: "Financial Forecasting",
            description: "Project financial performance and optimize resource allocation for sustained growth.",
            icon: <IconSettings />,
            color: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
            shadow: 'hover:shadow-xl hover:shadow-indigo-500/10'
        },
        {
            title: "Idea Generation",
            description: "Leverage generative AI to spark new, innovative business ideas in any industry.",
            icon: <IconLightbulb />,
            color: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
            shadow: 'hover:shadow-xl hover:shadow-yellow-500/10'
        },
    ];

    return (
        <main className="container mx-auto px-6 py-16 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    The Power Behind Your Decisions
                </h1>
                <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
                    InvestIQ combines powerful AI models to give you a 360-degree view of any startup venture, turning data into a decisive advantage.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} index={index} />
                ))}
            </div>
        </main>
    );
};

export default FeaturesPage;