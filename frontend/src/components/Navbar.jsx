import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token from local storage to log the user out
        localStorage.removeItem('token');
        alert('You have been logged out.');
        // Redirect to the login page
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
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
                </ul>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

