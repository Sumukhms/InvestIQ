const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://startup-funding.p.rapidapi.com/v1/funds', // Using the startup funding API
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'startup-funding.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching funding data:', error);
    res.status(500).send('Failed to fetch data from the funding API.');
  }
});

module.exports = router;