const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Alert = require('../models/Alert');

// @route   GET api/alerts
// @desc    Get all alerts for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id })
                             .sort({ createdAt: -1 })
                             .limit(20); // Get latest 20
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/alerts/markread
// @desc    Mark all unread alerts as read
// @access  Private
router.post('/markread', authMiddleware, async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ msg: 'Alerts marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;