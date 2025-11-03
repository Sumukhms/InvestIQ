// AuthSuccessPage.jsx - Updated to set profile data after OAuth login

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthSuccessPage = ({ setProfileData }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthSuccess = async () => {
            // Parse the token from the URL query string
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (token) {
                // Store the token in local storage
                localStorage.setItem('token', token);
                
                // Fetch profile data immediately after storing token
                try {
                    const profileRes = await axios.get('/api/auth/profile', {
                        headers: { 'x-auth-token': token }
                    });
                    
                    console.log('Profile data fetched after OAuth login:', profileRes.data);
                    
                    // Update App-level profile state
                    if (setProfileData) {
                        setProfileData({
                            name: profileRes.data.name || '',
                            email: profileRes.data.email || '',
                            role: profileRes.data.role || '',
                            company: profileRes.data.company || '',
                            bio: profileRes.data.bio || '',
                            avatar: profileRes.data.avatar || ''
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch profile after OAuth:', err);
                    // Continue to dashboard even if profile fetch fails
                    // The App.jsx useEffect will try to load it again
                }
                
                // Redirect to the main dashboard
                setTimeout(() => {
                    navigate('/dashboard');
                }, 500); // Small delay to ensure state updates
            } else {
                // If there's no token, something went wrong, so go back to login
                navigate('/');
            }
        };

        handleAuthSuccess();
    }, [location, navigate, setProfileData]);

    return (
        <div style={{ 
            textAlign: 'center', 
            marginTop: '50px', 
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #1f2937, #111827, #1f2937)'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    border: '4px solid #3b82f6',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                }}></div>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                Authentication Successful!
            </h2>
            <p style={{ color: '#9ca3af' }}>Redirecting you to your dashboard...</p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AuthSuccessPage;