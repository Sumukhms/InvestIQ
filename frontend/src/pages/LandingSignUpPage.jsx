import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Reusable Components (defined within the same file for simplicity) ---

const Logo = () => (
    <div className="flex items-center space-x-2 flex-shrink-0">
        <svg className="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.44v4.8m5.96 7.13A14.98 14.98 0 0016.16 2.44m-5.84 7.38a14.98 14.98 0 00-3.32 7.13m3.32-7.13l-3.32 7.13m0 0a14.98 14.98 0 00-5.84-7.38m5.84 7.38l-5.84-7.38m5.84 7.38v4.8m-5.84-4.8v-4.8" />
        </svg>
        <span className="text-2xl font-bold text-gray-800">Invest IQ</span>
    </div>
);

// --- Main Landing Sign-Up Page Component ---
const LandingSignUpPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        }
    };

    const backgroundImageUrl = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&auto=format&fit=crop';

    return (
        <div 
            className="min-h-screen font-sans bg-gray-100 text-gray-800"
        >
            {/* Background Image Container */}
            <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                <div className="absolute inset-0 bg-white/50"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10">
                {/* Header Section */}
                <header className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Logo />
                        <div className="flex items-center">
                            <Link to="/login" className="hidden sm:inline-block border border-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm font-bold py-2 px-5 rounded-full">
                                LOGIN
                            </Link>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden ml-4 text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            </button>
                        </div>
                    </div>
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 animate-fade-in">
                            <nav className="flex flex-col space-y-3 text-center">
                                <Link to="/login" className="border border-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm font-bold py-2 px-5 rounded-full mt-2">
                                    LOGIN
                                </Link>
                            </nav>
                        </div>
                    )}
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12">
                    
                    {/* Left Column: Text Content */}
                    <div className="lg:w-1/2 w-full text-center lg:text-left animate-fade-in-up">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                            It's Time To Create Your Own Business Scheme
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Celebrated delightful an especially increasing instrument am. Indulgence contrasted sufficient to unpleasant in in insensible favourable.
                        </p>
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                            <button className="bg-red-500 text-white font-bold py-3 px-8 rounded-full hover:bg-red-600 transition-transform transform hover:scale-105">
                                GET STARTED
                            </button>
                            <button className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg transform hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-red-500 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Sign-Up Form */}
                    <div className="lg:w-1/2 w-full max-w-md animate-fade-in-up" style={{animationDelay: '200ms'}}>
                        <div className="bg-gray-800/80 backdrop-blur-sm text-white p-8 rounded-lg shadow-2xl">
                            <h2 className="text-2xl font-bold mb-2">Sign Up Today And</h2>
                            <p className="text-lg mb-6">Receive <span className="text-red-400 font-bold">30 Days FREE Trial.</span></p>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                                <div className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
                                    <label htmlFor="name" className="sr-only">Name</label>
                                    <input id="name" name="name" type="text" value={name} onChange={onChange} required className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-red-400 focus:outline-none" placeholder="Name*"/>
                                </div>
                                 <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input id="email" name="email" type="email" value={email} onChange={onChange} required className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-red-400 focus:outline-none" placeholder="Email*"/>
                                </div>
                                 <div className="animate-fade-in-up" style={{animationDelay: '500ms'}}>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input id="password" name="password" type="password" value={password} onChange={onChange} required minLength="6" className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-red-400 focus:outline-none" placeholder="Password*"/>
                                </div>
                                <div className="animate-fade-in-up" style={{animationDelay: '600ms'}}>
                                    <button type="submit" className="w-full bg-red-500 text-white font-bold py-3 px-8 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105">
                                        Register For Free
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LandingSignUpPage;
