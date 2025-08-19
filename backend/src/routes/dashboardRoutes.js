/**
 * Dashboard Routes
 * API endpoints for dashboard functionality
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const logger = require('../config/logger');

// Middleware to log all dashboard requests
router.use((req, res, next) => {
  logger.info(`Dashboard API Request: ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    await dashboardController.getDashboardStats(req, res);
  } catch (error) {
    logger.error('Error in get dashboard stats route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/dashboard/chart
 * Get chart data
 */
router.get('/chart', async (req, res) => {
  try {
    await dashboardController.getChartData(req, res);
  } catch (error) {
    logger.error('Error in get chart data route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/dashboard/activities
 * Get recent activities
 */
router.get('/activities', async (req, res) => {
  try {
    await dashboardController.getRecentActivities(req, res);
  } catch (error) {
    logger.error('Error in get recent activities route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/dashboard/quick-stats
 * Get quick statistics
 */
router.get('/quick-stats', async (req, res) => {
  try {
    await dashboardController.getQuickStats(req, res);
  } catch (error) {
    logger.error('Error in get quick stats route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router; 