import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconRocket, IconTarget, IconCurrencyDollar, IconCircleCheck } from '../components/icons';

// --- Step 1 Component ---
const Step1 = ({ formData, handleChange }) => (
    <div className="space-y-6">
        <div>
            <label htmlFor="startupName" className="block text-sm font-medium text-gray-300 mb-1">Startup Name</label>
            <input type="text" id="startupName" name="startupName" value={formData.startupName || ''} onChange={handleChange}
                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   placeholder="e.g., Innovatech AI" />
        </div>
        <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">Website</label>
            <input type="url" id="website" name="website" value={formData.website || ''} onChange={handleChange}
                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   placeholder="https://example.com" />
        </div>
        <div>
            <label htmlFor="pitch" className="block text-sm font-medium text-gray-300 mb-1">Elevator Pitch</label>
            <textarea id="pitch" name="pitch" rows="3" value={formData.pitch || ''} onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="A brief summary of what your startup does."></textarea>
        </div>
    </div>
);

// --- Step 2 Component ---
const Step2 = ({ formData, handleChange }) => (
    <div className="space-y-6">
        <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-300 mb-1">Problem It Solves</label>
            <textarea id="problem" name="problem" rows="4" value={formData.problem || ''} onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Describe the core problem you are addressing for your customers."></textarea>
        </div>
        <div>
            <label htmlFor="marketSize" className="block text-sm font-medium text-gray-300 mb-1">Target Market Size (TAM)</label>
            <input type="text" id="marketSize" name="marketSize" value={formData.marketSize || ''} onChange={handleChange}
                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   placeholder="e.g., $1 Billion" />
        </div>
    </div>
);

// --- Step 3 Component ---
const Step3 = ({ formData, handleChange }) => (
    <div className="space-y-6">
        <div>
            <label htmlFor="fundingStage" className="block text-sm font-medium text-gray-300 mb-1">Funding Stage</label>
            <select id="fundingStage" name="fundingStage" value={formData.fundingStage || ''} onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select a stage</option>
                <option value="pre-seed">Pre-Seed / Idea</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B</option>
                <option value="growth">Growth / Late Stage</option>
            </select>
        </div>
        <div>
            <label htmlFor="revenue" className="block text-sm font-medium text-gray-300 mb-1">Monthly Recurring Revenue (MRR)</label>
            <input type="number" id="revenue" name="revenue" min="0" value={formData.revenue || ''} onChange={handleChange}
                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   placeholder="e.g., 50000" />
        </div>
    </div>
);

// --- Step 4 Component (Review) ---
const Step4 = ({ formData }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Review Your Submission</h3>
        {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
                <p className="text-sm font-medium text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-white font-semibold">{value || 'Not provided'}</p>
            </div>
        ))}
    </div>
);

// --- Stepper Component ---
const Stepper = ({ currentStep }) => {
    const steps = [
        { number: 1, title: 'Basics', icon: <IconRocket className="w-5 h-5"/> },
        { number: 2, title: 'Market', icon: <IconTarget className="w-5 h-5"/> },
        { number: 3, title: 'Financials', icon: <IconCurrencyDollar className="w-5 h-5"/> },
        { number: 4, title: 'Review', icon: <IconCircleCheck className="w-5 h-5"/> },
    ];
    return (
        <nav aria-label="Progress" className="mb-12">
            <ol className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.title} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                        <div className="flex items-center text-sm font-medium">
                            <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${currentStep > step.number ? 'bg-blue-600' : currentStep === step.number ? 'bg-blue-500 border-2 border-blue-300' : 'bg-gray-700'}`}>
                                {currentStep > step.number ? <IconCircleCheck className="w-6 h-6 text-white"/> : <span className={currentStep === step.number ? 'text-white' : 'text-gray-400'}>{step.icon}</span>}
                            </span>
                            <span className={`ml-4 text-sm font-medium hidden sm:block ${currentStep >= step.number ? 'text-white' : 'text-gray-500'}`}>{step.title}</span>
                        </div>
                        {stepIdx !== steps.length - 1 && (
                            <div className={`absolute top-5 left-12 w-full h-0.5 transition-colors duration-300 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-700'}`} />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

// --- Main NewAnalysisPage Component ---
const NewAnalysisPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Final Form Data Submitted:", formData);
        // Here you would typically send the data to your backend API
        alert("Analysis submitted! Check the console for the data.");
    };

    return (
        <main className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Analyze a New Venture</h1>
                    <p className="text-lg text-gray-400 mt-2">Provide the details below to generate an in-depth analysis.</p>
                </div>

                <Stepper currentStep={currentStep} />
                
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 min-h-[300px]">
                    <form onSubmit={handleSubmit} className="animate-fade-in">
                        {currentStep === 1 && <Step1 formData={formData} handleChange={handleChange} />}
                        {currentStep === 2 && <Step2 formData={formData} handleChange={handleChange} />}
                        {currentStep === 3 && <Step3 formData={formData} handleChange={handleChange} />}
                        {currentStep === 4 && <Step4 formData={formData} />}
                    </form>
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <IconChevronLeft className="w-5 h-5"/> Previous
                    </button>

                    {currentStep < 4 ? (
                         <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
                            Next <IconChevronRight className="w-5 h-5"/>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
                            <IconRocket className="w-5 h-5"/> Analyze Now
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
};

export default NewAnalysisPage;