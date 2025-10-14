const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

require('dotenv').config();

// Bring in the passport configuration
require('./config/passport-setup');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Mongoose Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Passport & Session Middleware ---
app.use(
  session({
    secret: 'a_secret_key_for_the_session', // Replace with a real secret in production
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// ---------------------------------

// Define Routes
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('InvestIQ API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});