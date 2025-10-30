// backend/routes/financial.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const FinancialReport = require('../models/FinancialReport');
const Alert = require('../models/Alert'); // Import the Alert model

// @route   POST api/financial
// @desc    Create and save a new financial report
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { reportName, reportData } = req.body;

  if (!reportName || !reportData) {
    return res.status(400).json({ msg: 'reportName and reportData are required.' });
  }

  try {
    const newReport = new FinancialReport({
      user: req.user.id,
      reportName,
      reportData,
    });

    await newReport.save();

    // ✅ Create a new Alert
    try {
      await new Alert({
        userId: req.user.id,
        message: `Your financial report "${newReport.reportName}" has been saved.`,
        link: '/financials'
      }).save();
    } catch (alertErr) {
      console.error('Failed to create financial alert:', alertErr.message);
      // Do not fail the whole request if alert creation fails
    }

    res.status(201).json(newReport);
  } catch (err) {
    console.error('Error saving financial report:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/financial
// @desc    Get all saved financial reports for user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reports = await FinancialReport.find({ user: req.user.id }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching financial reports:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/financial/:id
// @desc    Get single saved financial report
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const report = await FinancialReport.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ msg: 'Financial report not found' });
    }
    res.json(report);
  } catch (err) {
    console.error('Error fetching financial report:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid report ID' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/financial/:id
// @desc    Update an existing financial report (Auto-save)
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { reportName, reportData } = req.body;

  if (!reportName || !reportData) {
    return res.status(400).json({ msg: 'reportName and reportData are required.' });
  }

  try {
    let report = await FinancialReport.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ msg: 'Financial report not found' });
    }

    // Update fields
    report.reportName = reportName;
    report.reportData = reportData;
    report.date = Date.now(); // Update the date

    await report.save();
    // No alert is created here, to prevent spam on auto-save
    res.json(report); // Send back the updated report
  } catch (err) {
    console.error('Error updating financial report:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid report ID' });
    }
    res.status(500).send('Server Error');
  }
});


// @route   DELETE api/financial/:id
// @desc    Delete a saved financial report
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await FinancialReport.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'Financial report not found' });
    }
    res.json({ msg: 'Financial report removed successfully' });
  } catch (err) {
    console.error('Error deleting financial report:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid report ID' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

