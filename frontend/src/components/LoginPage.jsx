import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Make sure this CSS file exists

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token); // Save token
            navigate('/dashboard'); // Redirect to dashboard
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container-wrapper">
            <div className="login-container">
                <div className="left-panel">
                    <div className="header">
                        <h1>Welcome Back!</h1>
                        <p>Log in to access your InvestIQ dashboard.</p>
                    </div>

                    {message && (
                        <div className={isError ? 'error-message' : 'success-message'}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" name="email" value={email} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={password} onChange={onChange} required />
                        </div>
                        <div className="footer-links" style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                        <button type="submit" className="btn btn-primary">Log In</button>
                    </form>
                    <div className="separator">or continue with</div>
                    <div className="social-login">
                        <a href="http://localhost:5000/api/auth/google" className="btn btn-social"><span>Google</span></a>
                        <button type="button" className="btn btn-social"><span>LinkedIn</span></button>
                    </div>
                    <div className="footer-links">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
                <div className="right-panel">
                    <div className="quote-container">
                        <blockquote>"The best investment you can make is in yourself."</blockquote>
                        <footer>- Warren Buffett</footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;