import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { IconRocket, IconLoader, IconPlus, IconTrash } from '../components/icons';

// --- Helper to calculate progress ---
const calculateProgress = (formData) => {
    const fields = [
        'startupName', 'pitch', 'problem', 'industry', 'location',
        'marketSize', 'fundingStage', 'revenue'
    ];
    let filledCount = fields.filter(field => formData[field] && formData[field] !== '').length;
    
    // Add competitor check
    if (formData.competitors && formData.competitors.length > 0 && formData.competitors[0].name !== '') {
        filledCount++;
    }
    
    return (filledCount / (fields.length + 1)) * 100;
};


// --- Main NewAnalysisPage Component ---
const NewAnalysisPage = () => {
    const [formData, setFormData] = useState({
        startupName: '',
        website: '',
        pitch: '',
        problem: '',
        industry: '',
        location: '',
        marketSize: '',
        fundingStage: '',
        revenue: '',
        competitors: [{ name: '', strength: '' }],
    });
    const [progress, setProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setProgress(calculateProgress(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompetitorChange = (index, e) => {
        const { name, value } = e.target;
        const newCompetitors = [...formData.competitors];
        newCompetitors[index][name] = value;
        setFormData(prev => ({ ...prev, competitors: newCompetitors }));
    };

    const addCompetitor = () => {
        setFormData(prev => ({
            ...prev,
            competitors: [...prev.competitors, { name: '', strength: '' }]
        }));
    };

    const removeCompetitor = (index) => {
        const newCompetitors = formData.competitors.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, competitors: newCompetitors }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const res = await api.post('/analysis', formData);
            navigate(`/analysis/${res.data._id}`, { state: { result: res.data } });
        } catch (err) {
            setError('An error occurred. Please ensure all required fields are filled out.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Comprehensive Venture Analysis</h1>
                    <p className="text-lg text-gray-600 mt-2">Provide detailed information for a more accurate prediction.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
                    {/* Progress Bar */}
                    <div className="mb-10">
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-red-500">Analysis Progress</span>
                            <span className="text-sm font-medium text-red-500">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset className="space-y-6">
                            <legend className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4">Core Idea</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="startupName" className="block text-sm font-medium text-gray-700 mb-1">Startup Name*</label>
                                    <input type="text" id="startupName" name="startupName" value={formData.startupName} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., Innovatech AI" required />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                    <input type="url" id="website" name="website" value={formData.website} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="https://example.com" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-1">Elevator Pitch*</label>
                                <textarea id="pitch" name="pitch" rows="3" value={formData.pitch} onChange={handleChange}
                                    className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="A brief, compelling summary of what your startup does." required></textarea>
                            </div>
                            <div>
                                <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">Problem It Solves*</label>
                                <textarea id="problem" name="problem" rows="4" value={formData.problem} onChange={handleChange}
                                    className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="Describe the core pain point you are addressing for your customers." required></textarea>
                            </div>
                        </fieldset>

                        <fieldset className="space-y-6">
                            <legend className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4">Market & Competition</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry*</label>
                                    <input type="text" id="industry" name="industry" value={formData.industry} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., SaaS, FinTech, HealthTech" required />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                                    <input type="text" id="location" name="location" value={formData.location} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., San Francisco, USA" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Competitors</label>
                                {formData.competitors.map((competitor, index) => (
                                    <div key={index} className="flex items-center gap-4 mb-3">
                                        <input type="text" name="name" value={competitor.name} onChange={e => handleCompetitorChange(index, e)}
                                            className="w-1/2 bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder={`Competitor ${index + 1} Name`}
                                        />
                                        <input type="text" name="strength" value={competitor.strength} onChange={e => handleCompetitorChange(index, e)}
                                            className="w-1/2 bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="Their main strength"
                                        />
                                        <button type="button" onClick={() => removeCompetitor(index)} className="text-gray-400 hover:text-red-500">
                                            <IconTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addCompetitor} className="flex items-center gap-2 text-sm text-red-500 font-semibold hover:text-red-700">
                                    <IconPlus className="w-4 h-4" /> Add Competitor
                                </button>
                            </div>
                        </fieldset>

                        <fieldset className="space-y-6">
                            <legend className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-4">Financials</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="marketSize" className="block text-sm font-medium text-gray-700 mb-1">Target Market Size (TAM)*</label>
                                    <input type="text" id="marketSize" name="marketSize" value={formData.marketSize} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., $1 Billion" required />
                                </div>
                                <div>
                                    <label htmlFor="fundingStage" className="block text-sm font-medium text-gray-700 mb-1">Funding Stage*</label>
                                    <select id="fundingStage" name="fundingStage" value={formData.fundingStage} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none" required>
                                        <option value="">Select a stage</option>
                                        <option value="pre-seed">Pre-Seed / Idea</option>
                                        <option value="seed">Seed</option>
                                        <option value="series-a">Series A</option>
                                        <option value="series-b">Series B</option>
                                        <option value="growth">Growth / Late Stage</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-1">Monthly Recurring Revenue (MRR)*</label>
                                    <input type="number" id="revenue" name="revenue" min="0" value={formData.revenue} onChange={handleChange}
                                        className="w-full bg-gray-50 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="e.g., 50000" required/>
                                </div>
                            </div>
                        </fieldset>

                        <div className="pt-6 text-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-wait text-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <IconLoader className="animate-spin w-6 h-6" />
                                        Generating Insights...
                                    </>
                                ) : (
                                    <>
                                        <IconRocket className="w-6 h-6" />
                                        Analyze Venture
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default NewAnalysisPage;