const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    date: {
        type: Date,
        default: Date.now
    },
    
    // --- FIELDS FOR EMAIL VERIFICATION (MISSING) ---
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

    // --- FIELDS FOR PASSWORD RESET ---
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

module.exports = mongoose.model('User', UserSchema);