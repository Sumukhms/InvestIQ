import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnalysis, findCompetitors } from '../api/api';
import PageLoader from '../components/PageLoader';

const NewAnalysisPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [competitors, setCompetitors] = useState([]);
    
    const [formData, setFormData] = useState({
        startupName: '',
        website: 'https://',
        elevatorPitch: '',
        problemItSolves: '',
        industry: '',
        location: '',
        targetMarketSize: '',
        founderBios: '',
        teamSize: 1,
        developmentStage: 'Idea',
        uniqueSellingProposition: '',
        goToMarketStrategy: '',
        revenueModel: '',
        currentTraction: 'None',
        fundingStage: 'Pre-seed',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFindCompetitors = async () => {
        if (!formData.industry || !formData.location) {
            alert('Please fill in the Industry and Location fields first.');
            return;
        }
        try {
            const result = await findCompetitors(formData.industry, formData.location);
            setCompetitors(result);
        } catch (error) {
            alert('Could not find competitors. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newAnalysis = await createAnalysis(formData);
            navigate(`/analysis/${newAnalysis._id}`, { state: { analysis: newAnalysis } });
        } catch (error) {
            console.error('Failed to create analysis:', error);
            alert('There was an error creating the analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) {
        return <PageLoader message="Analyzing your venture..." />;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900">Analyze a New Venture</h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Provide the details below to get an AI-powered analysis and prediction.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-8 bg-white p-8 rounded-lg shadow-md">
                    {/* --- Core Idea Section --- */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Core Idea</h2>
                        <div>
                            <label htmlFor="startupName" className="block text-sm font-medium text-gray-700">Startup Name*</label>
                            <input type="text" name="startupName" id="startupName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.startupName} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website*</label>
                            <input type="url" name="website" id="website" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="https://www.example.com" value={formData.website} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="elevatorPitch" className="block text-sm font-medium text-gray-700">Elevator Pitch*</label>
                            <textarea name="elevatorPitch" id="elevatorPitch" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.elevatorPitch} onChange={handleChange}></textarea>
                        </div>
                        <div>
                            <label htmlFor="problemItSolves" className="block text-sm font-medium text-gray-700">Problem It Solves*</label>
                            <textarea name="problemItSolves" id="problemItSolves" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.problemItSolves} onChange={handleChange}></textarea>
                        </div>
                    </div>

                     {/* --- Market & Competition Section --- */}
                    <div className="space-y-6 pt-6 border-t">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Market & Competition</h2>
                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry*</label>
                            <input type="text" name="industry" id="industry" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.industry} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location*</label>
                            <input type="text" name="location" id="location" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., San Francisco, CA" value={formData.location} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="targetMarketSize" className="block text-sm font-medium text-gray-700">Target Market Size (TAM)*</label>
                            <input type="number" name="targetMarketSize" id="targetMarketSize" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 1000000000" value={formData.targetMarketSize} onChange={handleChange} />
                        </div>
                        <div className="pt-2">
                             <button type="button" onClick={handleFindCompetitors} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
                                Find Competitors
                            </button>
                        </div>
                        {competitors.length > 0 && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                <h3 className="font-semibold text-gray-800">Top Competitors:</h3>
                                <ul className="mt-2 list-disc list-inside text-gray-700">
                                    {competitors.map((comp, index) => (
                                        <li key={index}><strong>{comp.name}</strong></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* --- Team Details Section --- */}
                    <div className="space-y-6 pt-6 border-t">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Team Details</h2>
                        <div>
                            <label htmlFor="founderBios" className="block text-sm font-medium text-gray-700">Founder Bios</label>
                            <textarea name="founderBios" id="founderBios" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Describe the experience of the core team members." value={formData.founderBios} onChange={handleChange}></textarea>
                        </div>
                        <div>
                            <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">Team Size</label>
                            <input type="number" name="teamSize" id="teamSize" min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.teamSize} onChange={handleChange} />
                        </div>
                    </div>
                    
                    {/* --- Product & Technology Section --- */}
                    <div className="space-y-6 pt-6 border-t">
                         <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Product & Technology</h2>
                         <div>
                            <label htmlFor="developmentStage" className="block text-sm font-medium text-gray-700">Development Stage</label>
                            <select name="developmentStage" id="developmentStage" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.developmentStage} onChange={handleChange}>
                                <option>Idea</option>
                                <option>Prototype</option>
                                <option>MVP</option>
                                <option>Live</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="uniqueSellingProposition" className="block text-sm font-medium text-gray-700">Unique Selling Proposition (USP)</label>
                            <textarea name="uniqueSellingProposition" id="uniqueSellingProposition" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="What makes your product 10x better than competitors?" value={formData.uniqueSellingProposition} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    
                    {/* --- Go-to-Market & Revenue Section --- */}
                    <div className="space-y-6 pt-6 border-t">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Go-to-Market & Revenue</h2>
                        <div>
                            <label htmlFor="goToMarketStrategy" className="block text-sm font-medium text-gray-700">Go-to-Market Strategy</label>
                            <textarea name="goToMarketStrategy" id="goToMarketStrategy" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="How will you acquire your first 1,000 customers?" value={formData.goToMarketStrategy} onChange={handleChange}></textarea>
                        </div>
                         <div>
                            <label htmlFor="revenueModel" className="block text-sm font-medium text-gray-700">Revenue Model</label>
                            <textarea name="revenueModel" id="revenueModel" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="How will the business make money? (e.g., SaaS, transaction fees)" value={formData.revenueModel} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    
                    {/* --- Traction & Funding Section --- */}
                    <div className="space-y-6 pt-6 border-t">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Traction & Funding</h2>
                         <div>
                            <label htmlFor="currentTraction" className="block text-sm font-medium text-gray-700">Current Traction</label>
                            <textarea name="currentTraction" id="currentTraction" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., 100 beta users, $1k MRR" value={formData.currentTraction} onChange={handleChange}></textarea>
                        </div>
                         <div>
                            <label htmlFor="fundingStage" className="block text-sm font-medium text-gray-700">Funding Stage</label>
                            <select name="fundingStage" id="fundingStage" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={formData.fundingStage} onChange={handleChange}>
                                <option>Pre-seed</option>
                                <option>Seed</option>
                                <option>Series A</option>
                            </select>
                        </div>
                    </div>

                    {/* --- Final Submission --- */}
                    <div className="pt-6 border-t">
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Analyze Venture
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAnalysisPage;