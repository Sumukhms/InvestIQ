import React, { useState } from 'react';
import { IconUser, IconSettings, IconLogOut } from './icons';

const Header = ({ user, onNavClick, activePage, onLogout }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);

    const NavLink = ({ page, children }) => (
        <button 
            onClick={() => onNavClick(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === page 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
        >
            {children}
        </button>
    );

    return (
        <header className="bg-gray-800/70 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => onNavClick('dashboard')}>
                        <span className="text-blue-400">Invest</span>IQ
                    </h1>
                    <nav className="hidden md:flex items-center space-x-4">
                        <NavLink page="dashboard">Dashboard</NavLink>
                        <NavLink page="features">Features</NavLink>
                        <NavLink page="new-analysis">New Analysis</NavLink>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button onClick={() => setProfileOpen(!isProfileOpen)} className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            {user.name.charAt(0)}
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl py-2 border border-gray-600">
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"><IconUser /> Profile</a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"><IconSettings /> Settings</a>
                                <div className="border-t border-gray-600 my-2"></div>
                                <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600"><IconLogOut /> Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;