import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // This effect runs when the component loads
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // If a token is found in the URL, save it to local storage
            localStorage.setItem('token', token);
            // Clean the URL by removing the token query parameter
            navigate('/dashboard', { replace: true });
        }
    }, [location, navigate]);

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        alert('You have been logged out.');
        // Redirect to the login page
        navigate('/');
    };

    return (
        <div style={{
            padding: '50px',
            color: '#fff',
            textAlign: 'center',
            backgroundColor: '#1A1D2E',
            minHeight: '100vh'
        }}>
            <h1>Welcome to Your InvestIQ Dashboard</h1>
            <p>This is a protected page. You have successfully logged in.</p>
            <button
                onClick={handleLogout}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    backgroundColor: '#4A90E2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px'
                }}
            >
                Log Out
            </button>
        </div>
    );
};

export default DashboardPage;
