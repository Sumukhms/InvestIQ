import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('You have been logged out.');
        navigate('/');
    };

    // Style for active NavLink
    const activeLinkStyle = {
        color: '#60A5FA', // A light blue color for the active link
        borderBottom: '2px solid #60A5FA',
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Left side: Logo and main navigation links */}
                    <div className="flex items-center">
                        <NavLink to="/dashboard" className="font-bold text-xl text-blue-400 mr-6">
                            InvestIQ
                        </NavLink>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Dashboard</NavLink>
                                <NavLink to="/scorecard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Scorecard</NavLink>
                                <NavLink to="/growth-suggestions" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">AI Advisor</NavLink>
                                <NavLink to="/financials" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Financials</NavLink>
                                <NavLink to="/alerts" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Alerts</NavLink>
                                <NavLink to="/competitors" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Competitors</NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Profile and dropdown */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="relative">
                                <button onClick={toggleDropdown} className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/40" alt="User" />
                                </button>
                                {isDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                        <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</NavLink>
                                        <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</NavLink>
                                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;