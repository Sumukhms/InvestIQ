import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const ScoreRadarChart = ({ scores }) => {
    const data = [
        { subject: 'Market Potential', score: scores.marketPotential, fullMark: 100 },
        { subject: 'Product Innovation', score: scores.productInnovation, fullMark: 100 },
        { subject: 'Team Strength', score: scores.teamStrength, fullMark: 100 },
        { subject: 'Financial Viability', score: scores.financialViability, fullMark: 100 },
    ];
    return (
        <div className="bg-white shadow-md rounded-lg p-6 h-96">
            <h2 className="text-2xl font-semibold text-center">Factor Analysis</h2>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreRadarChart;