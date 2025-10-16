import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            return setMessage('Passwords do not match.');
        }
        setMessage('');
        try {
            const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className="login-container-wrapper">
            <div className="login-container">
                <div className="left-panel">
                    <div className="header">
                        <h1>Choose a New Password</h1>
                    </div>
                    {message && <p className="message">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Reset Password</button>
                    </form>
                     <div className="footer-links">
                        <Link to="/">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;