// File: frontend/src/components/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css'; // We will add styles to this file next

const ProfilePage = () => {
    // State to hold the form data
    const [profileData, setProfileData] = useState({
        name: '',
        email: '', // Email will be displayed but not editable
        role: '', // New field for user type
        company: '',
        bio: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    // This runs once when the component loads
    useEffect(() => {
        const fetchProfile = async () => {
            // Get the authentication token from local storage
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found, user is not logged in.");
                setIsLoading(false);
                return;
            }

            try {
                // Set up headers for the authenticated request
                const config = {
                    headers: { 'x-auth-token': token }
                };
                // Fetch user data from the backend
                const res = await axios.get('http://localhost:5000/api/auth/profile', config);

                // Populate the form with fetched data
                setProfileData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    role: res.data.role || '', // Populate role
                    company: res.data.company || '',
                    bio: res.data.bio || ''
                });

            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []); // The empty array ensures this effect runs only once

    // Update state whenever an input field changes
    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            // Send the updated data to the backend
            const res = await axios.put('http://localhost:5000/api/auth/profile', profileData, config);
            setProfileData(res.data); // Update state with the saved data
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Error: Could not update profile.');
        }
    };

    // Show a loading message while fetching data
    if (isLoading) {
        return <div className="loading-container">Loading Profile...</div>;
    }

    return (
        <div className="profile-page-container">
            <form onSubmit={handleSubmit} className="profile-form">
                <h1 className="form-header">Edit Your Profile</h1>
                <p className="form-subheader">Keep your details up to date.</p>

                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={profileData.email}
                        disabled // Make email non-editable
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">I am a...</label>
                    <select id="role" name="role" value={profileData.role} onChange={handleChange}>
                        <option value="">Select your role</option>
                        <option value="Investor">Investor</option>
                        <option value="Student">Student</option>
                        <option value="Founder">Startup Founder</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="company">Company / Institution</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={profileData.company}
                        onChange={handleChange}
                        placeholder="e.g., Your Startup Inc."
                    />
                </div>

                 <div className="form-group">
                    <label htmlFor="bio">Short Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us a little about yourself..."
                    ></textarea>
                </div>

                <div className="profile-actions">
                    <button type="submit" className="save-button">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;