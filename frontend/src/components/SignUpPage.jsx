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

            alert('Registration successful! Redirecting to login...');
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
        <div className="signup-container-wrapper">
            <div className="signup-container">
                <div className="left-panel-signup">
                    <div className="header-signup">
                        <h1>Create Your Account</h1>
                        <p>Join InvestIQ to get started.</p>
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
                            <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password</label>
                            <input type="password" name="password2" value={password2} onChange={onChange} minLength="6" required />
                        </div>
                        
                        <div className="terms-agreement">
                            <input type="checkbox" id="terms" name="terms" required />
                            <label htmlFor="terms">I agree to the <a href="#">Terms of Service</a></label>
                        </div>

                        <button type="submit" className="btn btn-primary-signup">Sign Up</button>
                        
                        <div className="footer-links-signup">
                            Already have an account? <Link to="/">Log In</Link>
                        </div>
                    </form>
                </div>

                <div className="right-panel-signup"></div>
            </div>
        </div>
    );
};

export default SignUpPage;