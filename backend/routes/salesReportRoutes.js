const express = require('express');
const router = express.Router();
const salesReportController = require('../controllers/salesReportController');

// Route to get annual sales data by year
router.get('/annual/:year', salesReportController.getAnnualSales);

// Route to get medicine sales distribution
router.get('/medicine-distribution', salesReportController.getMedicineSalesDistribution);

module.exports = router;
