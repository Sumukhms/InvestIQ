import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconUser, IconSettings, IconLogOut } from './icons';

const Header = () => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const activePage = location.pathname.replace('/', '');

    const handleNavClick = (page) => {
        navigate(`/${page}`);
    };

    const NavLink = ({ page, children }) => (
        <button 
            onClick={() => handleNavClick(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === page 
                ? 'text-red-500' 
                : 'text-gray-700 hover:text-red-500'
            }`}
        >
            {children}
        </button>
    );

    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
                        <span className="text-red-500">Invest</span>IQ
                    </h1>
                    <nav className="hidden md:flex items-center space-x-4">
                        <NavLink page="dashboard">Dashboard</NavLink>
                        <NavLink page="features">Features</NavLink>
                        <NavLink page="new-analysis">New Analysis</NavLink>
                        <NavLink page="about">About</NavLink>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button onClick={() => setProfileOpen(!isProfileOpen)} className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                            {user?.name.charAt(0)}
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><IconUser /> Profile</a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><IconSettings /> Settings</a>
                                <div className="border-t border-gray-200 my-2"></div>
                                <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><IconLogOut /> Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
