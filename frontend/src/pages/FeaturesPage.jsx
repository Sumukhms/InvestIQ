import React, { useState } from 'react';
import api from '../api/api';
import { IconChartBar, IconTrendingUp, IconAward, IconUsers, IconSettings, IconLightbulb, IconChevronRight, IconLoader } from '../components/icons';

// --- Reusable, Clickable Feature Accordion Component ---
const FeatureAccordion = (props) => {
    const { 
        feature, 
        index,
        // Props for Idea Generator
        onGenerateIdeas, 
        generatedIdeas, 
        isIdeaLoading,
        // Props for Market Size Estimator
        onEstimateMarket,
        marketData,
        isMarketLoading
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    
    // State for interactive tools
    const [ideaKeyword, setIdeaKeyword] = useState('');
    const [marketIndustry, setMarketIndustry] = useState('');

    const animationStyle = {
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
    };

    return (
        <div className="border-b border-gray-200 animate-fade-in-up" style={animationStyle}>
            {/* --- Clickable Header --- */}
            <div
                className="flex justify-between items-center p-6 cursor-pointer hover:bg-red-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <div className="p-3 bg-red-100 text-red-500 rounded-xl mr-4">
                        {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 hidden md:block">{feature.description}</p>
                    </div>
                </div>
                <IconChevronRight className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </div>

            {/* --- Expandable Content --- */}
            {isOpen && (
                <div className="p-6 pt-0 animate-fade-in">
                    <div className="pl-20">
                        <p className="text-gray-700 mb-4">{feature.detailedContent}</p>
                        
                        {/* --- Interactive Tool: Market Size Estimator --- */}
                        {feature.id === 'market' && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <select
                                        value={marketIndustry}
                                        onChange={(e) => setMarketIndustry(e.target.value)}
                                        className="w-full bg-white border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                    >
                                        <option value="">Select an industry...</option>
                                        <option value="FinTech">FinTech</option>
                                        <option value="HealthTech">HealthTech</option>
                                        <option value="AgriTech">AgriTech</option>
                                        <option value="SaaS">SaaS</option>
                                    </select>
                                    <button onClick={() => onEstimateMarket(marketIndustry)} disabled={isMarketLoading || !marketIndustry} className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg disabled:opacity-50">
                                        {isMarketLoading ? <IconLoader className="animate-spin w-5 h-5" /> : 'Estimate'}
                                    </button>
                                </div>
                                {marketData && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-gray-800">Market Estimate:</h4>
                                        <p className="text-gray-600 mt-1"><strong>TAM:</strong> {marketData.tam}</p>
                                        <p className="text-gray-600 mt-1"><strong>Insight:</strong> {marketData.insight}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- Interactive Tool: Idea Generator --- */}
                        {feature.id === 'idea' && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={ideaKeyword}
                                        onChange={(e) => setIdeaKeyword(e.target.value)}
                                        className="w-full bg-white border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Enter a keyword (e.g., 'Fitness')"
                                    />
                                    <button onClick={() => onGenerateIdeas(ideaKeyword)} disabled={isIdeaLoading || !ideaKeyword} className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg disabled:opacity-50">
                                        {isIdeaLoading ? <IconLoader className="animate-spin w-5 h-5" /> : 'Generate'}
                                    </button>
                                </div>
                                {generatedIdeas.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-gray-800">Generated Ideas:</h4>
                                        <ul className="list-decimal list-inside text-gray-600 mt-2">
                                            {generatedIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Main FeaturesPage Component ---
const FeaturesPage = () => {
    // State for Idea Generator
    const [generatedIdeas, setGeneratedIdeas] = useState([]);
    const [isIdeaLoading, setIsIdeaLoading] = useState(false);
    
    // State for Market Size Estimator
    const [marketData, setMarketData] = useState(null);
    const [isMarketLoading, setIsMarketLoading] = useState(false);

    const handleGenerateIdeas = async (keyword) => {
        setIsIdeaLoading(true);
        setGeneratedIdeas([]);
        try {
            const res = await api.post('/analysis/generate-idea', { keyword });
            setGeneratedIdeas(res.data.ideas);
        } catch (error) {
            console.error("Failed to generate ideas:", error);
            setGeneratedIdeas(["Sorry, we couldn't generate ideas right now."]);
        } finally {
            setIsIdeaLoading(false);
        }
    };

    const handleEstimateMarket = async (industry) => {
        setIsMarketLoading(true);
        setMarketData(null);
        try {
            const res = await api.post('/analysis/market-size', { industry });
            setMarketData(res.data);
        } catch (error) {
            console.error("Failed to estimate market size:", error);
        } finally {
            setIsMarketLoading(false);
        }
    };

    const features = [
        {
            id: 'market',
            title: "Market Intelligence",
            description: "Deep insights into market trends, consumer behavior, and opportunities.",
            icon: <IconChartBar />,
            detailedContent: "Our AI analyzes millions of data points to provide a clear picture of your market landscape. Get a quick estimate of a market's potential below.",
        },
        // ... (other features remain the same)
        {
            id: 'growth',
            title: "Growth Prediction",
            description: "Forecast future trends and potential growth trajectories.",
            icon: <IconTrendingUp />,
            detailedContent: "Move beyond guesswork. Our predictive models use historical data and market signals to create data-driven forecasts for your venture's potential revenue and key growth metrics, helping you make proactive decisions.",
        },
        {
            id: 'risk',
            title: "Risk Mitigation",
            description: "Identify potential business risks early and receive recommendations.",
            icon: <IconAward />,
            detailedContent: "Every venture has risks. We help you identify them early, from market saturation and competitive threats to scalability challenges. More importantly, we provide concrete recommendations to mitigate them effectively.",
        },
        {
            id: 'competitor',
            title: "Competitor Analysis",
            description: "Understand your rivals' strengths and weaknesses.",
            icon: <IconUsers />,
            detailedContent: "Our platform automatically discovers and analyzes your top competitors. We provide a breakdown of their strengths, weaknesses, and market positioning, allowing you to formulate superior strategies.",
        },
        {
            id: 'financial',
            title: "Financial Forecasting",
            description: "Project financial performance and optimize resource allocation.",
            icon: <IconSettings />,
            detailedContent: "Based on your revenue, funding stage, and industry benchmarks, we project key financial metrics. This helps you optimize your resource allocation, understand your financial runway, and prepare for investor conversations.",
        },
        {
            id: 'idea',
            title: "Idea Generation",
            description: "Leverage generative AI to spark new, innovative business ideas.",
            icon: <IconLightbulb />,
            detailedContent: "Stuck in a creative rut? Use our generative AI to brainstorm new business ideas, explore different business models, and discover untapped opportunities in any industry. Try it below!",
        },
    ];

    return (
        <main>
            <section className="bg-white py-20 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        The Power Behind Your Decisions
                    </h1>
                    <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                        Explore our features below and try our AI-powered tools live.
                    </p>
                </div>
            </section>
            
            <div className="bg-white container mx-auto px-6 py-12 max-w-4xl">
                <div className="border border-gray-200 rounded-2xl shadow-lg">
                    {features.map((feature, index) => (
                        <FeatureAccordion 
                            key={index} 
                            feature={feature} 
                            index={index}
                            onGenerateIdeas={handleGenerateIdeas}
                            generatedIdeas={generatedIdeas}
                            isIdeaLoading={isIdeaLoading}
                            onEstimateMarket={handleEstimateMarket}
                            marketData={marketData}
                            isMarketLoading={isMarketLoading}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default FeaturesPage;