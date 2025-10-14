// PUT THIS AT THE VERY TOP, BEFORE ANYTHING ELSE
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

// We can now remove the separate config file as it's not needed
// const config = require('./config/config'); 

// --- For Debugging: Let's check if the keys are loaded ---
console.log('SENDGRID_API_KEY loaded:', !!process.env.SENDGRID_API_KEY);
console.log('EMAIL_USER loaded:', process.env.EMAIL_USER);
// ---------------------------------------------------------

require('./config/passport-setup'); // Passport config

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Mongoose Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Passport & Session Middleware ---
app.use(session({ secret: 'some_session_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define Routes
app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});