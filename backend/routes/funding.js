const express = require('express');
const router = express.Router();
const axios = require('axios');
const FundingReport = require('../models/FundingReport');

router.get('/:companyName', async (req, res) => {
    const { companyName } = req.params;
    const { userId } = req.query; // Pass userId as a query parameter

    try {
        const response = await axios.get(`EXTERNAL_API_URL_FOR_FUNDING/${companyName}`);
        const fundingData = response.data;

        // Save the report
        if (userId) {
            const newReport = new FundingReport({
                userId,
                companyName,
                fundingData
            });
            await newReport.save();
        }

        res.json(fundingData);
    } catch (error) {
    console.error('Error fetching funding data:', error);
    res.status(500).send('Failed to fetch data from the funding API.');
  }
});

module.exports = router;