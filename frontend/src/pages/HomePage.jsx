import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Reusable Components (defined within the same file for simplicity) ---

const Logo = () => (
    <div className="flex items-center space-x-2 flex-shrink-0">
        <svg className="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.44v4.8m5.96 7.13A14.98 14.98 0 0016.16 2.44m-5.84 7.38a14.98 14.98 0 00-3.32 7.13m3.32-7.13l-3.32 7.13m0 0a14.98 14.98 0 00-5.84-7.38m5.84 7.38l-5.84-7.38m5.84 7.38v4.8m-5.84-4.8v-4.8" />
        </svg>
        <span className="text-2xl font-bold text-gray-800">Invest IQ</span>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="inline-block p-4 bg-red-100 text-red-500 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const TestimonialCard = ({ quote, author, title, avatar }) => (
    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl">
        <p className="italic mb-6">"{quote}"</p>
        <div className="flex items-center">
            <img className="w-12 h-12 rounded-full mr-4" src={avatar} alt={author} />
            <div>
                <p className="font-bold">{author}</p>
                <p className="text-sm text-gray-400">{title}</p>
            </div>
        </div>
    </div>
);


// --- Main HomePage Component ---
const HomePage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="font-sans bg-gray-50 text-gray-800">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Logo />
                        <div className="flex items-center">
                            <Link to="/login" className="hidden sm:inline-block text-sm font-medium mr-4 hover:text-red-500">LOGIN</Link>
                            <Link to="/promo-signup" className="hidden sm:inline-block bg-red-500 text-white text-sm font-bold py-2 px-5 rounded-full hover:bg-red-600 transition-colors">
                                SIGN UP
                            </Link>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden ml-4 text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            </button>
                        </div>
                    </div>
                    {isMenuOpen && (
                        <div className="md:hidden mt-4">
                            <nav className="flex flex-col space-y-3 text-center">
                                <Link to="/login" className="hover:text-red-500 py-1">LOGIN</Link>
                                <Link to="/promo-signup" className="bg-red-500 text-white font-bold py-2 px-5 rounded-full mt-2">SIGN UP</Link>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="bg-white">
                    <div className="container mx-auto px-6 py-20 md:py-32 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4 animate-fade-in-up">
                            Unlock Your Next Business Venture
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                            Invest IQ provides AI-powered insights to help you analyze, validate, and launch your business ideas with confidence.
                        </p>
                        <div className="flex justify-center gap-4 animate-fade-in-up" style={{animationDelay: '400ms'}}>
                            <Link to="/promo-signup" className="bg-red-500 text-white font-bold py-3 px-8 rounded-full hover:bg-red-600 transition-transform transform hover:scale-105">
                                Get Started For Free
                            </Link>
                            <Link to="/#features" className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Succeed</h2>
                            <p className="text-gray-600 mt-2">Powerful tools to guide your entrepreneurial journey.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3"></path></svg>} title="AI Idea Generation" description="Spark new, viable business ideas with our creative AI engine." />
                            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} title="In-Depth Analysis" description="Get comprehensive reports on market size, competition, and potential risks." />
                            <FeatureCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>} title="Growth Forecasting" description="Utilize predictive analytics to forecast revenue and key growth metrics." />
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="bg-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Get Started in 3 Simple Steps</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                                <h3 className="text-xl font-bold mb-2">Submit Your Idea</h3>
                                <p className="text-gray-600">Provide a brief description of your business concept or startup idea.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                                <h3 className="text-xl font-bold mb-2">Receive AI Analysis</h3>
                                <p className="text-gray-600">Our platform analyzes your idea against millions of data points in seconds.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                                <h3 className="text-xl font-bold mb-2">Make Data-Driven Decisions</h3>
                                <p className="text-gray-600">Use your detailed report to refine your strategy and launch with confidence.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="bg-gray-900 py-20">
                     <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Trusted by Innovators Worldwide</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                           <TestimonialCard quote="Invest IQ gave us the clarity we needed to pivot our strategy. The market analysis was a game-changer." author="Jane Doe" title="CEO, Tech Innovators" avatar="https://placehold.co/100x100/E0E0E0/333?text=JD" />
                           <TestimonialCard quote="As a first-time founder, the risk assessment report was invaluable. It helped me secure my first round of funding." author="John Smith" title="Founder, Greenly" avatar="https://placehold.co/100x100/E0E0E0/333?text=JS" />
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="bg-white py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Validate Your Vision?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            Stop guessing. Start analyzing. Join thousands of founders who are building the future with data-driven confidence.
                        </p>
                        <Link to="/promo-signup" className="bg-red-500 text-white font-bold py-4 px-10 rounded-full hover:bg-red-600 transition-transform transform hover:scale-105 text-lg">
                            Start Your Free Trial
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-6 py-8 text-center">
                    <Logo />
                    <p className="mt-4 text-sm text-gray-400">&copy; 2025 Invest IQ. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
