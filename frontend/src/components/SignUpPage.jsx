import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignUpPage.css'; // Make sure this CSS file exists

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { name, email, password, password2 } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsError(false);

        if (password !== password2) {
            setIsError(true);
            setMessage('Passwords do not match.');
            return;
        }
        
        try {
            // Use the relative URL for the proxy
            const res = await axios.post('/api/auth/register', { name, email, password });
            
            setIsError(false);
            setMessage(res.data.message); // Show the success message

            // Redirect to the verification page after a short delay
            setTimeout(() => {
                navigate('/verify-email');
            }, 2000);

        } catch (err) {
            setIsError(true);
            // Correctly read the standardized 'message' from your backend
            setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="login-container-wrapper">
            <div className="login-container">
                <div className="left-panel">
                    <div className="header">
                        <h1>Create Your Account</h1>
                        <p>Join InvestIQ to get started on your investment journey.</p>
                    </div>

                    {/* Display success or error messages directly on the page */}
                    {message && (
                        <div className={isError ? 'error-message' : 'success-message'}>
                            {message}
                        </div>
                    )}

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
                            <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password</label>
                            <input type="password" name="password2" value={password2} onChange={onChange} minLength="6" required />
                        </div>
                        
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                        
                        <div className="separator">or continue with</div>
                        <div className="social-login">
                           <a href="http://localhost:5000/api/auth/google" className="btn btn-social"><span>Google</span></a>
                           <button type="button" className="btn btn-social"><span>LinkedIn</span></button>
                        </div>

                        <div className="footer-links">
                            Already have an account? <Link to="/">Log In</Link>
                        </div>
                    </form>
                </div>

                <div className="right-panel">
                    <div className="quote-container">
                        <blockquote>"The secret of getting ahead is getting started."</blockquote>
                        <footer>- Mark Twain</footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;