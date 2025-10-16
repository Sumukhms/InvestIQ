import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

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
            const newUser = { name, email, password };
            const url = 'http://localhost:5000/api/auth/register';
            
            const res = await axios.post(url, newUser);
            console.log('Backend response:', res.data);

            alert('Registration successful! Please check your email for a verification code and then log in.');
            navigate('/');

        } catch (err) {
            // --- THIS IS THE UPDATED ERROR HANDLING BLOCK ---
            let errorMessage = 'Registration failed. Please try again.';
            if (err.response && err.response.data && err.response.data.msg) {
                errorMessage = err.response.data.msg; // Use the specific message from the backend
            }
            console.error('Registration error:', errorMessage);
            alert(errorMessage); // Display the specific error to the user
            // ----------------------------------------------------
        }
    };

    return (
        // Use generic class names from LoginPage.css for consistent styling
        <div className="login-container-wrapper">
            <div className="login-container">
                <div className="left-panel">
                    <div className="header">
                        <h1>Create Your Account</h1>
                        <p>Join InvestIQ to get started on your investment journey.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            {/* Removed id for consistency, relying on name */}
                            <input type="text" name="name" value={name} onChange={onChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            {/* Removed id for consistency, relying on name */}
                            <input type="email" name="email" value={email} onChange={onChange} required />
                        </div>
                        {/* Password input structure is updated to match LoginPage */}
                        <div className="form-group">
                            <label htmlFor="password">Create Password</label>
                            <div className="password-wrapper">
                                <input type="password" id="password" name="password" value={password} onChange={onChange} minLength="6" required />
                                {/* Removed password toggle functionality to keep it simple, but kept the wrapper for alignment */}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password</label>
                            <div className="password-wrapper">
                                <input type="password" id="password2" name="password2" value={password2} onChange={onChange} minLength="6" required />
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                        
                        {/* Added Separator and Social Login from LoginPage design */}
                        <div className="separator">or continue with</div>
                        <div className="social-login">
                           <a href="http://localhost:5000/api/auth/google" className="btn btn-social"><span>Google</span></a>
                           <button type="button" className="btn btn-social"><span>LinkedIn</span></button>
                        </div>

                        <div className="footer-links">
                            Already have an account? <Link to="/">Log In</Link>
                            <br />
                            <a href="#">Privacy Policy</a> &bull; <a href="#">Terms of Service</a>
                        </div>
                    </form>
                </div>

                {/* Added the right-panel for the aesthetic split design, mirroring the LoginPage content structure */}
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

export default SignUpPage;