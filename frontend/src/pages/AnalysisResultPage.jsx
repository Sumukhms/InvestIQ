import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ResultCard = ({ title, children, color }) => (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 ${color}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        {children}
    </div>
);

const AnalysisResultPage = () => {
    const location = useLocation();
    const { result } = location.state || {}; // Get result data from route state

    if (!result) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-bold">No analysis data found.</h1>
                <p className="text-gray-600 mt-2">Please go back and submit a new analysis.</p>
                <Link to="/new-analysis" className="mt-6 inline-block bg-red-500 text-white font-bold py-2 px-6 rounded-lg">
                    Start New Analysis
                </Link>
            </div>
        );
    }

    const getSuccessColor = (percentage) => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <main className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Analysis Complete</h1>
                    <p className="text-lg text-gray-600 mt-2">Results for <span className="font-semibold">{result.startupName}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <ResultCard title="Success Potential">
                            <div className="text-center">
                                <p className={`text-7xl font-bold ${getSuccessColor(result.successPercentage)}`}>
                                    {result.successPercentage}%
                                </p>
                            </div>
                        </ResultCard>
                    </div>
                    <div className="md:col-span-2 space-y-8">
                        <ResultCard title="Key Risks">
                            <ul className="space-y-4">
                                {result.risks.map((risk, index) => (
                                    <li key={index}>
                                        <h4 className="font-semibold text-gray-800">{risk.title}</h4>
                                        <p className="text-gray-600 text-sm">{risk.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </ResultCard>
                        <ResultCard title="Recommendations">
                             <ul className="space-y-4">
                                {result.recommendations.map((rec, index) => (
                                    <li key={index}>
                                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                                        <p className="text-gray-600 text-sm">{rec.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </ResultCard>
                    </div>
                </div>
                 <div className="text-center mt-12">
                    <Link to="/dashboard" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default AnalysisResultPage;
