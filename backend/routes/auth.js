const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // Import passport

const User = require('../models/User');

// --- Standard Registration ---
router.post('/register', async (req, res) => {
    // ... (Your existing registration code remains here)
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'a_default_secret_key', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Standard Login ---
router.post('/login', async (req, res) => {
    // ... (Your existing login code remains here)
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        // For Google-signed-up users who try to log in manually
        if (!user.password) {
            return res.status(400).json({ msg: 'Please log in with your Google account.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'a_default_secret_key', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- NEW GOOGLE OAUTH ROUTES ---

// @route   GET api/auth/google
// @desc    Initiate Google OAuth login
// @access  Public
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // We ask Google for the user's profile info and email
}));


// @route   GET api/auth/google/callback
// @desc    Google OAuth callback URL
// @access  Public
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // This function runs after passport successfully authenticates the user
    // The user object is attached to the request at req.user
    
    // We will now create a JWT for this user
    const payload = {
        user: {
            id: req.user.id
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET || 'a_default_secret_key',
        { expiresIn: 3600 },
        (err, token) => {
            if (err) throw err;
            // This is a common way to pass the token to the frontend after OAuth
            // We redirect the user to a specific frontend route with the token
            res.redirect(`http://localhost:5173/dashboard?token=${token}`);
        }
    );
});

module.exports = router;