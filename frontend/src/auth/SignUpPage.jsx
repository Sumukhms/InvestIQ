import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from './AuthLayout';

const SignUpPage = () => {
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
        try {
            await register(formData);
            navigate('/dashboard'); // Redirect to dashboard on successful registration
        } catch (err) {
            setError(err.response.data.msg || 'Registration failed');
        }
    };

    return (
        <AuthLayout title="Create Your Account">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={onChange}
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
                        value={email}
                        onChange={onChange}
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
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        placeholder="••••••••"
                    />
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
