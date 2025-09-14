import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getAnalysisById } from '../api/api';
import PageLoader from '../components/PageLoader';
import ScoreRadarChart from '../components/ScoreRadarChart';

const AnalysisResultPage = () => {
    const { state } = useLocation();
    const { id } = useParams();

    const [analysis, setAnalysis] = useState(state?.analysis);
    const [isLoading, setIsLoading] = useState(!analysis);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!analysis && id) {
            const fetchAnalysis = async () => {
                try {
                    const data = await getAnalysisById(id);
                    setAnalysis(data);
                } catch (err) {
                    setError('Failed to load analysis results. It may have been deleted or there was a server error.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAnalysis();
        }
    }, [id, analysis]);

    if (isLoading) return <PageLoader message="Loading analysis results..." />;
    if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;
    if (!analysis) return <div className="text-center py-20">Analysis not found.</div>;
    
    const probabilityColor = analysis.successPercentage > 60 ? 'bg-green-100 text-green-800' : 
                             analysis.successPercentage > 40 ? 'bg-yellow-100 text-yellow-800' : 
                             'bg-red-100 text-red-800';

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6 mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">{analysis.startupName}</h1>
                    <a href={analysis.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                        {analysis.website}
                    </a>
                    <div className="mt-4">
                        <span className={`px-4 py-2 rounded-full text-lg font-semibold ${probabilityColor}`}>
                            Success Probability: {analysis.successPercentage?.toFixed(2)}%
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        {analysis.detailedScores && <ScoreRadarChart scores={analysis.detailedScores} />}
                    </div>
                    <div className="space-y-8">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Recommendations</h2>
                            <ul className="space-y-4">
                                {analysis.recommendations?.map((rec, index) => (
                                    <li key={index}>
                                        <h3 className="font-bold text-gray-900">{rec.title}</h3>
                                        <p className="text-gray-600">{rec.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Key Risks</h2>
                            <ul className="space-y-4">
                                {analysis.risks?.map((risk, index) => (
                                    <li key={index}>
                                        <h3 className="font-bold text-gray-900">{risk.title}</h3>
                                        <p className="text-gray-600">{risk.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResultPage;