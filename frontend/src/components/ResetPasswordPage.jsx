import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Reuse styles

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { token } = useParams(); // Gets the reset token from the URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        if (password !== password2) {
            setIsError(true);
            return setMessage('Passwords do not match.');
        }
        try {
            const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
            setIsError(false);
            setMessage(res.data.message);
            // Redirect to login after a delay
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setIsError(true);
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
                    {message && (
                        <div className={isError ? 'error-message' : 'success-message'}>
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} minLength="6" required />
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