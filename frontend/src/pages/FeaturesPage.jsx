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
            className="bg-white p-8 rounded-2xl border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
            style={animationStyle}
        >
            <div className="mb-5 inline-block p-3 rounded-xl bg-red-100 text-red-500">
                {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
        },
        {
            title: "Growth Prediction",
            description: "Forecast future trends and potential growth trajectories to make proactive business decisions.",
            icon: <IconTrendingUp />,
        },
        {
            title: "Risk Mitigation",
            description: "Identify potential business risks early and receive recommendations to mitigate them effectively.",
            icon: <IconAward />,
        },
        {
            title: "Competitor Analysis",
            description: "Understand your rivals' strengths and weaknesses to formulate superior strategies.",
            icon: <IconUser />,
        },
        {
            title: "Financial Forecasting",
            description: "Project financial performance and optimize resource allocation for sustained growth.",
            icon: <IconSettings />,
        },
        {
            title: "Idea Generation",
            description: "Leverage generative AI to spark new, innovative business ideas in any industry.",
            icon: <IconLightbulb />,
        },
    ];

    return (
        <main className="container mx-auto px-6 py-16">
            <div className="text-center mb-16">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    The Power Behind Your Decisions
                </h1>
                <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
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
