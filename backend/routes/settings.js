const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/settings
// @desc    Get current user's settings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Return the settings object, or defaults if not set
    res.json(user.settings || {});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/settings
// @desc    Update current user's settings
// @access  Private
router.put('/', auth, async (req, res) => {
  // Destructure all expected settings from the request body
  const {
    theme,
    defaultLandingPage,
    language,
    emailNewsAlerts,
    emailProductUpdates,
    inAppNotifications,
    twoFactorEnabled,
    newsApiKey,
    geminiApiKey,
  } = req.body;

  // Build the settings object to update using dot notation for the nested document
  const settingsFields = {};
  if (theme !== undefined) settingsFields['settings.theme'] = theme;
  if (defaultLandingPage !== undefined) settingsFields['settings.defaultLandingPage'] = defaultLandingPage;
  if (language !== undefined) settingsFields['settings.language'] = language;
  if (emailNewsAlerts !== undefined) settingsFields['settings.emailNewsAlerts'] = emailNewsAlerts;
  if (emailProductUpdates !== undefined) settingsFields['settings.emailProductUpdates'] = emailProductUpdates;
  if (inAppNotifications !== undefined) settingsFields['settings.inAppNotifications'] = inAppNotifications;
  if (twoFactorEnabled !== undefined) settingsFields['settings.twoFactorEnabled'] = twoFactorEnabled;
  if (newsApiKey !== undefined) settingsFields['settings.newsApiKey'] = newsApiKey;
  if (geminiApiKey !== undefined) settingsFields['settings.geminiApiKey'] = geminiApiKey;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: settingsFields },
      { new: true, upsert: true } // new: true returns the updated doc, upsert: true creates the object if it doesn't exist
    ).select('settings');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
