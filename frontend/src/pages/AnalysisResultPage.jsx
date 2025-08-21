import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { IconAlertTriangle, IconCircleCheck, IconChevronLeft, IconTarget, IconUsers, IconTrendingUp, IconLightbulb, IconChartBar, IconAward, IconBookOpen, IconDownload } from '../components/icons';

const ResultCard = ({ title, icon, children, className }) => (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-full ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-gray-900 ml-2">{title}</h3>
        </div>
        {children}
    </div>
);

const PersonalizedSuggestions = ({ scores, overallScore }) => {
    const getStrongestAndWeakest = () => {
        let strongest = { name: '', score: 0 };
        let weakest = { name: '', score: 101 };

        for (const [key, value] of Object.entries(scores)) {
            if (value > strongest.score) {
                strongest = { name: key, score: value };
            }
            if (value < weakest.score) {
                weakest = { name: key, score: value };
            }
        }
        return { strongest, weakest };
    };

    const { strongest, weakest } = getStrongestAndWeakest();

    return (
        <ResultCard title="Executive Summary" icon={<IconAward className="w-6 h-6 text-yellow-500" />}>
            <p className="text-gray-600 text-sm mb-4">
                With an overall score of <strong>{overallScore}/100</strong>, this venture shows significant promise. The analysis indicates a powerful product vision and a substantial market opportunity. Key focus should be on mitigating risks associated with team composition and long-term financial planning.
            </p>
            <ul className="space-y-3">
                <li className="flex items-start">
                    <IconCircleCheck className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                        <strong className="font-semibold">Leverage Your Strength:</strong> Capitalize on your high <strong>{strongest.name.replace(/([A-Z])/g, ' $1')}</strong> score ({strongest.score}) to build initial traction and attract investors.
                    </div>
                </li>
                <li className="flex items-start">
                    <IconAlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                        <strong className="font-semibold">Address Your Weakness:</strong> Focus strategic efforts on improving your <strong>{weakest.name.replace(/([A-Z])/g, ' $1')}</strong> score ({weakest.score}) to build a more resilient foundation.
                    </div>
                </li>
            </ul>
        </ResultCard>
    );
};

const VentureGrowthBlueprint = ({ industry }) => (
    <ResultCard title="Venture Growth Blueprint" icon={<IconBookOpen className="w-6 h-6 text-blue-500" />}>
        <p className="text-gray-600 text-sm mb-4">
            Actionable next steps to help you build momentum and grow your venture.
        </p>
        <ul className="space-y-3">
            <li className="flex items-start">
                <strong className="font-semibold w-32 flex-shrink-0">1. Validate PMF:</strong>
                <span className="text-sm">Engage with at least 20 potential customers in the {industry} space to validate the problem and your proposed solution.</span>
            </li>
            <li className="flex items-start">
                <strong className="font-semibold w-32 flex-shrink-0">2. Build an MVP:</strong>
                <span className="text-sm">Develop a Minimum Viable Product that solves the core problem and get it into the hands of early adopters.</span>
            </li>
            <li className="flex items-start">
                <strong className="font-semibold w-32 flex-shrink-0">3. Network:</strong>
                <span className="text-sm">Connect with mentors and advisors in the {industry} sector. Attend industry-specific meetups and conferences.</span>
            </li>
        </ul>
    </ResultCard>
);


const AnalysisResultPage = () => {
    const location = useLocation();
    const { result } = location.state || {};

    const handlePrint = () => {
        window.print();
    };

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
    
    const overallScore = result.successPercentage || 0;
    const detailedScores = result.detailedScores || {
        marketPotential: 0,
        productInnovation: 0,
        teamStrength: 0,
        financialViability: 0,
    };
    
    const chartData = [
        { subject: 'Market', A: detailedScores.marketPotential, fullMark: 100 },
        { subject: 'Product', A: detailedScores.productInnovation, fullMark: 100 },
        { subject: 'Team', A: detailedScores.teamStrength, fullMark: 100 },
        { subject: 'Financials', A: detailedScores.financialViability, fullMark: 100 },
    ];

    return (
        <>
            <main id="report-root" className="bg-gray-50">
                <div className="container mx-auto px-6 pt-12 pb-12">
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
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="subject" />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                <Radar name="Score" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                        <ul className="text-left mt-6 space-y-2">
                                            <li className="flex justify-between"><span><IconTarget className="inline w-4 h-4 mr-2" /> Market Potential</span><strong>{detailedScores.marketPotential}</strong></li>
                                            <li className="flex justify-between"><span><IconLightbulb className="inline w-4 h-4 mr-2" /> Product Innovation</span><strong>{detailedScores.productInnovation}</strong></li>
                                            <li className="flex justify-between"><span><IconUsers className="inline w-4 h-4 mr-2" /> Team Strength</span><strong>{detailedScores.teamStrength}</strong></li>
                                            <li className="flex justify-between"><span><IconTrendingUp className="inline w-4 h-4 mr-2" /> Financial Viability</span><strong>{detailedScores.financialViability}</strong></li>
                                        </ul>
                                    </div>
                                </ResultCard>
                            </div>

                            {/* Right Column: Insights */}
                            <div className="lg:col-span-3 space-y-8">
                               <PersonalizedSuggestions scores={detailedScores} overallScore={overallScore} />
                               <VentureGrowthBlueprint industry={result.industry} />

                               {result.competitors && result.competitors.length > 0 && (
                                    <ResultCard title="Competitive Landscape" icon={<IconUsers className="w-6 h-6 text-purple-500" />}>
                                        <ul className="space-y-4">
                                            {result.competitors.map((c, i) => (
                                                <li key={i} className="p-3 bg-gray-50 rounded-lg">
                                                    <h4 className="font-semibold text-gray-800">{c.name}</h4>
                                                    {c.strength && <p className="text-gray-600 text-sm"><strong>Key Strength:</strong> {c.strength}</p>}
                                                </li>
                                            ))}
                                        </ul>
                                    </ResultCard>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div id="report-actions" className="text-center bg-gray-50 pb-12 flex justify-center gap-4">
                <Link to="/dashboard" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    <IconChevronLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>
                <button onClick={handlePrint} className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    <IconDownload className="w-5 h-5" />
                    Download Report
                </button>
            </div>
        </>
    );
};

export default AnalysisResultPage;