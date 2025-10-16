import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Reuse styles for consistency

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            // This calls the /forgot-password route on your backend
            const res = await axios.post('/api/auth/forgot-password', { email });
            setIsError(false);
            setMessage(res.data.message);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container-wrapper">
            <div className="login-container">
                <div className="left-panel">
                    <div className="header">
                        <h1>Reset Your Password</h1>
                        <p>Enter your email address, and we'll send you a link to get back into your account.</p>
                    </div>

                    {message && (
                        <div className={isError ? 'error-message' : 'success-message'}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Send Reset Link</button>
                    </form>
                    <div className="footer-links">
                        <Link to="/">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;