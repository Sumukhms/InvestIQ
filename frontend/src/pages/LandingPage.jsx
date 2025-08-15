// This is the beautiful, "flashy" landing page for logged-out users.
import React, { useEffect, useState, useRef } from 'react';
import Footer from '../components/Footer';
import { IconChartBar, IconTrendingUp, IconShieldCheck, IconLightbulb, IconCheck } from '../components/icons';

// Custom hook for observing intersection
const useIntersectionObserver = (options) => {
    const [entry, setEntry] = useState(null);
    const [node, setNode] = useState(null);

    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new window.IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setEntry(entry);
                observer.current.unobserve(entry.target);
            }
        }, options);

        const { current: currentObserver } = observer;
        if (node) currentObserver.observe(node);

        return () => currentObserver.disconnect();
    }, [node, options]);

    return [setNode, entry];
};

const AnimatedSection = ({ children, delay = 0, className = '' }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = !!entry;
    
    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-6">
                <span className="text-lg font-semibold text-white">{question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="pb-6 text-gray-400">{answer}</p>
            </div>
        </div>
    );
};

const LandingPage = ({ onLogin }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logos = [
        { name: 'QuantumLeap', component: <svg className="h-8 text-gray-400" viewBox="0 0 120 40"><text x="0" y="30" fontFamily="Arial" fontSize="24" fill="currentColor">QuantumLeap</text></svg> },
        { name: 'Innovate Inc.', component: <svg className="h-8 text-gray-400" viewBox="0 0 120 40"><text x="5" y="30" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="currentColor">Innovate</text></svg> },
        { name: 'Apex Solutions', component: <svg className="h-8 text-gray-400" viewBox="0 0 120 40"><text x="15" y="30" fontFamily="Georgia" fontSize="26" fill="currentColor">Apex</text></svg> },
        { name: 'FutureForward', component: <svg className="h-8 text-gray-400" viewBox="0 0 120 40"><text x="0" y="30" fontFamily="Verdana" fontSize="22" fill="currentColor">FutureForward</text></svg> },
        { name: 'Visionary Co.', component: <svg className="h-8 text-gray-400" viewBox="0 0 120 40"><text x="10" y="30" fontFamily="cursive" fontSize="28" fill="currentColor">Visionary</text></svg> },
        { name: 'NextGen', component: <svg className="h-8 text-gray-400" viewBox="0 0 120 40"><text x="20" y="30" fontFamily="monospace" fontSize="24" fill="currentColor">NextGen</text></svg> },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-inter antialiased overflow-x-hidden flex flex-col">
            <style>
                {`
                @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
                .animate-marquee { animation: marquee 30s linear infinite; }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 8s infinite alternate ease-in-out; }
                .animation-delay-2s { animation-delay: 2s; }
                .animation-delay-4s { animation-delay: 4s; }
                `}
            </style>
            
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-700' : 'bg-transparent'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white"><span className="text-blue-400">Invest</span>IQ</h1>
                    <button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors">
                        Sign In
                    </button>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-48 pb-40 bg-gray-900 text-center">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-2xl opacity-50 animate-blob"></div>
                        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-500 rounded-full mix-blend-lighten filter blur-2xl opacity-50 animate-blob animation-delay-2s"></div>
                        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-lighten filter blur-2xl opacity-50 animate-blob animation-delay-4s"></div>
                    </div>
                    <div className="relative z-10 container mx-auto px-6">
                        <AnimatedSection>
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-lg">
                                Data-Driven Startup Analysis
                            </h1>
                        </AnimatedSection>
                        <AnimatedSection delay={200}>
                            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-300">
                                Leverage cutting-edge artificial intelligence to navigate the complexities of the startup world, identify growth opportunities, and make data-backed decisions.
                            </p>
                        </AnimatedSection>
                        <AnimatedSection delay={400}>
                            <button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                                Get Started for Free
                            </button>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Trusted By Marquee */}
                <section className="py-12 bg-gray-800/50">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by the world's most innovative companies</h2>
                        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                            <div className="flex animate-marquee">
                                {[...logos, ...logos].map((logo, index) => (
                                    <div key={index} className="flex-shrink-0 w-48 flex justify-center items-center">
                                        {logo.component}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Features Section */}
                <section className="py-24 bg-gray-900">
                    <div className="container mx-auto px-6">
                        <AnimatedSection>
                            <h2 className="text-4xl font-bold text-center mb-12 text-white">A Toolkit for Success</h2>
                        </AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AnimatedSection delay={100} className="md:col-span-2 bg-gray-800 p-8 rounded-xl border border-gray-700 flex flex-col justify-between">
                                <div>
                                    <div className="text-blue-400 mb-4"><IconChartBar /></div>
                                    <h3 className="text-2xl font-bold text-white mb-2">In-Depth Market Analysis</h3>
                                    <p className="text-gray-400">Go beyond surface-level stats. Understand market size (TAM, SAM, SOM), customer demographics, and adoption rates with unparalleled accuracy.</p>
                                </div>
                            </AnimatedSection>
                            <AnimatedSection delay={200} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                                <div className="text-cyan-400 mb-4"><IconTrendingUp /></div>
                                <h3 className="text-2xl font-bold text-white mb-2">Growth Forecasting</h3>
                                <p className="text-gray-400">Predict revenue, user acquisition, and potential roadblocks with our forward-looking models.</p>
                            </AnimatedSection>
                            <AnimatedSection delay={300} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                                <div className="text-teal-400 mb-4"><IconShieldCheck /></div>
                                <h3 className="text-2xl font-bold text-white mb-2">Risk Assessment</h3>
                                <p className="text-gray-400">Identify critical risks—from competitive threats to financial instability—before they impact your venture.</p>
                            </AnimatedSection>
                            <AnimatedSection delay={400} className="md:col-span-2 bg-gray-800 p-8 rounded-xl border border-gray-700 flex flex-col justify-between">
                                <div>
                                    <div className="text-blue-300 mb-4"><IconLightbulb /></div>
                                    <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Recommendations</h3>
                                    <p className="text-gray-400">Receive clear, actionable, and data-backed advice on everything from your go-to-market strategy to your next funding round.</p>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-24 bg-gray-800/50">
                    <div className="container mx-auto px-6 text-center">
                        <AnimatedSection>
                            <h2 className="text-4xl font-bold text-white mb-4">Find the Perfect Plan</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto mb-12">Start for free, then scale as you grow. No hidden fees, no long-term contracts.</p>
                        </AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Free Plan */}
                            <AnimatedSection delay={100} className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex flex-col">
                                <h3 className="text-2xl font-bold text-white">Founder</h3>
                                <p className="text-gray-400 mt-2 mb-6">For individuals and early-stage teams</p>
                                <p className="text-5xl font-extrabold text-white mb-6">$0<span className="text-lg font-normal text-gray-400">/mo</span></p>
                                <ul className="text-left space-y-3 mb-8 flex-grow">
                                    <li className="flex items-center"><IconCheck /> 5 analyses per month</li>
                                    <li className="flex items-center"><IconCheck /> Basic risk assessment</li>
                                    <li className="flex items-center"><IconCheck /> Community support</li>
                                </ul>
                                <button className="mt-auto w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors">Get Started</button>
                            </AnimatedSection>
                            
                            {/* Pro Plan */}
                            <AnimatedSection delay={200} className="bg-gray-800 p-8 rounded-xl border-2 border-blue-500 flex flex-col relative">
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
                                <h3 className="text-2xl font-bold text-blue-400">Accelerator</h3>
                                <p className="text-gray-400 mt-2 mb-6">For growing startups and VCs</p>
                                <p className="text-5xl font-extrabold text-white mb-6">$49<span className="text-lg font-normal text-gray-400">/mo</span></p>
                                <ul className="text-left space-y-3 mb-8 flex-grow">
                                    <li className="flex items-center"><IconCheck /> Unlimited analyses</li>
                                    <li className="flex items-center"><IconCheck /> Advanced risk assessment</li>
                                    <li className="flex items-center"><IconCheck /> Competitor analysis</li>
                                    <li className="flex items-center"><IconCheck /> Priority email support</li>
                                </ul>
                                <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">Choose Plan</button>
                            </AnimatedSection>

                            {/* Enterprise Plan */}
                            <AnimatedSection delay={300} className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex flex-col">
                                <h3 className="text-2xl font-bold text-white">Enterprise</h3>
                                <p className="text-gray-400 mt-2 mb-6">For large-scale incubators and funds</p>
                                <p className="text-4xl font-extrabold text-white mb-6 pt-2">Let's Talk</p>
                                <ul className="text-left space-y-3 mb-8 flex-grow">
                                    <li className="flex items-center"><IconCheck /> Custom data integration</li>
                                    <li className="flex items-center"><IconCheck /> On-premise deployment</li>
                                    <li className="flex items-center"><IconCheck /> Dedicated account manager</li>
                                    <li className="flex items-center"><IconCheck /> API access</li>
                                </ul>
                                <button className="mt-auto w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors">Contact Sales</button>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                
                {/* FAQ Section */}
                <section className="py-24 bg-gray-900">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <AnimatedSection>
                            <h2 className="text-4xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
                        </AnimatedSection>
                        <AnimatedSection delay={200}>
                            <FAQItem 
                                question="How accurate is the AI analysis?"
                                answer="Our models are trained on a vast dataset of historical startup outcomes and are continuously updated with new market data. While no prediction is 100% certain, our analysis provides a highly accurate, data-backed probability score to guide your decisions."
                            />
                            <FAQItem 
                                question="Is my data secure?"
                                answer="Absolutely. We use industry-standard encryption for data in transit and at rest. Your proprietary information is treated with the utmost confidentiality and is never shared with third parties. See our Privacy Policy for more details."
                            />
                            <FAQItem 
                                question="Can I cancel my subscription at any time?"
                                answer="Yes, you can cancel your monthly subscription at any time directly from your account dashboard. You will retain access to your plan's features until the end of the current billing period."
                            />
                             <FAQItem 
                                question="What kind of data do I need to provide?"
                                answer="To get the most accurate analysis, you'll be prompted to enter information about your startup's market, product, team, and financial projections. The more detailed the data, the more precise the insights."
                            />
                        </AnimatedSection>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
