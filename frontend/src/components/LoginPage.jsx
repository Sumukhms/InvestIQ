import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // ... (rest of the code is the same)
        try {
            const url = 'http://localhost:5000/api/auth/login';
            const res = await axios.post(url, formData);
            localStorage.setItem('token', res.data.token);
            alert('Login successful! Redirecting...');
            // This will point to the real dashboard later
            navigate('/dashboard'); 
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Login failed.';
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
                                <input 
                                    type={passwordVisible ? "text" : "password"} 
                                    id="password" 
                                    name="password" 
                                    value={password} 
                                    onChange={onChange} 
                                    required 
                                />
                                <span className="password-toggle" onClick={togglePasswordVisibility}>{passwordVisible ? 'HIDE' : 'SHOW'}</span>
                            </div>
                        </div>
                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" name="remember" />
                                <label htmlFor="remember">Remember Me</label>
                            </div>
                            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                        </div>
                        <button type="submit" className="btn btn-primary">Log In</button>
                        <div className="separator">or continue with</div>
                        <div className="social-login">
                           <a href="http://localhost:5000/api/auth/google" className="btn btn-social"><span>Google</span></a>
                           <button type="button" className="btn btn-social"><span>LinkedIn</span></button>
                        </div>
                        <div className="footer-links">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                            <br />
                            {/* --- UPDATED LINKS FOR FUNCTIONALITY/PLACEHOLDER --- */}
                            <a 
                                href="/privacy-policy" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Privacy Policy
                            </a> 
                            &bull; 
                            <a 
                                href="/terms-of-service" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </form>
                </div>
                <div className="right-panel">
                    <div className="quote-container">
                        <blockquote>"The secret of getting ahead is getting started."</blockquote>
                        <footer>- Mark Twain</footer>
                    </div>
                    <div className="news-ticker">
                        <p>🚀 FinTech startup 'Zenith' raises $50M Series B...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;