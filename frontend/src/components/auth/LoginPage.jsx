import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- IMPORT THE useAuth HOOK
import AuthLayout from './AuthLayout';

const LoginPage = () => {
    // Get the login function from our AuthContext
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would first verify the email and password with your backend API.
        // For now, we will just call the login function directly.
        console.log('Login form submitted, calling login()...');
        
        // This is the function that sets isLoggedIn to true!
        login(); 
    };

    return (
        <AuthLayout title="Log In to Your Account">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-300"
                        >
                            Password
                        </label>
                        <Link to="/forgot-password" className="text-sm font-medium text-red-400 hover:text-red-300">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-transform transform hover:scale-105"
                    >
                        Log In
                    </button>
                </div>
            </form>
            <p className="mt-8 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-red-400 hover:text-red-300">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
