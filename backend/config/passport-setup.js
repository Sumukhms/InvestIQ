const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function is called after the user authenticates with Google
      const newUser = {
        name: profile.displayName,
        email: profile.emails[0].value,
        // We don't get a password from Google, so we'll handle this differently
      };

      try {
        // Check if user already exists in our database
        let user = await User.findOne({ email: newUser.email });

        if (user) {
          // If user exists, pass them to the next step
          done(null, user);
        } else {
          // If not, create a new user in our database
          // Note: We are not saving a password for Google-authenticated users
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});