import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // <-- VERIFY THIS IMPORT

const LoginPage = () => {
    // All the JS code remains the same...
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = 'http://localhost:5000/api/auth/login';
            const res = await axios.post(url, formData);
            localStorage.setItem('token', res.data.token);
            alert('Login successful! Redirecting to dashboard...');
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Login failed. Please try again.';
            console.error('Login error:', errorMessage);
            alert(errorMessage);
        }
    };
    
    return (
        <div className="login-container-wrapper">
            <div className="login-container">
                <div className="left-panel">
                    <div className="header">
                        <h1>InvestIQ</h1>
                        <p>AI-Driven Insights for Startup Success</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={email} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input type={passwordVisible ? "text" : "password"} id="password" name="password" value={password} onChange={onChange} required />
                                <span className="password-toggle" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? 'HIDE' : 'SHOW'}
                                </span>
                            </div>
                        </div>
                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" name="remember" />
                                <label htmlFor="remember">Remember Me</label>
                            </div>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>
                        <button type="submit" className="btn btn-primary">Log In</button>
                        <div className="separator">or continue with</div>
                        <div className="social-login">
                           <a href="http://localhost:5000/api/auth/google" className="btn btn-social">
                                <span>Google</span>
                           </a>
                            <button type="button" className="btn btn-social"><span>LinkedIn</span></button>
                        </div>
                        <div className="footer-links">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                            <br />
                            <a href="#">Privacy Policy</a> &bull; <a href="#">Terms of Service</a>
                        </div>
                    </form>
                </div>
                <div className="right-panel">
                    <div className="quote-container">
                        <blockquote>"The secret of getting ahead is getting started."</blockquote>
                        <footer>- Mark Twain</footer>
                    </div>
                    <div className="news-ticker">
                        <p>🚀 FinTech startup 'Zenith' raises $50M Series B... 📈 Market trends show surge in Deep Tech...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;