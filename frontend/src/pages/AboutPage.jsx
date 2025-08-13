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

const TeamMemberCard = ({ name, role, avatar, social }) => (
    <div className="text-center">
        <img className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg" src={avatar} alt={name} />
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-red-500 font-medium">{role}</p>
        <div className="mt-3 flex justify-center space-x-4">
            <a href={social.linkedin} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href={social.twitter} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.295 1.634 4.208 3.801 4.649-.625.17-1.284.26-1.96.26-.305 0-.6-.03-1.893-.185.63 1.878 2.447 3.248 4.604 3.286-1.711 1.332-3.882 2.126-6.233 2.126-.404 0-.802-.023-1.195-.069 2.206 1.406 4.833 2.233 7.616 2.233 9.132 0 14.11-7.563 14.11-14.11l-.012-.639c.966-.695 1.798-1.562 2.457-2.549z"/></svg>
            </a>
        </div>
    </div>
);


// --- Main AboutPage Component ---
const AboutPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { to: "/", text: "HOME" },
        { to: "/about", text: "ABOUT" },
        { to: "/#features", text: "FEATURES" },
        { to: "/dashboard", text: "DASHBOARD" },
    ];

    return (
        <div className="font-sans bg-gray-50 text-gray-800">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Logo />
                        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                            {navLinks.map(link => <Link key={link.text} to={link.to} className="hover:text-red-500 transition-colors">{link.text}</Link>)}
                        </nav>
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
                                {navLinks.map(link => <Link key={link.text} to={link.to} className="hover:text-red-500 py-1">{link.text}</Link>)}
                                <Link to="/login" className="hover:text-red-500 py-1">LOGIN</Link>
                                <Link to="/promo-signup" className="bg-red-500 text-white font-bold py-2 px-5 rounded-full mt-2">SIGN UP</Link>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <main className="animate-fade-in">
                {/* Hero Section */}
                <section className="bg-white py-20 md:py-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
                            We're on a mission to democratize entrepreneurship.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Invest IQ was founded on a simple belief: a great idea shouldn't fail because of a lack of data. We provide the tools and insights to turn ambition into achievement.
                        </p>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1920&auto=format&fit=crop" alt="Team working together" className="rounded-lg shadow-xl"/>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Born from the challenges faced by our own founders, Invest IQ began as a tool to scratch our own itch. We were tired of the guesswork and the high cost of traditional market research. We knew there had to be a better way to validate ideas quickly and affordably.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Today, we've evolved into a comprehensive platform that empowers thousands of innovators, from solo founders to enterprise teams, to build the future with confidence.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Values Section */}
                <section className="bg-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center p-4">
                                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                                <p className="text-gray-600">We constantly push the boundaries of what's possible with AI.</p>
                            </div>
                            <div className="text-center p-4">
                                <h3 className="text-xl font-bold mb-2">Empowerment</h3>
                                <p className="text-gray-600">We give founders the tools they need to succeed on their own terms.</p>
                            </div>
                             <div className="text-center p-4">
                                <h3 className="text-xl font-bold mb-2">Integrity</h3>
                                <p className="text-gray-600">We believe in transparent, data-driven insights you can trust.</p>
                            </div>
                             <div className="text-center p-4">
                                <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                                <p className="text-gray-600">We succeed when our users succeed. We're partners in growth.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Meet the Team Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Meet the Innovators</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
                            <TeamMemberCard name="Spoorthi K" role="Founder & CEO" avatar="https://placehold.co/200x200/E0E0E0/333?text=SK" social={{linkedin: "#", twitter: "#"}} />
                            <TeamMemberCard name="Sumukh M S" role="Chief Technology Officer" avatar="https://placehold.co/200x200/E0E0E0/333?text=SM" social={{linkedin: "#", twitter: "#"}} />
                            <TeamMemberCard name="Varshini H Gowda" role="Head of Product" avatar="https://placehold.co/200x200/E0E0E0/333?text=VG" social={{linkedin: "#", twitter: "#"}} />
                            <TeamMemberCard name="Srikanth P V" role="Lead AI Engineer" avatar="https://placehold.co/200x200/E0E0E0/333?text=SP" social={{linkedin: "#", twitter: "#"}} />
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="bg-red-500 text-white">
                    <div className="container mx-auto px-6 py-20 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mission</h2>
                        <p className="max-w-2xl mx-auto mb-8 text-red-100">
                           Help us build a world where every great idea has a chance to thrive.
                        </p>
                        <Link to="/promo-signup" className="bg-white text-red-500 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 text-lg">
                            Get Started Now
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

export default AboutPage;
