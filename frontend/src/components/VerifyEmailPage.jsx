import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // <-- Import the unified CSS file

const RESEND_TIMEOUT = 60;

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
            return setMessage('Please enter your email to resend the code.');
        }
        setMessage('');
        setIsError(false);
        try {
            const res = await axios.post('/api/auth/resend-verification', { email });
            setIsError(false);
            setMessage(res.data.message);
            setCountdown(RESEND_TIMEOUT);
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
            const res = await axios.post('/api/auth/verify-email', { email, verificationCode });
            setIsError(false);
            setMessage(res.data.message);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'Verification failed.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container" style={{ maxWidth: '500px', minHeight: 'auto' }}>
                <div className="auth-panel">
                    <div className="header">
                        <h1>Verify Your Account</h1>
                        <p>Enter your email and the verification code sent to your inbox.</p>
                    </div>
                    {message && <div className={isError ? 'error-message' : 'success-message'}>{message}</div>}
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
                    </div>
                     <div className="footer-links" style={{marginTop: '1rem'}}>
                        <Link to="/">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;