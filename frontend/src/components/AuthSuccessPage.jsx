import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Parse the token from the URL query string
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Store the token in local storage so the user stays logged in
            localStorage.setItem('token', token);
            
            // Redirect to the main dashboard
            navigate('/dashboard');
        } else {
            // If there's no token, something went wrong, so go back to login
            navigate('/');
        }
    }, [location, navigate]); // This effect runs once when the component mounts

    // You can show a simple loading message while redirecting
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
            <h2>Authentication Successful!</h2>
            <p>Redirecting you to your dashboard...</p>
        </div>
    );
};

export default AuthSuccessPage;