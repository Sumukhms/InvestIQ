import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Reuse styles for consistency

const RESEND_TIMEOUT = 60; // 60 seconds

const VerifyEmailPage = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleResend = async () => {
        if (!email) {
            setIsError(true);
            setMessage('Please enter your email to resend the code.');
            return;
        }
        setMessage('');
        setIsError(false);
        try {
            // This calls the /resend-verification route you created
            const res = await axios.post('/api/auth/resend-verification', { email });
            setIsError(false);
            setMessage(res.data.message);
            setCountdown(RESEND_TIMEOUT); // Start the resend timer
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'Failed to resend code.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            // --- THIS IS THE CRITICAL FIX ---
            // It now correctly calls the '/api/auth/verify-email' endpoint
            const res = await axios.post('/api/auth/verify-email', { email, verificationCode });
            // --------------------------
            
            setIsError(false);
            setMessage(res.data.message); // Show success message
            setTimeout(() => navigate('/'), 2000); // Redirect to login on success
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'Verification failed. Please check the code and try again.');
        }
    };

    return (
        <div className="login-container-wrapper">
             <div className="login-container">
                <div className="left-panel">
                    <div className="header">
                        <h1>Verify Your Email</h1>
                        <p>Enter the code sent to your email address.</p>
                    </div>

                    {/* Display success or error messages */}
                    {message && (
                        <div className={isError ? 'error-message' : 'success-message'}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Verification Code</label>
                            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Verify Account</button>
                    </form>
                    <div className="footer-links">
                        <button onClick={handleResend} disabled={countdown > 0} className="btn-link">
                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                        </button>
                        <Link to="/">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;