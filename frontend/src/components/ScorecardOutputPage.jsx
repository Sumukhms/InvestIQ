import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import OverallScore from './OverallScore';
import DetailedAnalysis from './DetailedAnalysis';
import './ScorecardOutput.css';

const ScorecardOutputPage = ({ prediction, formData, onBack }) => {

    // This function derives scores and insights from the input data and AI prediction
    const getDerivedData = () => {
        let financialsScore = 0;
        const funding = parseInt(formData.funding_total_usd);
        if (funding > 10000000) financialsScore = 95;
        else if (funding > 1000000) financialsScore = 80;
        else if (funding > 100000) financialsScore = 65;
        else financialsScore = 40;
        if (parseInt(formData.funding_rounds) > 3) financialsScore = Math.min(100, financialsScore + 10);

        let teamScore = 0;
        const milestones = parseInt(formData.milestones);
        if (milestones > 5) teamScore = 90;
        else if (milestones > 2) teamScore = 75;
        else teamScore = 50;
        if (parseInt(formData.relationships) > 10) teamScore = Math.min(100, teamScore + 10);

        let productScore = 0;
        const ageAtMilestone = parseFloat(formData.age_last_milestone_year);
        if (ageAtMilestone > 0 && ageAtMilestone < 2) productScore = 90;
        else if (ageAtMilestone < 4) productScore = 70;
        else productScore = 50;
        
        let marketScore = 0;
        const popularMarkets = ['software', 'web', 'mobile', 'ecommerce'];
        if (popularMarkets.includes(formData.category_code)) marketScore = 85;
        else if (formData.category_code === 'biotech' || formData.category_code === 'enterprise') marketScore = 75;
        else marketScore = 60;
        
        const strengths = [];
        const improvements = [];
        if (financialsScore > 75) strengths.push("Strong financial backing and clear investor confidence.");
        else improvements.push("Explore further funding opportunities to accelerate growth and secure a longer runway.");

        if (teamScore > 80) strengths.push("Proven execution capabilities with a strong track record of hitting milestones.");
        else improvements.push("Focus on building key industry relationships and achieving development milestones at a faster pace.");

        if (productScore > 80) strengths.push("Rapid product development cycles indicate strong team velocity and market responsiveness.");
        else improvements.push("Accelerate the product roadmap to reach key milestones and validate market fit sooner.");

        if (marketScore > 80) strengths.push("Operating in a high-growth market sector with strong potential.");
        else improvements.push("Further research into niche market segments could reveal untapped opportunities for growth.");
        
        if (prediction.prediction_label === 'Success') strengths.push("Core metrics align with patterns identified by the AI model as indicators of high success potential.");
        else improvements.push("The AI model suggests that key performance indicators (KPIs) should be reviewed to align better with successful industry benchmarks.");

        return { financialsScore, teamScore, productScore, marketScore, strengths, improvements };
    };

    const derivedData = getDerivedData();
    const chartData = [
        { name: 'Financials', score: derivedData.financialsScore },
        { name: 'Team/Execution', score: derivedData.teamScore },
        { name: 'Product/Maturity', score: derivedData.productScore },
        { name: 'Market', score: derivedData.marketScore },
    ];

    const getBarColor = (score) => {
        if (score > 70) return '#22c55e'; // Green
        if (score > 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    return (
        <div className="scorecard-output-page">
            <button onClick={onBack} className="btn-back">← New Analysis</button>
            <h1 className="scorecard-title">AI-Powered Startup Analysis</h1>
            
            <div className="main-grid">
                <div className="grid-item overall-score-card">
                    <OverallScore 
                        score={prediction.success_probability} 
                        label={prediction.prediction_label}
                    />
                </div>
                
                <div className="grid-item chart-card">
                    <h2 className="card-title">Key Area Analysis</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} tick={{ fill: '#9ca3af' }} />
                            <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Bar dataKey="score" barSize={20} radius={[0, 10, 10, 0]} animationDuration={1500}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid-item analysis-card">
                    <DetailedAnalysis
                        strengths={derivedData.strengths}
                        improvements={derivedData.improvements}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScorecardOutputPage;