import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const url = `http://localhost:5000/api/auth/forgot-password`;
            const res = await axios.post(url, { email });
            setMessage(res.data.msg);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An error occurred. Please try again.';
            setMessage(errorMsg);
        }
    };

    return (
        <div className="forgot-password-wrapper">
            <div className="forgot-password-container">
                <h2>Forgot Your Password?</h2>
                <p>No problem. Enter your email address below and we'll send you a link to reset it.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">Send Reset Link</button>
                </form>
                {message && <p className="response-message">{message}</p>}
                <div className="back-to-login">
                    <Link to="/">Back to Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;