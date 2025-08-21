const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @route POST /api/financials/analyze
 * @desc Analyze startup financials and generate projections for burn rate, runway, and other key metrics.
 * @access Private
 */
router.post('/analyze', auth, async (req, res) => {
    try {
        const {
            startingCash,
            monthlyRevenue,
            monthlyExpenses,
            projectionMonths,
            costOfGoodsSold,
            salesAndMarketingCost,
            newCustomers,
            averageCustomerValue,
            averageCustomerLifespan
        } = req.body;

        // Basic validation
        if ([startingCash, monthlyRevenue, monthlyExpenses, projectionMonths].some(val => val === undefined || val === null)) {
            return res.status(400).json({ msg: 'Basic financial inputs are required.' });
        }
        if (startingCash < 0 || monthlyRevenue < 0 || monthlyExpenses < 0 || projectionMonths <= 0) {
            return res.status(400).json({ msg: 'Inputs must be non-negative, and projection months must be greater than zero.' });
        }

        // --- Core Calculations (from previous version) ---
        const netBurnRate = monthlyExpenses - monthlyRevenue;
        const runway = netBurnRate > 0 ? startingCash / netBurnRate : (netBurnRate <= 0 ? Infinity : 0);

        const projectedData = [];
        let currentCash = startingCash;
        for (let i = 1; i <= projectionMonths; i++) {
            currentCash -= netBurnRate;
            projectedData.push({
                month: `Month ${i}`,
                cashBalance: currentCash
            });
        }

        // --- NEW: Advanced Metrics Calculations ---
        const grossMargin = monthlyRevenue > 0 ? (monthlyRevenue - (costOfGoodsSold || 0)) / monthlyRevenue : 0;
        const netProfitMargin = monthlyRevenue > 0 ? (monthlyRevenue - monthlyExpenses) / monthlyRevenue : 0;
        const cac = newCustomers > 0 ? (salesAndMarketingCost || 0) / newCustomers : 0;
        const ltv = (averageCustomerValue || 0) * (averageCustomerLifespan || 0);
        const ltvToCac = cac > 0 ? ltv / cac : Infinity;

        // Return the combined results
        res.json({
            netBurnRate,
            runway,
            projections: projectedData,
            grossMargin,
            netProfitMargin,
            cac,
            ltv,
            ltvToCac
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
