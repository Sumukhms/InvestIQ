import React, { useEffect, useState } from 'react';

// Main App component that renders the InvestIQ homepage content
export default function App() {
  // State to manage dark mode class on the root HTML element
  // This ensures consistent dark theming across the page
  const [darkMode, setDarkMode] = useState(true);

  // useEffect hook to apply or remove the 'dark' class based on the darkMode state
  // This interacts directly with the DOM to enable Tailwind's dark mode variant styling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Clean up function to remove the class when the component unmounts or darkMode changes
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [darkMode]); // Dependency array: runs when `darkMode` state changes

  return (
    // Main container for the homepage. Applies a dark background and default text color.
    // `font-inter` and `antialiased` are for typography aesthetics.
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter antialiased overflow-hidden">
      {/* Link to Google Fonts for 'Inter' typeface. Ensures consistent font rendering. */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Inline style block for CSS keyframe animations.
          These animations provide the subtle visual effects like fading and scaling. */}
      <style>
        {`
          /* Keyframe animation for a smooth fade-in and slight upward movement */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          /* Keyframe animation for scaling up elements from a smaller, faded state */
          @keyframes scaleUp {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          /* Keyframe animation for the "blob" background elements in the hero section, creating a flowing effect */
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }

          /* Applying the animations to classes for easy use with Tailwind */
          .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
          .animate-scale-up { animation: scaleUp 0.6s ease-out forwards; }
          .animate-blob { animation: blob 7s infinite alternate ease-in-out; }

          /* Utility classes for staggered animation delays */
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-600 { animation-delay: 0.6s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>

      {/* Hero Section */}
      {/* This section serves as the main visual introduction with a bold statement and background animations. */}
      <section className="relative overflow-hidden py-32 md:py-48 bg-gradient-to-br from-gray-900 to-black text-center">
        {/* Decorative "blob" elements for dynamic background animation.
            These are positioned absolutely and styled with blur and mix-blend-mode for ethereal effect. */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        {/* Content of the Hero Section, positioned relative to be above the background blobs. */}
        <div className="relative z-10 container mx-auto px-6">
          {/* Main Headline for InvestIQ. Uses text gradients and shadows for visual pop. */}
          <h2 className="text-6xl md:text-8xl font-extrabold leading-tight mb-8 animate-fade-in delay-200 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 drop-shadow-lg">
            AI-DRIVEN INSIGHTS
          </h2>
          {/* Sub-headline, slightly smaller and complementary. */}
          <h3 className="text-4xl md:text-5xl font-bold mb-12 animate-fade-in delay-400 text-gray-200">
            For Startup Success.
          </h3>
          {/* Descriptive paragraph explaining the core value proposition. */}
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-300 animate-fade-in delay-600">
            Leverage cutting-edge artificial intelligence to navigate the complexities of the startup world,
            identify growth opportunities, and make data-backed decisions.
          </p>
          {/* Primary Call to Action button. Styled with gradients, shadow, and hover animations. */}
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold py-4 px-10 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 animate-fade-in delay-800">
            Unleash Your Startup's Potential
          </button>
        </div>
      </section>

      {/* Features Section */}
      {/* This section details the specific benefits and capabilities of InvestIQ. */}
      <section className="py-20 bg-gray-900 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <h3 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 animate-fade-in">
            How InvestIQ Empowers You
          </h3>
          {/* Grid layout for feature cards, responsive across different screen sizes. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature Card 1: Market Intelligence */}
            {/* Each card has a dark background, shadow, border, and hover animations. */}
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-100">
              {/* Icon for Market Intelligence (inline SVG for scalability and easy coloring) */}
              <svg className="h-20 w-20 mx-auto mb-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h4 className="text-2xl font-semibold mb-4 text-white">Market Intelligence</h4>
              <p className="text-gray-300 leading-relaxed">
                Gain deep insights into market trends, consumer behavior, and emerging opportunities with AI-driven analysis.
              </p>
            </div>
            {/* Feature Card 2: Competitor Analysis */}
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-200">
              {/* Icon for Competitor Analysis */}
              <svg className="h-20 w-20 mx-auto mb-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M10 20v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9m10 0v-9a2 2 0 012-2h2a2 2 0 012 2v9M9 20h6" />
              </svg>
              <h4 className="text-2xl font-semibold mb-4 text-white">Competitor Analysis</h4>
              <p className="text-gray-300 leading-relaxed">
                Understand your rivals' strengths and weaknesses, allowing you to formulate superior strategies.
              </p>
            </div>
            {/* Feature Card 3: Growth Prediction */}
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-300">
              {/* Icon for Growth Prediction */}
              <svg className="h-20 w-20 mx-auto mb-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8L11 22m-4-1h2m-2 0H5a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2h-2" />
              </svg>
              <h4 className="text-2xl font-semibold mb-4 text-white">Growth Prediction</h4>
              <p className="text-gray-300 leading-relaxed">
                Forecast future trends and potential growth trajectories to make proactive business decisions.
              </p>
            </div>
            {/* Feature Card 4: Customer Segmentation */}
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-400">
              {/* Icon for Customer Segmentation */}
              <svg className="h-20 w-20 mx-auto mb-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M17 20V4m0 16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2v2M7 10h.01M7 14h.01M11 14h.01M11 10h.01M15 10h.01M15 14h.01" />
              </svg>
              <h4 className="text-2xl font-semibold mb-4 text-white">Customer Segmentation</h4>
              <p className="text-gray-300 leading-relaxed">
                Identify and target your ideal customers more effectively with intelligent segmentation.
              </p>
            </div>
            {/* Feature Card 5: Financial Forecasting */}
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-500">
              {/* Icon for Financial Forecasting */}
              <svg className="h-20 w-20 mx-auto mb-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 14h.01M12 10h.01M5 13h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              <h4 className="text-2xl font-semibold mb-4 text-white">Financial Forecasting</h4>
              <p className="text-gray-300 leading-relaxed">
                Project financial performance and optimize resource allocation for sustained growth.
              </p>
            </div>
             {/* Feature Card 6: Risk Mitigation */}
            <div className="bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-600">
              {/* Icon for Risk Mitigation */}
              <svg className="h-20 w-20 mx-auto mb-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-2xl font-semibold mb-4 text-white">Risk Mitigation</h4>
              <p className="text-gray-300 leading-relaxed">
                Identify potential business risks early and receive recommendations to mitigate them effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* Guides the user through the process of using InvestIQ in simple steps. */}
      <section className="py-20 bg-black dark:bg-black">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <h3 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 animate-fade-in">
            Your Path to Success
          </h3>
          {/* Flex container for the steps, with a connecting line for visual flow on larger screens. */}
          <div className="flex flex-col md:flex-row justify-center items-center relative">
            {/* Horizontal connector line for desktop view, visually linking the steps. */}
            <div className="hidden md:block absolute w-full h-1 bg-gray-700 top-1/2 left-0 transform -translate-y-1/2 z-0 px-20"></div>

            {/* Step 1: Input Your Data */}
            {/* Each step card is styled with a dark background, shadow, and hover effect. */}
            <div className="relative z-10 text-center p-8 bg-gray-800 rounded-xl shadow-lg m-4 w-full md:w-1/4 transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-100">
              {/* Number icon for the step, styled with a gradient and border. */}
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-6 border-4 border-gray-700">1</div>
              <h4 className="text-2xl font-semibold mb-3 text-white">Input Your Data</h4>
              <p className="text-gray-300">Securely provide your startup's relevant business data.</p>
            </div>

            {/* Step 2: AI Analysis */}
            <div className="relative z-10 text-center p-8 bg-gray-800 rounded-xl shadow-lg m-4 w-full md:w-1/4 transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-200">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-6 border-4 border-gray-700">2</div>
              <h4 className="text-2xl font-semibold mb-3 text-white">AI Analysis</h4>
              <p className="text-gray-300">Our powerful AI engine processes your data to uncover hidden patterns.</p>
            </div>

            {/* Step 3: Actionable Insights */}
            <div className="relative z-10 text-center p-8 bg-gray-800 rounded-xl shadow-lg m-4 w-full md:w-1/4 transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-300">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-6 border-4 border-gray-700">3</div>
              <h4 className="text-2xl font-semibold mb-3 text-white">Actionable Insights</h4>
              <p className="text-gray-300">Receive clear, actionable recommendations for growth and problem-solving.</p>
            </div>

             {/* Step 4: Achieve Success */}
            <div className="relative z-10 text-center p-8 bg-gray-800 rounded-xl shadow-lg m-4 w-full md:w-1/4 transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-400">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-6 border-4 border-gray-700">4</div>
              <h4 className="text-2xl font-semibold mb-3 text-white">Achieve Success</h4>
              <p className="text-gray-300">Implement insights to drive your startup towards sustainable success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof Section */}
      {/* Displays quotes from satisfied users to build trust and credibility. */}
      <section className="py-20 bg-gray-900 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <h3 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 animate-fade-in">
            What Our Founders Say
          </h3>
          {/* Grid layout for testimonials. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Testimonial Card 1 */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-100">
              <p className="text-gray-300 text-lg italic mb-6">
                "InvestIQ is a game-changer! The AI insights helped us pivot our strategy and secure crucial funding."
              </p>
              <p className="text-indigo-400 font-semibold">- Sarah J., CEO of InnovateTech</p>
            </div>
            {/* Testimonial Card 2 */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-200">
              <p className="text-gray-300 text-lg italic mb-6">
                "The competitor analysis was incredibly detailed. We now have a clear roadmap to outperform the market."
              </p>
              <p className="text-indigo-400 font-semibold">- Mark T., Founder of NextGen Solutions</p>
            </div>
            {/* Testimonial Card 3 */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 animate-scale-up delay-300">
              <p className="text-gray-300 text-lg italic mb-6">
                "Our growth projections were spot on, thanks to InvestIQ. It's an indispensable tool for any serious startup."
              </p>
              <p className="text-indigo-400 font-semibold">- Emily R., CTO of FutureFlow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      {/* A prominent section encouraging users to take the next step. */}
      <section className="py-24 bg-gradient-to-br from-indigo-800 to-purple-900 text-white text-center">
        <div className="container mx-auto px-6">
          {/* Call to Action Headline */}
          <h3 className="text-5xl md:text-6xl font-extrabold mb-8 animate-fade-in">
            Ready to Transform Your Startup?
          </h3>
          {/* Supporting text for the CTA. */}
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 animate-fade-in delay-200">
            Join the ranks of successful founders who are building the future with InvestIQ.
          </p>
          {/* Call to Action Button. Highly styled to attract attention. */}
          <button className="bg-white text-indigo-700 hover:bg-gray-200 font-bold py-4 px-12 rounded-full shadow-2xl transition-transform transform hover:scale-105 hover:shadow-indigo-500/50 animate-fade-in delay-400">
            Start Your Free Trial Today
          </button>
        </div>
      </section>
    </div>
  );
}
