import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IconAlertTriangle, IconCircleCheck, IconChevronLeft, IconTarget, IconUsers, IconTrendingUp, IconLightbulb, IconChartBar } from '../components/icons';

// In a real app, you'd use a library like 'recharts' or 'chart.js'.
const RadarChart = ({ data }) => (
    <div className="relative w-64 h-64 mx-auto my-4">
        {/* This is a simplified placeholder for a radar chart */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gray-100 rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xl font-bold text-gray-700">Radar Chart Placeholder</p>
        </div>
    </div>
);

const ResultCard = ({ title, icon, children, className }) => (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-full ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-gray-900 ml-2">{title}</h3>
        </div>
        {children}
    </div>
);


const AnalysisResultPage = () => {
    const location = useLocation();
    const { result: rawResult } = location.state || {};

    // Correctly handle the case where rawResult might be undefined
    const result = rawResult ? {
        ...rawResult,
        detailedScores: {
            marketPotential: 85,
            productInnovation: 75,
            teamStrength: 60,
            financialViability: 70,
        },
        // Corrected syntax for optional chaining
        competitorInsights: rawResult.competitors?.map(c => ({
            ...c,
            threatLevel: Math.floor(Math.random() * 3) + 1
        })) || []
    } : null;


    if (!result) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-bold">No analysis data found.</h1>
                <Link to="/new-analysis" className="mt-6 inline-block bg-red-500 text-white font-bold py-2 px-6 rounded-lg">
                    Start New Analysis
                </Link>
            </div>
        );
    }

    const overallScore = Math.round(Object.values(result.detailedScores).reduce((a, b) => a + b, 0) / 4);

    return (
        <main className="container mx-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Analysis Report: <span className="text-red-600">{result.startupName}</span></h1>
                    <p className="text-lg text-gray-600 mt-2">An in-depth look at your venture's potential.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Left Column: Score Breakdown */}
                    <div className="lg:col-span-2">
                        <ResultCard title="Success Score Breakdown" icon={<IconChartBar className="w-6 h-6 text-blue-500" />}>
                            <div className="text-center">
                                <p className="text-6xl font-bold text-red-600">{overallScore}/100</p>
                                <p className="text-gray-500 mb-4">Overall Potential Score</p>
                                <RadarChart data={result.detailedScores} />
                                <ul className="text-left mt-6 space-y-2">
                                    <li className="flex justify-between"><span><IconTarget className="inline w-4 h-4 mr-2" /> Market Potential</span><strong>{result.detailedScores.marketPotential}</strong></li>
                                    <li className="flex justify-between"><span><IconLightbulb className="inline w-4 h-4 mr-2" /> Product Innovation</span><strong>{result.detailedScores.productInnovation}</strong></li>
                                    <li className="flex justify-between"><span><IconUsers className="inline w-4 h-4 mr-2" /> Team Strength</span><strong>{result.detailedScores.teamStrength}</strong></li>
                                    <li className="flex justify-between"><span><IconTrendingUp className="inline w-4 h-4 mr-2" /> Financial Viability</span><strong>{result.detailedScores.financialViability}</strong></li>
                                </ul>
                            </div>
                        </ResultCard>
                    </div>

                    {/* Right Column: Insights */}
                    <div className="lg:col-span-3 space-y-8">
                        <ResultCard title="Competitive Landscape" icon={<IconUsers className="w-6 h-6 text-purple-500" />}>
                            <ul className="space-y-4">
                                {result.competitorInsights.map((c, i) => (
                                    <li key={i} className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800">{c.name}</h4>
                                        <p className="text-gray-600 text-sm"><strong>Key Strength:</strong> {c.strength}</p>
                                    </li>
                                ))}
                            </ul>
                        </ResultCard>

                        <ResultCard title="Key Risks" icon={<IconAlertTriangle className="w-6 h-6 text-red-500" />}>
                            <ul className="space-y-3">
                                {result.risks.map((risk, index) => (
                                    <li key={index} className="border-l-4 border-red-200 pl-4 py-1">
                                        <h4 className="font-semibold text-gray-800">{risk.title}</h4>
                                        <p className="text-gray-600 text-sm">{risk.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </ResultCard>

                        <ResultCard title="Strategic Recommendations" icon={<IconCircleCheck className="w-6 h-6 text-green-500" />}>
                            <ul className="space-y-3">
                                {result.recommendations.map((rec, index) => (
                                    <li key={index} className="border-l-4 border-green-200 pl-4 py-1">
                                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                                        <p className="text-gray-600 text-sm">{rec.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </ResultCard>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                        <IconChevronLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default AnalysisResultPage;