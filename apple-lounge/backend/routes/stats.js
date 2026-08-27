const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/statsController');

router.get('/dashboard', authenticate, authorize('admin'), getDashboardStats);

module.exports = router;
