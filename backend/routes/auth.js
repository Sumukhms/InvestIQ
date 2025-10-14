const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @route   POST api/auth/register
// @desc    Register a user and send verification code
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        } else if (user && !user.isVerified) {
            // If user exists but is not verified, we can resend the code
        } else {
            user = new User({ name, email, password });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = verificationCode;
        user.verificationExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const message = `<h1>Welcome to InvestIQ!</h1><p>Your verification code is: <h2>${verificationCode}</h2></p>`;
        await sendEmail({ email: user.email, subject: 'InvestIQ - Email Verification', html: message });

        res.status(201).json({ msg: 'Registration successful. Please check your email for a verification code.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/verify
// @desc    Verify user's email with code
router.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid verification details.' });
        }
        if (user.verificationCode !== verificationCode || user.verificationExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired verification code.' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationExpires = undefined;
        await user.save();

        res.json({ msg: 'Email verified successfully. You can now log in.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/auth/login
// @desc    Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ msg: 'Invalid Credentials' }); }
        if (!user.isVerified && user.password) { return res.status(400).json({ msg: 'Please verify your email before logging in.' }); }
        if (!user.password) { return res.status(400).json({ msg: 'This account was created with Google. Please use Google Login.' }); }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ msg: 'Invalid Credentials' }); }
        
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'a_default_secret_key', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});


// @route   POST api/auth/forgot-password
// @desc    Send password reset link
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) { return res.status(404).json({ msg: 'User with that email does not exist.' }); }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `<h1>Password Reset Request</h1><p>Please click this link to reset your password:</p><a href="${resetUrl}" clicktracking=off>${resetUrl}</a>`;
        await sendEmail({ email: user.email, subject: 'InvestIQ - Password Reset', html: message });
        
        res.json({ msg: 'A password reset link has been sent to your email. Please check your spam folder also.' });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});


// @route   POST api/auth/reset-password/:token
// @desc    Reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/auth/google
// @desc    Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const payload = { user: { id: req.user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'a_default_secret_key', { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    });
});


// @route   GET api/auth/logout
// @desc    Logs user out and destroys session
router.get('/logout', (req, res, next) => {
  // req.logout() is a Passport.js function that terminates the login session.
  req.logout(function(err) {
    if (err) { return next(err); }
    // req.session.destroy() removes the session from the server's memory.
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session during logout:", err);
        return res.status(500).json({ msg: 'Failed to destroy session.' });
      }
      // This clears the session cookie from the user's browser.
      res.clearCookie('connect.sid');
      res.status(200).json({ msg: 'Logout successful.' });
    });
  });
});

module.exports = router;
