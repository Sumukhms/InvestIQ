import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout'; // The wrapper for consistent styling

const SignUpPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sign-up form submitted');
        alert('Sign-up functionality would be handled here!');
    };

    return (
        <AuthLayout title="Create Your Account">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="fullname"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Full Name
                    </label>
                    <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        autoComplete="name"
                        required
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        placeholder="e.g., Alex Doe"
                    />
                </div>

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
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        placeholder="••••••••"
                    />
                </div>

                <div className="text-xs text-gray-400">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="font-medium text-red-400 hover:text-red-300">
                        Terms of Service
                    </Link>
                    .
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-transform transform hover:scale-105"
                    >
                        Create Account
                    </button>
                </div>
            </form>
            <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-red-400 hover:text-red-300">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default SignUpPage;
