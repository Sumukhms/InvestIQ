const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');

// --- EMAIL & PASSWORD AUTHENTICATION ---

// 1. REGISTER
// @route   POST api/auth/register
// @desc    Register user and send verification email
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (await User.findOne({ email })) {
            // Standardized error message
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }
        const newUser = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.verificationCode = code;
        newUser.verificationExpires = Date.now() + 3600000; // 1 hour
        await newUser.save();
        await sendEmail({
            to: newUser.email,
            subject: 'Your InvestIQ Verification Code',
            html: `<p>Your verification code is: <strong>${code}</strong></p>`
        });
        res.status(200).json({ success: true, message: 'Registration successful! Please check your email for a verification code.' });
    } catch (err) {
        console.error("Register Error:", err.message);
        // Standardized error message
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// 2. VERIFY EMAIL
router.post('/verify-email', async (req, res) => {
    // ... (This route remains the same)
    const { email, verificationCode } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }
        if (user.verificationCode !== verificationCode || user.verificationExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
    } catch (err) {
        console.error("Verify Email Error:", err.message);
        res.status(500).json({ message: 'Server error during verification.' });
    }
});

// 3. NEW: RESEND VERIFICATION CODE
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'This account is already verified.' });
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = code;
        user.verificationExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        await sendEmail({
            to: user.email,
            subject: 'Your New InvestIQ Verification Code',
            html: `<p>Your new verification code is: <strong>${code}</strong></p>`
        });
        res.status(200).json({ success: true, message: 'A new verification code has been sent to your email.' });
    } catch (err) {
        console.error("Resend Code Error:", err.message);
        res.status(500).json({ message: 'Server error while resending code.' });
    }
});

// 4. LOGIN
router.post('/login', async (req, res) => {
    // ... (This route remains the same)
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Your email is not verified. Please check your inbox for a verification code.' });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// 5. NEW: FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Send a success message even if user doesn't exist for security
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `<h1>Password Reset Request</h1><p>Please click this link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`;
        await sendEmail({ to: user.email, subject: 'InvestIQ - Password Reset', html: message });
        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (err) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// 6. NEW: RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error("Reset Password Error:", err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});


// --- GOOGLE OAUTH ---

// 7. INITIATE GOOGLE LOGIN
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // This forces the account chooser
}));

// 8. GOOGLE CALLBACK
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    (req, res) => {
        // ... (This route remains the same)
        const payload = { user: { id: req.user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`http://localhost:5173/auth/success?token=${token}`);
    }
);

// @route   GET api/auth/profile
// @desc    Get the current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    // The user ID is attached to req.user from the auth middleware's token payload
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update the current user's profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  // Destructure all the fields from the request body that can be updated
  const { name, role, company, bio, avatar } = req.body;

  const profileFields = {};
  if (name) profileFields.name = name;
  if (role) profileFields.role = role;
  if (company) profileFields.company = company;
  if (bio) profileFields.bio = bio;
  if (avatar) profileFields.avatar = avatar; // Save the base64 avatar string

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find the user by ID and update their profile with the new fields
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true } // This option returns the updated document
    ).select('-password'); // Exclude the password from the returned object

    res.json(user); // Send back the updated user profile
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;