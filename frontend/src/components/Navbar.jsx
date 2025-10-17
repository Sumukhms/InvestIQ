// File: frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- 1. Import axios
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    // 2. Add state to store user's profile picture
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/40');
    const navigate = useNavigate();

    // 3. Fetch user data when the Navbar loads
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return; // Don't fetch if not logged in

            try {
                const config = {
                    headers: { 'x-auth-token': token },
                };
                const res = await axios.get('http://localhost:5000/api/auth/profile', config);
                
                // Use the fetched picture if it exists
                if (res.data.profilePicture) {
                    setProfilePic(res.data.profilePicture);
                }
            } catch (error) {
                console.error("Failed to fetch user data for navbar:", error);
            }
        };

        fetchUserData();
    }, []); // Empty array means this runs once on mount

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('You have been logged out.');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/dashboard" className="navbar-logo">
                    InvestIQ
                </Link>
                <ul className="nav-menu">
                    {/* Your other nav links remain the same */}
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-links">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/scorecard" className="nav-links">Scorecard</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/growth-suggestions" className="nav-links">AI Advisor</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/financials" className="nav-links">Financials</Link>
                    </li>
                     <li className="nav-item">
                        <Link to="/alerts" className="nav-links">Alerts</Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                <div className="search-container">
                    <span className="search-icon" role="img" aria-label="search">🔍</span>
                    <input type="text" placeholder="Search" />
                </div>
                <div className="icon-item">
                    <span className="navbar-icon" role="img" aria-label="messages">💬</span>
                </div>
                <div className="icon-item">
                    <span className="navbar-icon" role="img" aria-label="notifications">🔔</span>
                </div>
                <div className="profile-container" onClick={toggleDropdown}>
                    <img
                        src={profilePic} // <-- 4. Use the dynamic profile picture from state
                        alt="Profile"
                        className="profile-pic"
                    />
                    <i className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></i>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {/* This link correctly sends the user to the profile page */}
                            <Link to="/profile">Profile</Link>
                            <Link to="/settings">Settings</Link>
                            <button onClick={handleLogout} className="logout-button-dropdown">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;