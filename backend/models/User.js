const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    // --- Core Fields ---
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Password is not required for Google OAuth users
    },
    googleId: {
        type: String
    },

    // --- Profile Fields ---
    role: {
        type: String,
        default: 'Other'
    },
    company: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500
    },
    avatar: {
        type: String, // Stores Base64 string of the image
        default: ''
    },

    // --- Email Verification Fields ---
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
    },
    verificationExpires: {
        type: Date,
    },

    // --- Password Reset Fields ---
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    
    // --- Timestamps ---
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving a new user
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new) and is not for an OAuth user
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);