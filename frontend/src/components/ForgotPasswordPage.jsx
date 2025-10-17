import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Auth.css'; // <-- Import the unified CSS file

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            const res = await axios.post('/api/auth/forgot-password', { email });
            setIsError(false);
            setMessage(res.data.message);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container" style={{ maxWidth: '500px', minHeight: 'auto' }}>
                <div className="auth-panel">
                    <div className="header">
                        <h1>Reset Password</h1>
                        <p>Enter your email address to receive a password reset link.</p>
                    </div>
                    {message && <div className={isError ? 'error-message' : 'success-message'}>{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
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