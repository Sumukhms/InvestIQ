import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'; // <-- IMPORT THE NEW CSS FILE

const SignUpPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' });
    const navigate = useNavigate();
    const { name, email, password, password2 } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== password2) {
            alert('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post('/api/auth/register', { name, email, password });
            console.log('Backend response:', res.data);
            alert('Registration successful! Please check your email for a verification code.');
            navigate('/verify-email');
        } catch (err) {
            let errorMessage = 'Registration failed. Please try again.';
            if (err.response && err.response.data && err.response.data.msg) {
                errorMessage = err.response.data.msg;
            }
            console.error('Registration error:', errorMessage);
            alert(errorMessage);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-panel">
                    <div className="header">
                        <h1>Create Your Account</h1>
                        <p>Join InvestIQ to get started on your investment journey.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" name="name" value={name} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" name="email" value={email} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Create Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={onChange} minLength="6" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password</label>
                            <input type="password" id="password2" name="password2" value={password2} onChange={onChange} minLength="6" required />
                        </div>
                        
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                        
                        <div className="separator">or continue with</div>
                        <div className="social-login">
                           <a href="http://localhost:5000/api/auth/google" className="btn btn-social">
                                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_105_22)"><path d="M17.64 9.20455C17.64 8.56682 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 12.9805 12.915 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/><path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9873 5.48182 18 9 18Z" fill="#34A853"/><path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29H0.957275C0.347727 8.55 0 10.1332 0 11.29C0 8.86682 0.347727 7.45818 0.957275 4.95818V2.62636H3.96409C4.67182 4.75 6.65591 6.33318 9 6.33318C10.2109 6.33318 11.2418 6.65227 12.0477 7.19227L14.9564 4.93409C13.4673 3.55955 11.43 2.75455 9 2.75455C5.48182 2.75455 2.43818 4.70455 0.957275 6.95818V7.04182C0.347727 5.45 0 3.13318 0 0.709091C0.347727 2.54182 0.957275 4.95818 0.957275 4.95818V7.29Z" fill="#FBBC05"/><path d="M9 6.33318C12.3227 6.33318 13.3664 7.665 11.9564 9.04909L12.0477 7.19227C11.2418 6.65227 10.2109 6.33318 9 6.33318C6.65591 6.33318 4.67182 7.91636 3.96409 10H0.957275V7.04182C2.43818 4.70455 5.48182 2.75455 9 2.75455C11.43 2.75455 13.4673 3.55955 14.9564 4.93409L12.0477 7.19227C11.2418 6.65227 10.2109 6.33318 9 6.33318Z" fill="#EA4335"/></g><defs><clipPath id="clip0_105_22"><rect width="18" height="18" fill="white"/></clipPath></defs></svg>
                                <span>Sign up with Google</span>
                           </a>
                        </div>

                        <div className="footer-links">
                            <p>Already have an account? <Link to="/">Log In</Link></p>
                            <p style={{marginTop: '10px'}}>
                                <Link to="/privacy-policy">Privacy Policy</Link> &bull; <Link to="/terms-of-service">Terms of Service</Link>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="auth-image-panel">
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

export default SignUpPage;