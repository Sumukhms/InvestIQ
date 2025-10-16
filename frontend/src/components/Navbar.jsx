import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Clear token from local storage to log the user out
        localStorage.removeItem('token');
        alert('You have been logged out.');
        // Redirect to the login page
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/dashboard" className="navbar-logo">
                    InvestIQ
                </Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-links">
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/scorecard" className="nav-links">
                            Scorecard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/growth-suggestions" className="nav-links">
                            AI Advisor
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/financials" className="nav-links">
                              Financials
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/alerts" className="nav-links">
                           Alerts
                      </Link>
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
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        className="profile-pic"
                    />
                    <i className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></i>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
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